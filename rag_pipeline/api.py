"""
FastAPI API for RAG Pipeline
Provides endpoints for document processing and status checking
"""
import os
import io
from typing import Dict, Any, List, Optional, Union
from datetime import datetime
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file
# Get the project root directory path
project_root = Path(__file__).parent.parent.absolute()
dotenv_path = os.path.join(project_root, ".env")
print(f"Loading .env file from: {dotenv_path}")
load_dotenv(dotenv_path)

from fastapi import FastAPI, HTTPException, BackgroundTasks, UploadFile, File, Form, Depends, Header, Query
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Supabase for auth
from supabase import create_client, Client

# Import RAG pipeline components
from pipeline_manager import RAGPipelineManager
from document_processor import DocumentProcessor
from pdf_processor import PDFProcessor
from website_processor import WebsiteProcessor
from resume_processor import ResumeProcessor

# Import rate limiter
from rate_limiter import RateLimitMiddleware

# Create FastAPI app
app = FastAPI(
    title="Pendo Climate Economy Assistant - RAG Pipeline API",
    description="API for processing documents into the RAG pipeline",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rate Limiting middleware
app.add_middleware(RateLimitMiddleware)

# Initialize Supabase client for auth
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_KEY")

# Debug info
print(f"SUPABASE_URL: {supabase_url}")
print(f"SUPABASE_KEY: {'Present' if supabase_key else 'Missing'}")

if not supabase_url:
    raise ValueError("SUPABASE_URL environment variable is required")
if not supabase_key:
    raise ValueError("SUPABASE_KEY or SUPABASE_SERVICE_KEY environment variable is required")

supabase: Client = create_client(supabase_url, supabase_key)

# Initialize RAG pipeline manager with the same Supabase client
pipeline_manager = RAGPipelineManager(supabase_client=supabase)
workers = None

@app.on_event("startup")
async def startup_event():
    """Start the pipeline workers when the API starts up"""
    global workers
    workers = await pipeline_manager.start_workers()
    print("RAG Pipeline workers started")

@app.on_event("shutdown")
async def shutdown_event():
    """Stop the pipeline workers when the API shuts down"""
    global workers
    if workers:
        for worker in workers:
            worker.cancel()
    print("RAG Pipeline workers stopped")

# Health endpoint for Docker health checks
@app.get("/health")
async def health_check():
    """Health check endpoint for Docker and load balancers"""
    try:
        # Check if Supabase connection is working
        supabase.table('knowledge_resources').select('count').limit(1).execute()
        
        # Check if pipeline manager is initialized
        if pipeline_manager is None:
            raise Exception("Pipeline manager not initialized")
            
        return {
            "status": "healthy",
            "timestamp": datetime.now().isoformat(),
            "service": "rag-pipeline-api",
            "version": "1.0.0",
            "active_workers": len(workers) if workers else 0,
            "active_jobs": len(pipeline_manager.active_jobs)
        }
    except Exception as e:
        raise HTTPException(
            status_code=503, 
            detail={
                "status": "unhealthy",
                "timestamp": datetime.now().isoformat(),
                "error": str(e)
            }
        )

async def validate_token(authorization: str = Header(...)) -> Dict[str, Any]:
    """
    Validate API token and extract user info using Supabase
    
    Args:
        authorization: Authorization header with Bearer token
        
    Returns:
        User information including ID and profile type
    """
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
        
    token = authorization.split(" ")[1]
    
    try:
        # Verify token with Supabase
        user_response = supabase.auth.get_user(token)
        user = user_response.user
        
        if not user:
            raise HTTPException(status_code=401, detail="Invalid token")
            
        # Get user profile info for role-based access
        profile_response = supabase.from_("consolidated_profiles").select("*").eq("id", user.id).execute()
        
        if profile_response.data and len(profile_response.data) > 0:
            profile = profile_response.data[0]
            profile_type = profile.get("profile_type", "user")
        else:
            profile_type = "user"
            
        return {
            "user_id": user.id,
            "email": user.email,
            "profile_type": profile_type
        }
        
    except Exception as e:
        # For development/testing only - allow test token
        if token == "test-token":
            return {
                "user_id": "test-user-id",
                "email": "test@example.com",
                "profile_type": "admin"  # Test token gets admin privileges
            }
            
        # Production error handling
        print(f"Auth error: {e}")
        raise HTTPException(status_code=401, detail="Authentication failed")

@app.post("/process")
async def process_document(
    background_tasks: BackgroundTasks,
    file: Optional[UploadFile] = File(None),
    url: Optional[str] = Form(None),
    title: str = Form(...),
    description: Optional[str] = Form(None),
    content_type: str = Form("article"),
    target_table: str = Form("knowledge_resources"),
    additional_metadata: Optional[str] = Form(None),
    authorization: str = Header(...)
):
    """
    Process a document (file or URL) and store in the specified table
    
    Args:
        background_tasks: FastAPI background tasks
        file: Uploaded file (PDF, etc.)
        url: URL to process (website, etc.)
        title: Document title
        description: Document description
        content_type: Type of content (article, guide, etc.)
        target_table: Target table (knowledge_resources, job_listings, etc.)
        additional_metadata: Additional JSON metadata
        authorization: Bearer token for authentication
        
    Returns:
        Job ID for tracking progress
    """
    try:
        # Validate token
        user_info = await validate_token(authorization)
        user_id = user_info["user_id"]
        profile_type = user_info["profile_type"]
        
        # Check if user has permission for target table
        if target_table != "knowledge_resources" and profile_type not in ["admin", "partner"]:
            raise HTTPException(
                status_code=403, 
                detail="Only admins and partners can add job listings and education programs"
            )
        
        # Validate input
        if not file and not url:
            raise HTTPException(status_code=400, detail="Either file or URL must be provided")
            
        # Build metadata
        metadata = {
            'title': title,
            'description': description,
            'content_type': content_type,
            'user_id': user_id,
            'profile_type': profile_type,
            'created_at': datetime.now().isoformat(),
            'is_published': True
        }
        
        # Add additional metadata if provided
        if additional_metadata:
            try:
                extra_metadata = json.loads(additional_metadata)
                metadata.update(extra_metadata)
            except json.JSONDecodeError:
                raise HTTPException(status_code=400, detail="Invalid additional_metadata format")
        
        # Determine task type and content
        if file:
            # Extract file extension
            filename = file.filename
            extension = filename.split('.')[-1].lower() if '.' in filename else ''
            
            # Determine task type based on extension
            if extension == 'pdf':
                task_type = 'pdf'
            else:
                raise HTTPException(status_code=400, detail=f"Unsupported file type: {extension}")
                
            # Read file content
            content = await file.read()
            
            # Update metadata with filename
            metadata['filename'] = filename
        elif url:
            task_type = 'website'
            content = url
            
            # Update metadata with source URL
            metadata['source_url'] = url
        
        # Queue item for processing
        job_id = await pipeline_manager.queue_item(
            task_type=task_type,
            content=content,
            metadata=metadata,
            target_table=target_table
        )
        
        return {
            'job_id': job_id,
            'status': 'queued',
            'message': 'Document processing started'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/resume/upload")
async def upload_resume(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    authorization: str = Header(...)
):
    """
    Upload and process a resume PDF
    
    Args:
        background_tasks: FastAPI background tasks
        file: Resume PDF file
        authorization: Bearer token for authentication
        
    Returns:
        Job ID for tracking progress
    """
    try:
        # Validate token
        user_info = await validate_token(authorization)
        user_id = user_info["user_id"]
        
        # Validate file
        if not file.filename.lower().endswith('.pdf'):
            raise HTTPException(status_code=400, detail="Resume must be a PDF file")
            
        # Read file content
        content = await file.read()
        
        # Build metadata
        metadata = {
            'filename': file.filename,
            'user_id': user_id,
            'content_type': 'resume',
            'mime_type': 'application/pdf',
            'created_at': datetime.now().isoformat()
        }
        
        # Queue item for processing as resume
        job_id = await pipeline_manager.queue_item(
            task_type='resume',
            content=content,
            metadata=metadata,
            target_table=None  # Target table is ignored for resumes
        )
        
        return {
            'job_id': job_id,
            'status': 'queued',
            'message': 'Resume processing started'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/resume/{user_id}")
async def get_user_resume(
    user_id: str,
    authorization: str = Header(...)
):
    """
    Get resume information for a user
    
    Args:
        user_id: User ID to get resume for
        authorization: Bearer token for authentication
        
    Returns:
        Resume information
    """
    try:
        # Validate token
        user_info = await validate_token(authorization)
        requesting_user_id = user_info["user_id"]
        profile_type = user_info["profile_type"]
        
        # Check if user has permission to view this resume
        if requesting_user_id != user_id and profile_type not in ["admin", "partner"]:
            raise HTTPException(status_code=403, detail="Not authorized to view this resume")
            
        # Check if resume exists
        result = pipeline_manager.resume_processor.check_resume_exists(user_id)
        
        return result
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/status/{job_id}")
async def get_job_status(
    job_id: str, 
    authorization: str = Header(...)
):
    """
    Get the status of a processing job
    
    Args:
        job_id: Job identifier
        authorization: Bearer token for authentication
        
    Returns:
        Job status information
    """
    try:
        # Validate token
        user_info = await validate_token(authorization)
        
        # Get job status
        status = pipeline_manager.get_job_status(job_id)
        
        # If job not found
        if status['status'] == 'not_found':
            raise HTTPException(status_code=404, detail=f"Job {job_id} not found")
            
        return status
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/jobs")
async def list_jobs(
    status: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=100),
    offset: int = Query(0, ge=0),
    authorization: str = Header(...)
):
    """
    List processing jobs with filtering
    
    Args:
        status: Filter by job status
        limit: Maximum number of results
        offset: Result offset for pagination
        authorization: Bearer token for authentication
        
    Returns:
        List of job status information
    """
    try:
        # Validate token
        user_info = await validate_token(authorization)
        user_id = user_info["user_id"]
        profile_type = user_info["profile_type"]
        
        # Get job statuses
        jobs = list(pipeline_manager.active_jobs.values())
        
        # Filter by user_id for regular users (admins can see all)
        if profile_type not in ["admin"]:
            jobs = [
                job for job in jobs 
                if job.get('metadata', {}).get('user_id') == user_id
            ]
        
        # Filter by status if provided
        if status:
            jobs = [job for job in jobs if job['status'] == status]
            
        # Sort by queued time (descending)
        jobs.sort(key=lambda x: x.get('queued_at', ''), reverse=True)
        
        # Apply pagination
        paginated_jobs = jobs[offset:offset + limit]
        
        return {
            'total_count': len(jobs),
            'count': len(paginated_jobs),
            'jobs': paginated_jobs
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/batch")
async def batch_process_documents(
    items: List[Dict[str, Any]],
    authorization: str = Header(...)
):
    """
    Process multiple documents in batch
    
    Args:
        items: List of items to process with keys:
            - task_type: Type of content ('pdf', 'website', etc.)
            - content: Raw content or URL
            - metadata: Additional metadata
            - target_table: Target table for storage
        authorization: Bearer token for authentication
        
    Returns:
        List of job IDs for tracking progress
    """
    try:
        # Validate token
        user_info = await validate_token(authorization)
        user_id = user_info["user_id"]
        profile_type = user_info["profile_type"]
        
        # Check if user has permission for batch processing
        if profile_type not in ["admin", "partner"]:
            raise HTTPException(
                status_code=403, 
                detail="Only admins and partners can use batch processing"
            )
        
        # Validate input
        if not items or not isinstance(items, list):
            raise HTTPException(status_code=400, detail="Invalid batch items")
        
        # Process batch items
        job_ids = []
        for item in items:
            # Add user ID to metadata
            metadata = item.get('metadata', {})
            metadata['user_id'] = user_id
            metadata['profile_type'] = profile_type
            
            # Queue item for processing
            job_id = await pipeline_manager.queue_item(
                task_type=item.get('task_type', 'unknown'),
                content=item.get('content', ''),
                metadata=metadata,
                target_table=item.get('target_table', 'knowledge_resources')
            )
            job_ids.append(job_id)
        
        return {
            'count': len(job_ids),
            'job_ids': job_ids,
            'status': 'queued',
            'message': 'Batch processing started'
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Run with: uvicorn rag_pipeline.api:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
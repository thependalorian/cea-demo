"""
Enhanced Pendo Climate Economy Assistant API with resume analysis capabilities.
"""

print("=== AGENT_API.PY LOADED ===")

import os
import sys
import json
import uuid
import base64
import traceback
import logging
from fastapi import FastAPI, HTTPException, BackgroundTasks, Header
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager, nullcontext
from typing import Optional, List, Dict, Any
import asyncio
import traceback
from datetime import datetime
import sys
import os
from pathlib import Path
import base64
import uuid
from dotenv import load_dotenv
import logging

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global variables for the application
embedding_client = None
supabase = None
http_client = None
mem0_client = None
resume_processor = None

# Use our centralized import helper
from fix_imports import (
    Message, 
    Conversation, 
    ConversationMessage, 
    UserProfile, 
    Request,
    ConversationStatus,
    ConversationType,
    MessageRole,
    Resume,
    ResumeChunk
)

# Import agent components
from agent import RunContext, PendoAgentDeps, pendo_agent

# Add paths for imports
current_dir = Path(__file__).resolve().parent
rag_pipeline_path = str(current_dir.parent / "rag_pipeline")
if rag_pipeline_path not in sys.path:
    sys.path.append(rag_pipeline_path)

# Remove all the old pydantic_agent import code
# Add pydantic_agent to path if needed
# pydantic_agent_path = str(Path(__file__).resolve().parent.parent / "pydantic_agent")
# if pydantic_agent_path not in sys.path:
#     sys.path.append(pydantic_agent_path)
#     print(f"Added pydantic_agent path to agent_api: {pydantic_agent_path}")

# Try importing from pydantic_agent with fallback
# try:
#     # Import our standardized models
#     from pydantic_agent import (
#         Message, 
#         Conversation, 
#         ConversationMessage, 
#         UserProfile, 
#         Request,
#         ConversationStatus,
#         ConversationType,
#         MessageRole
#     )
#     print("Successfully imported models in agent_api")
# except ImportError as e:
#     print(f"Error importing from pydantic_agent in agent_api: {e}")
#     # Try parent directory
#     parent_pydantic_agent_path = str(Path(__file__).resolve().parent.parent.parent / "pydantic_agent")
#     if parent_pydantic_agent_path not in sys.path:
#         sys.path.append(parent_pydantic_agent_path)
#         print(f"Added parent pydantic_agent path to agent_api: {parent_pydantic_agent_path}")
#     try:
#         from pydantic_agent import (
#             Message, 
#             Conversation, 
#             ConversationMessage, 
#             UserProfile, 
#             Request,
#             ConversationStatus,
#             ConversationType,
#             MessageRole
#         )
#         print("Successfully imported models from parent directory")
#     except ImportError as e2:
#         print(f"Failed to import from parent pydantic_agent in agent_api: {e2}")
#         # Use fallback classes
#         from pydantic import BaseModel
#         from enum import Enum
#         from typing import Optional, Dict, Any, List
# 
#         # Define minimal versions of required classes
#         class MessageRole(str, Enum):
#             SYSTEM = "system"
#             USER = "user"
#             ASSISTANT = "assistant"
#             
#         class ConversationStatus(str, Enum):
#             ACTIVE = "active"
#             ARCHIVED = "archived"
#             
#         class ConversationType(str, Enum):
#             CHAT = "chat"
#             JOB_SEARCH = "job_search"
#             CAREER_ADVICE = "career_advice"
#             
#         class Message(BaseModel):
#             content: str
#             role: MessageRole = MessageRole.USER
#             
#         class ConversationMessage(BaseModel):
#             id: Optional[str] = None
#             conversation_id: str
#             content: str
#             role: MessageRole = MessageRole.USER
#             created_at: Optional[str] = None
#             
#         class Conversation(BaseModel):
#             id: str
#             user_id: str
#             title: Optional[str] = None
#             status: ConversationStatus = ConversationStatus.ACTIVE
#             type: ConversationType = ConversationType.CHAT
#             created_at: Optional[str] = None
#             updated_at: Optional[str] = None
#             
#         class UserProfile(BaseModel):
#             id: str
#             email: Optional[str] = None
#             display_name: Optional[str] = None
#             
#         class Request(BaseModel):
#             query: str
#             user_id: str
#             session_id: Optional[str] = None
#             conversation_id: Optional[str] = None
#             context: Optional[Dict[str, Any]] = None
#             stream: bool = False
#             
#         print("Using fallback model classes")

from clients import get_agent_clients, get_mem0_client_async
from agent import pendo_agent, PendoAgentDeps
from resume_processor import ResumeProcessor
from httpx import AsyncClient

# Import rate limiter
from rate_limiter import RateLimitMiddleware

# File attachment model
class FileAttachment(BaseModel):
    filename: str
    content: str  # base64 encoded
    mime_type: str
    name: Optional[str] = None  # Support both filename and name for compatibility

# Request model - Using our standardized Request model as a base
class PendoAgentRequest(Request):
    files: Optional[List[FileAttachment]] = None

# Response models - Using our standardized models as a base
class PendoAgentResponse(BaseModel):
    response: str
    session_id: str
    conversation_id: Optional[str] = None
    user_id: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize and cleanup resources"""
    global embedding_client, supabase, http_client, mem0_client, resume_processor
    
    try:
        logger.info("🌱 Initializing Pendo Climate Economy Assistant...")
        
        # Check for required environment variables
        required_env_vars = [
            "SUPABASE_URL", 
            "SUPABASE_SERVICE_KEY"
        ]
        
        # OPENAI_API_KEY is optional in demo mode since users provide their own
        optional_env_vars = ["OPENAI_API_KEY"]
        
        missing_vars = [var for var in required_env_vars if not os.getenv(var)]
        
        if missing_vars:
            logger.error(f"❌ Missing required environment variables: {', '.join(missing_vars)}")
            logger.error("Please create a .env file with these variables or set them in your environment")
            raise EnvironmentError(f"Missing environment variables: {', '.join(missing_vars)}")
        
        # Check optional variables
        missing_optional = [var for var in optional_env_vars if not os.getenv(var)]
        if missing_optional:
            logger.warning(f"⚠️  Missing optional environment variables: {', '.join(missing_optional)}")
            logger.warning("These will be provided by users in demo mode")
        
        # Initialize clients
        logger.info("Initializing clients...")
        try:
            supabase, embedding_client, http_client = await get_agent_clients()
            logger.info("Clients initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing clients: {e}")
            raise e
        
        try:
            mem0_client = await get_mem0_client_async()
            logger.info("Memory client initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing memory client: {e}")
            raise e
        
        try:
            logger.info("Creating ResumeProcessor...")
            resume_processor = ResumeProcessor()
            logger.info("ResumeProcessor created successfully")
        except Exception as e:
            logger.error(f"Error creating ResumeProcessor: {e}")
            raise e
        
        try:
            logger.info("Initializing ResumeProcessor Supabase...")
            await resume_processor._init_supabase()
            logger.info("ResumeProcessor Supabase initialized successfully")
        except Exception as e:
            logger.error(f"Error initializing ResumeProcessor Supabase: {e}")
            raise e
        
        logger.info("✅ Pendo Assistant initialized successfully")
        yield
        
    except Exception as e:
        logger.error(f"❌ Error during initialization: {e}")
        traceback.print_exc()
        yield
    finally:
        # Cleanup
        if http_client:
            await http_client.aclose()
        logger.info("🔄 Pendo Assistant shutdown complete")

# Initialize FastAPI app
app = FastAPI(
    title="Pendo Climate Economy Assistant API",
    description="AI agent specializing in Massachusetts climate careers and workforce development",
    version="1.0.0",
    lifespan=lifespan
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

def stream_error_response(error_message: str, session_id: str = None):
    """Stream error response in SSE format"""
    yield f"data: {json.dumps({'error': error_message, 'session_id': session_id})}\n\n"
    yield "event: end\ndata: {}\n\n"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "service": "pendo-agent-api",
        "version": "1.0.0"
    }

async def process_file_attachments(files: Optional[List[FileAttachment]], user_id: str = None) -> List[Dict[str, Any]]:
    """Process file attachments and return processed results"""
    if not files:
        return []
    
    processed_files = []
    
    for file in files:
        try:
            logger.info(f"Processing file: {file.filename or file.name}, type: {file.mime_type}")
            
            # Decode base64 content
            content = base64.b64decode(file.content)
            
            # Use filename or name field for compatibility
            file_name = file.filename or file.name or "unknown_file"
            
            # Process based on mime type
            if file.mime_type.startswith('application/pdf'):
                logger.info(f"Processing PDF resume: {file_name}")
                # Process PDF as resume with enhanced analysis
                result = await process_resume_file_enhanced(content, file_name, user_id, file.mime_type)
                logger.info(f"PDF processing result: {result}")
                processed_files.append({
                    "filename": file_name,
                    "type": "resume",
                    "result": result,
                    "content": file.content,  # Keep base64 for vision model
                    "mime_type": file.mime_type
                })
            elif file.mime_type.startswith('text/'):
                logger.info(f"Processing text resume: {file_name}")
                # Process text files as resume with enhanced analysis
                result = await process_resume_file_enhanced(content, file_name, user_id, file.mime_type)
                logger.info(f"Text processing result: {result}")
                processed_files.append({
                    "filename": file_name,
                    "type": "resume",
                    "result": result,
                    "content": file.content,  # Keep base64 for vision model
                    "mime_type": file.mime_type
                })
            elif file.mime_type.startswith('image/'):
                # Process images for vision analysis
                processed_files.append({
                    "filename": file_name,
                    "type": "image",
                    "result": {"message": "Image ready for vision analysis"},
                    "content": file.content,
                    "mime_type": file.mime_type
                })
            else:
                processed_files.append({
                    "filename": file_name,
                    "type": "unsupported",
                    "result": {
                        "error": f"Unsupported file type: {file.mime_type}"
                    }
                })
        except Exception as e:
            file_name = file.filename or file.name or "unknown_file"
            processed_files.append({
                "filename": file_name,
                "type": "error",
                "result": {
                    "error": str(e)
                }
            })
    
    return processed_files

@app.post("/api/pendo-agent")
async def pendo_agent_endpoint(request: PendoAgentRequest, x_openai_api_key: Optional[str] = Header(None)):
    """Main endpoint for the Pendo Climate Economy Assistant"""
    
    try:
        logger.info("=== PENDENTO AGENT ENDPOINT CALLED ===")
        
        # Create a new session ID and conversation ID since they're not in the Request model
        session_id = str(uuid.uuid4())
        conversation_id = str(uuid.uuid4())
        
        logger.info(f"Received request with {len(request.files) if request.files else 0} files")
        if request.files:
            for file in request.files:
                logger.info(f"File: {file.filename or file.name}, type: {file.mime_type}")
        
        # Process any file attachments
        processed_files = await process_file_attachments(request.files, request.user_id)
        logger.info(f"Processed {len(processed_files)} files")
        
        # DEMO MODE: Use API key from header
        # This is the key provided by the user in the frontend
        custom_api_key = x_openai_api_key
        
        # Initialize new clients with the custom API key - this is crucial
        # so we don't use any environment variables for OpenAI
        temp_supabase, temp_embedding_client, temp_http_client = await get_agent_clients(custom_api_key=custom_api_key)
        
        # Prepare context with file processing results
        context = {
            "processed_files": processed_files,
            "user_id": request.user_id,
            "session_id": session_id,
            "conversation_id": conversation_id,
            "custom_api_key": custom_api_key
        }
        
        # Get a memory client for conversation context
        mem0_client = await get_mem0_client_async()
        
        # Initialize a resume processor for enhanced analysis
        resume_processor = ResumeProcessor()
        await resume_processor._init_supabase()
        
        # Create common run context with files
        run_context = RunContext(
            deps=PendoAgentDeps(
                supabase=temp_supabase,
                embedding_client=temp_embedding_client,
                http_client=temp_http_client,
                mem0_client=mem0_client,
                resume_processor=resume_processor,
                custom_api_key=custom_api_key
            ),
            files=processed_files,  # Pass processed files directly to RunContext
            request={
                "user_id": request.user_id,
                "conversation_id": conversation_id,
                "session_id": session_id,
                "context": context
            }
        )
        
        # Create conversation message
        message = Message(
            id=str(uuid.uuid4()),
            conversation_id=conversation_id,
            content=request.actual_query,  # Use actual_query property
            role=MessageRole.USER
        )
        
        # For now, always return non-streaming response since stream field is not in Request model
        try:
            response_text = await pendo_agent(
                run_context,
                [message],
                stream=False
            )
            
            return PendoAgentResponse(
                response=response_text,
                session_id=session_id,
                conversation_id=conversation_id,
                user_id=str(request.user_id)
            )
        except Exception as e:
            traceback.print_exc()
            raise HTTPException(status_code=500, detail=str(e))
            
    except Exception as e:
        logger.error(f"Error in pendo_agent_endpoint: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
    
    async def stream_generator():
        """Generate streaming response"""
        try:
            # Get streaming response from agent
            generator = await pendo_agent(
                run_context,
                [message],
                stream=True
            )
            
            # Stream the tokens
            async for token in generator:
                # Format as server-sent event
                data = {
                    "token": token,
                    "session_id": session_id,
                    "conversation_id": conversation_id,
                    "user_id": request.user_id
                }
                yield f"data: {json.dumps(data)}\n\n"
            
            # End the stream
            yield "event: end\ndata: {}\n\n"
            
        except Exception as e:
            # Handle errors in the stream
            logger.error(f"Error in stream: {e}")
            error_data = {
                "error": str(e),
                "session_id": session_id
            }
            yield f"data: {json.dumps(error_data)}\n\n"
            yield "event: end\ndata: {}\n\n"

@app.get("/api/resume/check/{user_id}")
async def check_user_resume(user_id: str):
    """Check if a user has a resume uploaded"""
    try:
        # Create a new resume processor instance
        processor = ResumeProcessor()
        await processor._init_supabase()
        result = processor.check_resume_exists(user_id)
        return {"has_resume": result}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/resume/search")
async def search_resume_content(query: str, user_id: Optional[str] = None, limit: int = 5):
    """Search resume content using vector search"""
    try:
        # Create a new resume processor instance
        processor = ResumeProcessor()
        await processor._init_supabase()
        results = processor.search_resume_content(query, user_id, limit)
        return {"results": results}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/test")
async def test_endpoint():
    """Test endpoint to verify routing is working"""
    logger.info("=== TEST ENDPOINT CALLED ===")
    return {"message": "Test endpoint working"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002) 
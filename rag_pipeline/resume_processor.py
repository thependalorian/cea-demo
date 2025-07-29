"""
Resume Processor for Pendo Climate Economy Assistant RAG Pipeline
Specializes in processing resumes with vector embeddings for job matching
"""
import io
import base64
import hashlib
import json
from typing import Dict, Any, List, Union, Optional
from datetime import datetime
from pathlib import Path
from uuid import uuid4
import sys


# Add pydantic_agent to path if needed
pydantic_agent_path = str(Path(__file__).resolve().parent.parent / "pydantic_agent")
if pydantic_agent_path not in sys.path:
    sys.path.append(pydantic_agent_path)
    print(f"Added pydantic_agent path to resume_processor: {pydantic_agent_path}")

# Try importing from pydantic_agent with fallback
try:
    # Import our standardized models
    from pydantic_agent import Resume, ResumeChunk
    print("Successfully imported models in resume_processor")
except ImportError as e:
    print(f"Error importing from pydantic_agent in resume_processor: {e}")
    # Try parent directory
    parent_pydantic_agent_path = str(Path(__file__).resolve().parent.parent.parent / "pydantic_agent")
    if parent_pydantic_agent_path not in sys.path:
        sys.path.append(parent_pydantic_agent_path)
        print(f"Added parent pydantic_agent path to resume_processor: {parent_pydantic_agent_path}")
    try:
        from pydantic_agent import Resume, ResumeChunk
        print("Successfully imported models from parent directory")
    except ImportError as e2:
        print(f"Failed to import from parent pydantic_agent in resume_processor: {e2}")
        # Create fallback classes if needed
        from pydantic import BaseModel
        print("Using fallback Resume and ResumeChunk classes")
        class Resume(BaseModel):
            """Fallback Resume class"""
            id: str
            user_id: str
            file_name: str
            file_size: Optional[int] = None
            content: Optional[str] = None
            
        class ResumeChunk(BaseModel):
            """Fallback ResumeChunk class"""
            id: str
            resume_id: str
            content: str
            chunk_index: int

# Import base processor
from document_processor import DocumentProcessor

class ResumeProcessor(DocumentProcessor):
    """
    Resume document processor with specialized extraction and storage methods
    Extends the base DocumentProcessor for resume-specific functionality
    """
    
    async def extract_text(self, content: Union[bytes, str]) -> str:
        """
        Extract text from PDF resume
        
        Args:
            content: PDF content as bytes
            
        Returns:
            Extracted text string
        """
        # Call the extract_text_from_pdf method which is implemented below
        return self.extract_text_from_pdf(content)
        
    def extract_text_from_pdf(self, pdf_content: bytes) -> str:
        """
        Extract text from PDF with fallback methods
        
        Args:
            pdf_content: Raw PDF bytes
            
        Returns:
            Extracted text string
        """
        try:
            # Method 1: Try pypdf first
            try:
                import pypdf
                pdf_reader = pypdf.PdfReader(io.BytesIO(pdf_content))
                text_parts = []
                for i, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text and page_text.strip():
                        text_parts.append(f"Page {i+1}:\n{page_text}")
                text = '\n\n'.join(text_parts)
                if text.strip():
                    return text
            except Exception as e:
                print(f"pypdf extraction failed: {e}")
                
            # Method 2: Fallback to PyPDF2
            try:
                import PyPDF2
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(pdf_content))
                text_parts = []
                for i, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text and page_text.strip():
                        text_parts.append(f"Page {i+1}:\n{page_text}")
                text = '\n\n'.join(text_parts)
                if text.strip():
                    return text
            except Exception as e:
                print(f"PyPDF2 extraction failed: {e}")
                
            # If both methods fail
            return "Unable to extract text from resume PDF. Text extraction failed."
            
        except Exception as e:
            print(f"Critical error in resume PDF extraction: {e}")
            return f"Critical error during resume PDF text extraction: {str(e)}"
    
    def generate_resume_id(self, content: bytes, filename: str) -> str:
        """
        Generate unique ID for resume based on content hash
        
        Args:
            content: PDF content bytes
            filename: Original filename
            
        Returns:
            Unique resume ID
        """
        content_hash = hashlib.md5(content).hexdigest()
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        return f"resume_{content_hash[:8]}_{timestamp}"
    
    async def process_resume(self, pdf_content: bytes, filename: str, user_id: str = None) -> Dict[str, Any]:
        """
        Process a resume PDF document
        
        Args:
            pdf_content: Raw PDF bytes
            filename: Original filename
            user_id: Optional user ID for association
            
        Returns:
            Processing result with resume ID and metadata
        """
        try:
            # Build metadata
            metadata = {
                'title': filename,
                'user_id': user_id,
                'content_type': 'resume',
                'mime_type': 'application/pdf',
                'filename': filename
            }
            
            # Generate unique resume ID
            resume_id = self.generate_resume_id(pdf_content, filename)
            metadata['resume_id'] = resume_id
            
            # Process document using base class method
            result = await self.process_document(pdf_content, metadata)
            
            # Add resume-specific info
            if result['success']:
                result['resume_id'] = resume_id
            
            return result
            
        except Exception as e:
            print(f"Error processing resume: {e}")
            return {
                "success": False,
                "error": str(e),
                "resume_id": None
            }
    
    async def store_resume_metadata(self, resume_id: str, filename: str, full_text: str, 
                                   pdf_content: bytes, user_id: str = None) -> None:
        """
        Store resume metadata in document_metadata table
        Specialized version for resumes using our Resume model
        
        Args:
            resume_id: Unique resume ID
            filename: Original filename
            full_text: Extracted text content
            pdf_content: Raw PDF bytes
            user_id: Optional user ID
        """
        # Encode PDF content as base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        # Build schema for backward compatibility
        schema = {
            "type": "resume",
            "filename": filename,
            "text_length": len(full_text),
            "processing_date": datetime.now().isoformat(),
            "user_id": user_id,
            "content_type": "application/pdf",
            "file_size_bytes": len(pdf_content)
        }
        
        # Create Resume model instance for structured data
        resume = Resume(
            id=resume_id,
            user_id=user_id if user_id else str(uuid4()),
            file_name=filename,
            file_size=len(pdf_content),
            content_type="application/pdf",
            processed=True,
            content=full_text[:1000000] if full_text else "",  # Truncate if too long
            created_at=datetime.now().isoformat(),
            updated_at=datetime.now().isoformat(),
            processing_status="completed",
            processed_at=datetime.now().isoformat(),
            # Initialize other required fields with default values
            chunks=[],
            skills_extracted=[],
            work_experience=[],
            job_titles=[],
            contact_info={},
            industries=[],
            job_categories=[],
            preferred_locations=[],
            certifications=[]
        )
        
        # Build metadata record (keeping existing structure for compatibility)
        metadata = {
            "id": resume_id,
            "title": filename,
            "url": f"resume://{resume_id}",
            "schema": json.dumps(schema),
            "content": full_text,
            "pdf_content": pdf_base64
        }
        
        # Insert into document_metadata
        self.supabase.table("document_metadata").insert(metadata).execute()
        
        # Also store in resumes table using our model
        try:
            self.supabase.table("resumes").insert(resume.model_dump()).execute()
        except Exception as e:
            print(f"Note: Could not store in resumes table (may not exist yet): {e}")
            
        print(f"Stored resume metadata for: {filename}")
    
    async def store_resume_chunks(self, resume_id: str, chunks: List[str], 
                                 embeddings: List[List[float]], filename: str, user_id: str = None) -> None:
        """
        Store resume chunks and embeddings in documents table
        Specialized version for resumes using our ResumeChunk model
        
        Args:
            resume_id: Unique resume ID
            chunks: Text chunks
            embeddings: Embedding vectors
            filename: Original filename
            user_id: Optional user ID
        """
        # Prepare chunk data for documents table (legacy format)
        chunk_data = []
        resume_chunks = []
        
        for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
            # Legacy format for documents table
            chunk_data.append({
                "content": chunk,
                "metadata": {
                    "resume_id": resume_id,
                    "document_type": "resume",
                    "filename": filename,
                    "chunk_index": i,
                    "user_id": user_id,
                    "processed_at": datetime.now().isoformat(),
                    "mime_type": "application/pdf"
                },
                "embedding": embedding
            })
            
            # Create ResumeChunk model instance
            resume_chunk = ResumeChunk(
                id=str(uuid4()),
                resume_id=resume_id,
                chunk_index=i,
                content=chunk,
                embedding=embedding,
                page_number=0,  # Default to 0 if not known
                chunk_type="content",
                metadata={
                    "filename": filename,
                    "user_id": user_id,
                    "processed_at": datetime.now().isoformat()
                },
                created_at=datetime.now().isoformat(),
                updated_at=datetime.now().isoformat(),
                section_type="general",
                importance_score=0.5
            )
            resume_chunks.append(resume_chunk.model_dump())
        
        # Insert chunks in batches to documents table (legacy)
        batch_size = 10
        for i in range(0, len(chunk_data), batch_size):
            batch = chunk_data[i:i + batch_size]
            self.supabase.table("documents").insert(batch).execute()
        
        # Also store in resume_chunks table using our model
        try:
            for i in range(0, len(resume_chunks), batch_size):
                batch = resume_chunks[i:i + batch_size]
                self.supabase.table("resume_chunks").insert(batch).execute()
        except Exception as e:
            print(f"Note: Could not store in resume_chunks table (may not exist yet): {e}")
        
        print(f"Stored {len(chunks)} resume chunks for: {filename}")
    
    def check_resume_exists(self, user_id: str = None) -> Dict[str, Any]:
        """
        Check if a resume exists for a user (or any resume if no user_id)
        
        Args:
            user_id: Optional user ID to check for
            
        Returns:
            Resume information if found
        """
        try:
            query = self.supabase.table("document_metadata").select("*")
            
            if user_id:
                # Check for specific user's resume
                query = query.contains("schema", {"user_id": user_id})
            
            # Filter for resume documents
            query = query.contains("schema", {"type": "resume"})
            
            response = query.execute()
            
            if response.data and len(response.data) > 0:
                latest_resume = max(response.data, key=lambda x: x.get('created_at', ''))
                schema_data = json.loads(latest_resume.get('schema', '{}'))
                
                return {
                    "has_resume": True,
                    "resume_id": latest_resume['id'],
                    "filename": schema_data.get('filename', 'Unknown'),
                    "processed_date": schema_data.get('processing_date'),
                    "text_length": schema_data.get('text_length', 0),
                    "user_id": schema_data.get('user_id')
                }
            else:
                return {
                    "has_resume": False,
                    "resume_id": None
                }
                
        except Exception as e:
            print(f"Error checking resume existence: {e}")
            return {
                "has_resume": False,
                "error": str(e)
            }
    
    async def search_resume_content(self, query: str, user_id: str = None, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search resume content using semantic similarity
        
        Args:
            query: Search query
            user_id: Optional user ID filter
            limit: Maximum number of results
            
        Returns:
            List of relevant resume chunks
        """
        # Create embedding for search query
        query_embedding = await self.create_embeddings([query])
        
        # Try to use the specialized resume_chunks table first with our models
        try:
            # Build search query for resume_chunks
            rpc_params = {
                'query_embedding': query_embedding[0],
                'match_threshold': 0.5,
                'match_count': limit,
                'user_id_param': user_id if user_id else None
            }
            
            # Try to use match_resume_content function if it exists
            response = self.supabase.rpc('match_resume_content', rpc_params).execute()
            
            if response.data and len(response.data) > 0:
                # Convert to ResumeChunk models
                resume_results = []
                for doc in response.data:
                    # Create a dict with the required fields
                    chunk_data = {
                        "content": doc.get('content', ''),
                        "metadata": doc.get('metadata', {}),
                        "similarity": doc.get('similarity', 0),
                        "resume_id": doc.get('resume_id', '')
                    }
                    resume_results.append(chunk_data)
                return resume_results
        except Exception as e:
            print(f"Could not use match_resume_content, falling back to match_documents: {e}")
        
        # Fallback to generic match_documents
        rpc_params = {
            'query_embedding': query_embedding[0],
            'match_threshold': 0.5,
            'match_count': limit
        }
        
        # Execute semantic search
        response = self.supabase.rpc('match_documents', rpc_params).execute()
        
        # Filter for resume documents
        resume_results = []
        for doc in response.data:
            metadata = doc.get('metadata', {})
            if metadata.get('document_type') == 'resume':
                # If user_id specified, only return their resume
                if user_id and metadata.get('user_id') != user_id:
                    continue
                resume_results.append(doc)
        
        return resume_results
    
    async def extract_skills_from_resume(self, resume_id: str) -> List[str]:
        """
        Extract skills mentioned in a resume using pattern matching
        In a production environment, this could be enhanced with LLM-based extraction
        
        Args:
            resume_id: Resume ID to analyze
            
        Returns:
            List of extracted skills
        """
        try:
            # Get resume text
            response = self.supabase.table("document_metadata").select("content").eq("id", resume_id).execute()
            
            if not response.data:
                return []
                
            resume_text = response.data[0].get("content", "")
            
            # Very basic skill extraction
            # In a production environment, use a more sophisticated approach with a skills taxonomy
            common_skills = [
                "Python", "JavaScript", "TypeScript", "React", "Angular", "Vue", "Node.js",
                "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "DevOps",
                "Machine Learning", "AI", "Data Science", "Deep Learning", "NLP",
                "SQL", "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
                "Project Management", "Agile", "Scrum", "Leadership", "Communication",
                "Java", "C++", "C#", "Rust", "Go", "Swift", "Kotlin", "PHP", "Ruby",
                "Excel", "PowerPoint", "Word", "Google Workspace", "Microsoft Office",
                "Marketing", "Sales", "Customer Service", "HR", "Finance", "Accounting"
            ]
            
            found_skills = []
            for skill in common_skills:
                if skill.lower() in resume_text.lower():
                    found_skills.append(skill)
            
            return found_skills
            
        except Exception as e:
            print(f"Error extracting skills: {e}")
            return []
    
    async def match_resume_to_jobs(self, resume_id: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Match a resume to relevant job listings using semantic search
        
        Args:
            resume_id: Resume ID to match
            limit: Maximum number of job matches
            
        Returns:
            List of matching job listings
        """
        try:
            # Get resume embedding (use first chunk)
            response = self.supabase.table("documents").select("embedding") \
                .eq("metadata->>resume_id", resume_id) \
                .eq("metadata->>chunk_index", 0) \
                .limit(1) \
                .execute()
                
            if not response.data:
                return []
                
            resume_embedding = response.data[0].get("embedding")
            
            # Search for matching jobs
            # This assumes job_listings table has vector embeddings
            response = self.supabase.rpc('match_jobs', {
                'query_embedding': resume_embedding,
                'match_threshold': 0.5,
                'match_count': limit
            }).execute()
            
            return response.data
            
        except Exception as e:
            print(f"Error matching resume to jobs: {e}")
            return []

# Convenience functions for direct use
async def process_resume_file(pdf_content: bytes, filename: str, user_id: str = None) -> Dict[str, Any]:
    """
    Convenience function to process a resume file
    
    Args:
        pdf_content: Raw PDF bytes
        filename: Original filename
        user_id: Optional user ID
        
    Returns:
        Processing result
    """
    processor = ResumeProcessor()
    return await processor.process_resume(pdf_content, filename, user_id)

def check_user_resume(user_id: str = None) -> Dict[str, Any]:
    """
    Convenience function to check if user has a resume
    
    Args:
        user_id: Optional user ID
        
    Returns:
        Resume existence information
    """
    processor = ResumeProcessor()
    return processor.check_resume_exists(user_id) 
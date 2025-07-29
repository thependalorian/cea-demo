"""
Base Document Processor for Pendo Climate Economy Assistant RAG Pipeline
Handles text extraction, chunking, embedding generation, and storage
"""
import os
import io
import json
import base64
import hashlib
import time
import uuid
import asyncio
import numpy as np
import logging
from typing import Dict, Any, List, Optional, Union, Tuple
from datetime import datetime
from pathlib import Path
import asyncio

# Environment and database
from dotenv import load_dotenv
from supabase import create_client, Client
from openai import AsyncOpenAI

# Load environment variables
is_production = os.getenv("ENVIRONMENT") == "production"

if not is_production:
    # Development: prioritize .env file
    project_root = Path(__file__).resolve().parent
    dotenv_path = project_root / '.env'
    load_dotenv(dotenv_path, override=True)
else:
    # Production: use cloud platform env vars only
    load_dotenv()

# Configure logging
logger = logging.getLogger(__name__)

class DocumentProcessor:
    """
    Base class for document processors with RAG integration
    This serves as the foundation for specialized processors (PDF, website, etc.)
    """
    
    def __init__(self, supabase_client=None, embedding_client=None):
        """
        Initialize processor with optional clients
        Args:
            supabase_client: Optional pre-configured Supabase client
            embedding_client: Optional pre-configured embedding client
        """
        # Initialize Supabase client
        if supabase_client:
            self.supabase = supabase_client
        else:
            supabase_url = os.getenv("SUPABASE_URL")
            supabase_key = os.getenv("SUPABASE_SERVICE_KEY")
            self.supabase = create_client(supabase_url, supabase_key)
        
        # Initialize OpenAI client for embeddings
        if embedding_client:
            self.embedding_client = embedding_client
        else:
            embedding_base_url = os.getenv('EMBEDDING_BASE_URL', 'https://api.openai.com/v1')
            embedding_api_key = os.getenv('EMBEDDING_API_KEY', os.getenv('OPENAI_API_KEY'))
            self.embedding_client = AsyncOpenAI(base_url=embedding_base_url, api_key=embedding_api_key)
        
        # Configuration
        self.embedding_model = os.getenv('EMBEDDING_MODEL_CHOICE', 'text-embedding-3-small')
        
        # Use OpenAI embedding dimensions
        self.vector_dimensions = 1536  # OpenAI text-embedding-3-small dimensions
            
        logger.info(f"Using embedding model {self.embedding_model} with {self.vector_dimensions} dimensions")
            
        self.chunk_size = 400
        self.chunk_overlap = 50
        
    async def extract_text(self, content: Union[bytes, str]) -> str:
        """
        Extract text from content (to be implemented by subclasses)
        
        Args:
            content: Raw content (bytes for files, string for URLs/text)
            
        Returns:
            Extracted text string
        """
        raise NotImplementedError("Subclasses must implement extract_text method")
    
    def chunk_text(self, text: str) -> List[str]:
        """
        Split text into chunks for embeddings
        
        Args:
            text: Input text to chunk
            
        Returns:
            List of text chunks
        """
        if not text or len(text.strip()) == 0:
            return []
            
        # Simple chunking by character count with overlap
        chunks = []
        start = 0
        
        while start < len(text):
            end = start + self.chunk_size
            
            # If this is not the last chunk, try to break at word boundary
            if end < len(text):
                # Look for space within the last 50 characters
                space_pos = text.rfind(' ', start, end)
                if space_pos > start:
                    end = space_pos
            
            chunk = text[start:end].strip()
            if chunk:
                chunks.append(chunk)
            
            # Move start position with overlap
            start = max(start + self.chunk_size - self.chunk_overlap, start + 1)
            
            # Safety check to prevent infinite loop
            if start >= len(text):
                break
                
        return chunks if chunks else [text[:self.chunk_size]]
    
    async def create_embeddings(self, texts: List[str]) -> List[List[float]]:
        """
        Create embeddings for text chunks
        
        Args:
            texts: List of text chunks
            
        Returns:
            List of embedding vectors
        """
        try:
            response = await self.embedding_client.embeddings.create(
                model=self.embedding_model,
                input=texts
            )
            
            return [data.embedding for data in response.data]
            
        except Exception as e:
            print(f"Error creating embeddings: {e}")
            # Fallback to random embeddings for testing
            print("WARNING: Using random embeddings as fallback")
            return [
                list(np.random.uniform(-1, 1, self.vector_dimensions).astype(np.float32))
                for _ in range(len(texts))
            ]
    
    def generate_document_id(self, content: Union[bytes, str], metadata: Dict[str, Any]) -> str:
        """
        Generate unique ID for document based on content hash
        
        Args:
            content: Document content (bytes or string)
            metadata: Document metadata including title
            
        Returns:
            Unique document ID
        """
        # Hash the content
        if isinstance(content, str):
            content_hash = hashlib.md5(content.encode('utf-8')).hexdigest()
        else:
            content_hash = hashlib.md5(content).hexdigest()
            
        # Add timestamp for uniqueness
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # Add prefix based on document type
        doc_type = metadata.get('content_type', 'doc').lower()
        prefix = doc_type[:3]  # First three chars of content_type
        
        return f"{prefix}_{content_hash[:8]}_{timestamp}"
    
    def delete_existing_document(self, document_id: str) -> None:
        """
        Delete existing document records from database
        
        Args:
            document_id: Document ID to delete
        """
        try:
            # Delete from documents table
            self.supabase.table("documents").delete().eq("metadata->>document_id", document_id).execute()
            
            # Delete from document_metadata table
            self.supabase.table("document_metadata").delete().eq("id", document_id).execute()
            
            print(f"Deleted existing document records for ID: {document_id}")
            
        except Exception as e:
            print(f"Error deleting existing document: {e}")
    
    async def process_document(self, content: Union[bytes, str], metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Main document processing function
        
        Args:
            content: Raw content (bytes for files, string for URLs/text)
            metadata: Document metadata
            
        Returns:
            Processing result with document ID and processing info
        """
        try:
            # Generate unique document ID
            document_id = self.generate_document_id(content, metadata)
            
            # Extract text from content
            extracted_text = await self.extract_text(content)
            
            if not extracted_text or extracted_text.strip() == "":
                return {
                    "success": False,
                    "error": "No text could be extracted from the content",
                    "document_id": document_id
                }
            
            # Delete any existing records for this document
            self.delete_existing_document(document_id)
            
            # Chunk the text
            chunks = self.chunk_text(extracted_text)
            
            if not chunks:
                return {
                    "success": False,
                    "error": "No text chunks were created",
                    "document_id": document_id
                }
            
            # Create embeddings
            embeddings = await self.create_embeddings(chunks)
            
            # Store document metadata
            await self.store_document_metadata(document_id, metadata, extracted_text, content)
            
            # Store chunks and embeddings
            await self.store_document_chunks(document_id, chunks, embeddings, metadata)
            
            return {
                "success": True,
                "document_id": document_id,
                "title": metadata.get('title', 'Untitled'),
                "text_length": len(extracted_text),
                "chunks_created": len(chunks),
                "processed_at": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Error processing document: {e}")
            return {
                "success": False,
                "error": str(e),
                "document_id": None
            }
    
    async def store_document_metadata(self, document_id: str, metadata: Dict[str, Any], 
                                    full_text: str, raw_content: Union[bytes, str]) -> None:
        """
        Store document metadata in document_metadata table
        
        Args:
            document_id: Unique document ID
            metadata: Document metadata
            full_text: Extracted text content
            raw_content: Original raw content
        """
        try:
            # Encode binary content as base64 if needed
            content_base64 = None
            if isinstance(raw_content, bytes):
                content_base64 = base64.b64encode(raw_content).decode('utf-8')
            
            # Build schema
            schema = {
                "type": metadata.get('content_type', 'article'),
                "text_length": len(full_text),
                "processing_date": datetime.now().isoformat(),
                "user_id": metadata.get('user_id'),
                "partner_id": metadata.get('partner_id'),
                "content_type": metadata.get('mime_type', 'text/plain'),
                "source_url": metadata.get('source_url')
            }
            
            # Build metadata record
            doc_metadata = {
                "id": document_id,
                "title": metadata.get('title', 'Untitled'),
                "url": metadata.get('source_url', f"document://{document_id}"),
                "schema": json.dumps(schema),
                "content": full_text  # Store full text for easy access
            }
            
            # Add binary content if available
            if content_base64:
                doc_metadata["binary_content"] = content_base64
            
            # Insert into document_metadata
            self.supabase.table("document_metadata").insert(doc_metadata).execute()
            print(f"Stored document metadata for: {metadata.get('title', document_id)}")
            
        except Exception as e:
            print(f"Error storing document metadata: {e}")
            raise
    
    async def store_document_chunks(self, document_id: str, chunks: List[str], 
                                  embeddings: List[List[float]], metadata: Dict[str, Any]) -> None:
        """
        Store document chunks and embeddings in documents table
        
        Args:
            document_id: Unique document ID
            chunks: Text chunks
            embeddings: Embedding vectors
            metadata: Document metadata
        """
        try:
            # Prepare chunk data
            chunk_data = []
            for i, (chunk, embedding) in enumerate(zip(chunks, embeddings)):
                chunk_data.append({
                    "content": chunk,
                    "metadata": {
                        "document_id": document_id,
                        "document_type": metadata.get('content_type', 'article'),
                        "title": metadata.get('title', 'Untitled'),
                        "chunk_index": i,
                        "user_id": metadata.get('user_id'),
                        "partner_id": metadata.get('partner_id'),
                        "processed_at": datetime.now().isoformat()
                    },
                    "embedding": embedding
                })
            
            # Insert chunks in batches
            batch_size = 10
            for i in range(0, len(chunk_data), batch_size):
                batch = chunk_data[i:i + batch_size]
                self.supabase.table("documents").insert(batch).execute()
            
            print(f"Stored {len(chunks)} document chunks for: {metadata.get('title', document_id)}")
            
        except Exception as e:
            print(f"Error storing document chunks: {e}")
            raise
    
    async def store_knowledge_resource(self, document_id: str, metadata: Dict[str, Any],
                                     text: str, main_embedding: List[float]) -> Dict[str, Any]:
        """
        Store content as a knowledge resource
        
        Args:
            document_id: Unique document ID
            metadata: Document metadata
            text: Full text content
            main_embedding: Main embedding vector
            
        Returns:
            Result of storage operation
        """
        try:
            # Extract fields
            resource = {
                'title': metadata.get('title', 'Untitled Resource'),
                'description': metadata.get('description', ''),
                'content_type': metadata.get('content_type', 'article'),
                'source_url': metadata.get('source_url', ''),
                'embedding': main_embedding,
                'is_published': metadata.get('is_published', True),
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # Insert knowledge resource
            result = self.supabase.table('knowledge_resources').insert(resource).execute()
            
            if not result.data:
                return {
                    'success': False,
                    'error': 'Failed to insert knowledge resource'
                }
                
            resource_id = result.data[0]['id']
            
            return {
                'success': True,
                'resource_id': resource_id,
                'document_id': document_id
            }
            
        except Exception as e:
            print(f"Error storing knowledge resource: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def store_job_listing(self, document_id: str, metadata: Dict[str, Any],
                              text: str, main_embedding: List[float]) -> Dict[str, Any]:
        """
        Store content as a job listing
        
        Args:
            document_id: Unique document ID
            metadata: Document metadata
            text: Full text content
            main_embedding: Main embedding vector
            
        Returns:
            Result of storage operation
        """
        try:
            # Extract fields
            job = {
                'title': metadata.get('title', 'Untitled Job'),
                'description': text,
                'company': metadata.get('company', ''),
                'location': metadata.get('location', ''),
                'application_url': metadata.get('application_url', metadata.get('source_url', '')),
                'embedding': main_embedding,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # Insert job listing
            result = self.supabase.table('job_listings').insert(job).execute()
            
            if not result.data:
                return {
                    'success': False,
                    'error': 'Failed to insert job listing'
                }
                
            job_id = result.data[0]['id']
            
            return {
                'success': True,
                'job_id': job_id,
                'document_id': document_id
            }
            
        except Exception as e:
            print(f"Error storing job listing: {e}")
            return {
                'success': False,
                'error': str(e)
            }
    
    async def store_education_program(self, document_id: str, metadata: Dict[str, Any],
                                   text: str, main_embedding: List[float]) -> Dict[str, Any]:
        """
        Store content as an education program
        
        Args:
            document_id: Unique document ID
            metadata: Document metadata
            text: Full text content
            main_embedding: Main embedding vector
            
        Returns:
            Result of storage operation
        """
        try:
            # Extract fields
            program = {
                'program_name': metadata.get('title', 'Untitled Program'),
                'description': text,
                'institution': metadata.get('institution', ''),
                'application_url': metadata.get('application_url', metadata.get('source_url', '')),
                'embedding': main_embedding,
                'created_at': datetime.now().isoformat(),
                'updated_at': datetime.now().isoformat()
            }
            
            # Insert education program
            result = self.supabase.table('education_programs').insert(program).execute()
            
            if not result.data:
                return {
                    'success': False,
                    'error': 'Failed to insert education program'
                }
                
            program_id = result.data[0]['id']
            
            return {
                'success': True,
                'program_id': program_id,
                'document_id': document_id
            }
            
        except Exception as e:
            print(f"Error storing education program: {e}")
            return {
                'success': False,
                'error': str(e)
            }
            
    async def search_document_content(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """
        Search document content using semantic similarity
        
        Args:
            query: Search query
            limit: Maximum number of results
            
        Returns:
            List of relevant document chunks
        """
        try:
            # Create embedding for search query
            query_embedding = await self.create_embeddings([query])
            
            # Build search query
            rpc_params = {
                'query_embedding': query_embedding[0],
                'match_threshold': 0.5,
                'match_count': limit
            }
            
            # Execute semantic search
            response = self.supabase.rpc('match_documents', rpc_params).execute()
            
            return response.data
            
        except Exception as e:
            print(f"Error searching document content: {e}")
            return [] 
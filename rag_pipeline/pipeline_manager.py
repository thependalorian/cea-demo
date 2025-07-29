"""
RAG Pipeline Manager for Pendo Climate Economy Assistant
Manages document processing pipeline from ingestion to storage
"""
import os
import uuid
import asyncio
import json
from typing import Dict, Any, List, Optional, Union
from datetime import datetime

# Import processors
from document_processor import DocumentProcessor
from pdf_processor import PDFProcessor
from website_processor import WebsiteProcessor
from resume_processor import ResumeProcessor

class RAGPipelineManager:
    """
    Manager for RAG pipeline processing with multiple document types
    """
    
    def __init__(self, supabase_client=None, embedding_client=None):
        """
        Initialize pipeline manager
        
        Args:
            supabase_client: Optional pre-configured Supabase client
            embedding_client: Optional pre-configured embedding client
        """
        # Initialize processors with shared clients for efficiency
        self.pdf_processor = PDFProcessor(supabase_client, embedding_client)
        self.website_processor = WebsiteProcessor(supabase_client, embedding_client)
        self.resume_processor = ResumeProcessor(supabase_client, embedding_client)
        
        # Job tracking
        self.active_jobs = {}
        self.processing_queue = asyncio.Queue()
        self.worker_count = 2
        
    async def start_workers(self):
        """Start background workers for processing queue"""
        workers = [asyncio.create_task(self._worker()) for _ in range(self.worker_count)]
        return workers
        
    async def _worker(self):
        """Background worker for processing queue items"""
        while True:
            try:
                job_id, task_type, content, metadata, target_table = await self.processing_queue.get()
                
                # Update job status
                self.active_jobs[job_id]['status'] = 'processing'
                self.active_jobs[job_id]['started_at'] = datetime.now().isoformat()
                
                # Process the item
                result = await self.process_item(task_type, content, metadata, target_table)
                
                # Update job status
                self.active_jobs[job_id]['status'] = 'completed' if result['success'] else 'failed'
                self.active_jobs[job_id]['completed_at'] = datetime.now().isoformat()
                self.active_jobs[job_id]['result'] = result
                
            except Exception as e:
                print(f"Worker error: {e}")
            finally:
                self.processing_queue.task_done()
    
    async def queue_item(self, task_type: str, content: Union[bytes, str], 
                        metadata: Dict[str, Any], target_table: str) -> str:
        """
        Queue an item for processing
        
        Args:
            task_type: Type of content ('pdf', 'website', 'resume', etc.)
            content: Raw content or URL
            metadata: Additional metadata
            target_table: Target table for storage
            
        Returns:
            Job ID for tracking
        """
        job_id = str(uuid.uuid4())
        
        # Create job tracking entry
        self.active_jobs[job_id] = {
            'id': job_id,
            'status': 'queued',
            'task_type': task_type,
            'target_table': target_table,
            'queued_at': datetime.now().isoformat(),
            'metadata': {
                'title': metadata.get('title', 'Untitled'),
                'content_type': metadata.get('content_type', task_type)
            }
        }
        
        # Add to processing queue
        await self.processing_queue.put((job_id, task_type, content, metadata, target_table))
        
        return job_id
    
    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        """
        Get status of a processing job
        
        Args:
            job_id: Job identifier
            
        Returns:
            Job status information
        """
        return self.active_jobs.get(job_id, {'id': job_id, 'status': 'not_found'})
    
    async def process_item(self, task_type: str, content: Union[bytes, str], 
                          metadata: Dict[str, Any], target_table: str) -> Dict[str, Any]:
        """
        Process a single item through the appropriate pipeline
        
        Args:
            task_type: Type of content ('pdf', 'website', 'resume', etc.)
            content: Raw content or URL
            metadata: Additional metadata
            target_table: Target table for storage
            
        Returns:
            Processing result
        """
        try:
            # Set default metadata if not provided
            if metadata is None:
                metadata = {}
            
            # Initialize result
            result = {
                'task_type': task_type,
                'target_table': target_table,
                'processed_at': datetime.now().isoformat()
            }
            
            # Process by task type
            if task_type.lower() == 'pdf':
                doc_result = await self._process_pdf(content, metadata, target_table)
            elif task_type.lower() in ('website', 'url'):
                doc_result = await self._process_website(content, metadata, target_table)
            elif task_type.lower() == 'resume':
                doc_result = await self._process_resume(content, metadata, target_table)
            else:
                return {
                    'success': False,
                    'error': f"Unsupported task type: {task_type}"
                }
                
            # Combine with base result
            result.update(doc_result)
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    async def _process_pdf(self, content: bytes, 
                         metadata: Dict[str, Any], target_table: str) -> Dict[str, Any]:
        """Process PDF content to the appropriate target table"""
        try:
            if target_table == 'knowledge_resources':
                return await self.pdf_processor.store_as_knowledge_resource(content, metadata)
            elif target_table == 'job_listings':
                # Process PDF then extract job details
                result = await self.pdf_processor.process_pdf(content, metadata)
                if not result['success']:
                    return result
                
                document_id = result['document_id']
                
                # Get full text content
                response = self.pdf_processor.supabase.table('document_metadata').select('content') \
                    .eq('id', document_id) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document content'
                    }
                    
                full_text = response.data[0]['content']
                
                # Get first chunk's embedding
                response = self.pdf_processor.supabase.table('documents').select('embedding') \
                    .eq('metadata->>document_id', document_id) \
                    .eq('metadata->>chunk_index', 0) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document embedding'
                    }
                    
                main_embedding = response.data[0]['embedding']
                
                # Extract job data and store in job_listings
                job_data = {
                    'title': metadata.get('job_title', metadata.get('title', 'Untitled Job')),
                    'description': full_text,
                    'company': metadata.get('company', ''),
                    'location': metadata.get('location', ''),
                    'application_url': metadata.get('application_url', metadata.get('source_url', '')),
                    'embedding': main_embedding,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                
                # Insert into job_listings
                job_result = self.pdf_processor.supabase.table('job_listings').insert(job_data).execute()
                
                if not job_result.data:
                    return {
                        'success': False,
                        'error': 'Failed to insert job listing'
                    }
                    
                job_id = job_result.data[0]['id']
                
                return {
                    **result,
                    'job_id': job_id
                }
                
            elif target_table == 'education_programs':
                # Process PDF then extract program details
                result = await self.pdf_processor.process_pdf(content, metadata)
                if not result['success']:
                    return result
                
                document_id = result['document_id']
                
                # Get full text content
                response = self.pdf_processor.supabase.table('document_metadata').select('content') \
                    .eq('id', document_id) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document content'
                    }
                    
                full_text = response.data[0]['content']
                
                # Get first chunk's embedding
                response = self.pdf_processor.supabase.table('documents').select('embedding') \
                    .eq('metadata->>document_id', document_id) \
                    .eq('metadata->>chunk_index', 0) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document embedding'
                    }
                    
                main_embedding = response.data[0]['embedding']
                
                # Extract program data and store in education_programs
                program_data = {
                    'program_name': metadata.get('program_name', metadata.get('title', 'Untitled Program')),
                    'description': full_text,
                    'institution': metadata.get('institution', ''),
                    'application_url': metadata.get('application_url', metadata.get('source_url', '')),
                    'embedding': main_embedding,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                
                # Insert into education_programs
                program_result = self.pdf_processor.supabase.table('education_programs').insert(program_data).execute()
                
                if not program_result.data:
                    return {
                        'success': False,
                        'error': 'Failed to insert education program'
                    }
                    
                program_id = program_result.data[0]['id']
                
                return {
                    **result,
                    'program_id': program_id
                }
            else:
                # Generic document processing
                return await self.pdf_processor.process_pdf(content, metadata)
                
        except Exception as e:
            return {
                'success': False,
                'error': f"PDF processing error: {str(e)}"
            }
    
    async def _process_website(self, url: str, 
                             metadata: Dict[str, Any], target_table: str) -> Dict[str, Any]:
        """Process website content to the appropriate target table"""
        try:
            if target_table == 'knowledge_resources':
                return await self.website_processor.store_as_knowledge_resource(url, metadata)
            elif target_table == 'job_listings':
                # Process website then extract job details
                result = await self.website_processor.process_website(url, metadata)
                if not result['success']:
                    return result
                
                document_id = result['document_id']
                
                # Get full text content
                response = self.website_processor.supabase.table('document_metadata').select('content') \
                    .eq('id', document_id) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document content'
                    }
                    
                full_text = response.data[0]['content']
                
                # Get first chunk's embedding
                response = self.website_processor.supabase.table('documents').select('embedding') \
                    .eq('metadata->>document_id', document_id) \
                    .eq('metadata->>chunk_index', 0) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document embedding'
                    }
                    
                main_embedding = response.data[0]['embedding']
                
                # Extract job data and store in job_listings
                job_data = {
                    'title': metadata.get('job_title', metadata.get('title', 'Untitled Job')),
                    'description': full_text,
                    'company': metadata.get('company', result.get('domain', '')),
                    'location': metadata.get('location', ''),
                    'application_url': metadata.get('application_url', url),
                    'embedding': main_embedding,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                
                # Insert into job_listings
                job_result = self.website_processor.supabase.table('job_listings').insert(job_data).execute()
                
                if not job_result.data:
                    return {
                        'success': False,
                        'error': 'Failed to insert job listing'
                    }
                    
                job_id = job_result.data[0]['id']
                
                return {
                    **result,
                    'job_id': job_id
                }
                
            elif target_table == 'education_programs':
                # Process website then extract program details
                result = await self.website_processor.process_website(url, metadata)
                if not result['success']:
                    return result
                
                document_id = result['document_id']
                
                # Get full text content
                response = self.website_processor.supabase.table('document_metadata').select('content') \
                    .eq('id', document_id) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document content'
                    }
                    
                full_text = response.data[0]['content']
                
                # Get first chunk's embedding
                response = self.website_processor.supabase.table('documents').select('embedding') \
                    .eq('metadata->>document_id', document_id) \
                    .eq('metadata->>chunk_index', 0) \
                    .limit(1) \
                    .execute()
                    
                if not response.data:
                    return {
                        'success': False,
                        'error': 'Failed to find document embedding'
                    }
                    
                main_embedding = response.data[0]['embedding']
                
                # Extract program data and store in education_programs
                program_data = {
                    'program_name': metadata.get('program_name', metadata.get('title', 'Untitled Program')),
                    'description': full_text,
                    'institution': metadata.get('institution', result.get('domain', '')),
                    'application_url': metadata.get('application_url', url),
                    'embedding': main_embedding,
                    'created_at': datetime.now().isoformat(),
                    'updated_at': datetime.now().isoformat()
                }
                
                # Insert into education_programs
                program_result = self.website_processor.supabase.table('education_programs').insert(program_data).execute()
                
                if not program_result.data:
                    return {
                        'success': False,
                        'error': 'Failed to insert education program'
                    }
                    
                program_id = program_result.data[0]['id']
                
                return {
                    **result,
                    'program_id': program_id
                }
                
            else:
                # Generic document processing
                return await self.website_processor.process_website(url, metadata)
                
        except Exception as e:
            return {
                'success': False,
                'error': f"Website processing error: {str(e)}"
            }
    
    async def _process_resume(self, content: bytes, 
                           metadata: Dict[str, Any], target_table: str = None) -> Dict[str, Any]:
        """
        Process resume content
        
        Args:
            content: Resume PDF content as bytes
            metadata: Resume metadata
            target_table: Optional target table (ignored for resumes)
            
        Returns:
            Processing result
        """
        try:
            # Extract filename and user_id
            filename = metadata.get('filename', 'resume.pdf')
            user_id = metadata.get('user_id')
            
            # Process the resume using specialized processor
            return await self.resume_processor.process_resume(content, filename, user_id)
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Resume processing error: {str(e)}"
            }
            
    async def batch_process(self, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Process multiple items in batch
        
        Args:
            items: List of items to process with keys:
                - task_type: Type of content ('pdf', 'website', etc.)
                - content: Raw content or URL
                - metadata: Additional metadata
                - target_table: Target table for storage
            
        Returns:
            List of processing results for each item
        """
        tasks = []
        for item in items:
            task = self.process_item(
                item.get('task_type', 'unknown'),
                item.get('content', ''),
                item.get('metadata', {}),
                item.get('target_table', 'documents')
            )
            tasks.append(task)
            
        return await asyncio.gather(*tasks)
        
# Simple example usage
async def example_usage():
    # Initialize pipeline manager
    pipeline = RAGPipelineManager()
    
    # Start workers
    workers = await pipeline.start_workers()
    
    # Example PDF processing (using file content)
    with open('example.pdf', 'rb') as f:
        pdf_content = f.read()
        
    pdf_job_id = await pipeline.queue_item(
        task_type='pdf',
        content=pdf_content,
        metadata={
            'title': 'Example PDF',
            'content_type': 'guide'
        },
        target_table='knowledge_resources'
    )
    
    # Example website processing
    website_job_id = await pipeline.queue_item(
        task_type='website',
        content='https://www.example.com/climate-article',
        metadata={
            'title': 'Climate Change Article',
            'content_type': 'article'
        },
        target_table='knowledge_resources'
    )
    
    # Example resume processing
    with open('example_resume.pdf', 'rb') as f:
        resume_content = f.read()
        
    resume_job_id = await pipeline.queue_item(
        task_type='resume',
        content=resume_content,
        metadata={
            'filename': 'example_resume.pdf',
            'user_id': 'user123'
        },
        target_table=None  # Target table is ignored for resumes
    )
    
    # Wait for processing to complete
    await asyncio.sleep(5)
    
    # Check job status
    pdf_status = pipeline.get_job_status(pdf_job_id)
    website_status = pipeline.get_job_status(website_job_id)
    resume_status = pipeline.get_job_status(resume_job_id)
    
    print(f"PDF Job Status: {pdf_status['status']}")
    print(f"Website Job Status: {website_status['status']}")
    print(f"Resume Job Status: {resume_status['status']}")
    
    # Cancel workers
    for worker in workers:
        worker.cancel()
        
if __name__ == "__main__":
    asyncio.run(example_usage()) 
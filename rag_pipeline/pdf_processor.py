"""
PDF Document Processor for Pendo Climate Economy Assistant RAG Pipeline
Specializes in processing PDF documents with multiple extraction methods
"""
import io
from typing import Dict, Any, List, Union, Optional
import os

# PDF processing libraries
import PyPDF2
import pypdf

# Import base processor
from document_processor import DocumentProcessor

class PDFProcessor(DocumentProcessor):
    """
    PDF document processor with specialized text extraction methods
    """
    
    async def extract_text(self, content: Union[bytes, str]) -> str:
        """
        Extract text from PDF with fallback methods
        
        Args:
            content: PDF content as bytes or URL string
            
        Returns:
            Extracted text string
        """
        try:
            # If content is URL, fetch it first
            if isinstance(content, str) and content.startswith(('http://', 'https://')):
                import httpx
                async with httpx.AsyncClient() as client:
                    response = await client.get(content, follow_redirects=True)
                    response.raise_for_status()
                    content = response.content

            # Ensure content is bytes
            if not isinstance(content, bytes):
                raise ValueError("PDF content must be provided as bytes or URL")
                
            # Method 1: Try pypdf first (better text extraction)
            try:
                pdf_reader = pypdf.PdfReader(io.BytesIO(content))
                text_parts = []
                
                # Extract text from each page
                for i, page in enumerate(pdf_reader.pages):
                    page_text = page.extract_text()
                    if page_text and page_text.strip():
                        text_parts.append(f"Page {i+1}:\n{page_text}")
                
                text = '\n\n'.join(text_parts)
                if text.strip():
                    return text
            except Exception as e:
                print(f"pypdf extraction failed: {e}")
                
            # Method 2: Fallback to PyPDF2 (more reliable but sometimes worse text extraction)
            try:
                pdf_reader = PyPDF2.PdfReader(io.BytesIO(content))
                text_parts = []
                
                # Extract text from each page
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
            return "Unable to extract text from PDF. Text extraction failed."
            
        except Exception as e:
            print(f"Critical error in PDF extraction: {e}")
            return f"Critical error during PDF text extraction: {str(e)}"
    
    async def extract_metadata_from_pdf(self, content: bytes) -> Dict[str, Any]:
        """
        Extract metadata from PDF document
        
        Args:
            content: PDF content as bytes
            
        Returns:
            Dictionary of PDF metadata
        """
        metadata = {}
        
        try:
            # Try using pypdf first
            try:
                pdf = pypdf.PdfReader(io.BytesIO(content))
                doc_info = pdf.metadata
                if doc_info:
                    # Extract common metadata fields
                    if doc_info.title:
                        metadata['title'] = doc_info.title
                    if doc_info.author:
                        metadata['author'] = doc_info.author
                    if doc_info.subject:
                        metadata['subject'] = doc_info.subject
                    if doc_info.creator:
                        metadata['creator'] = doc_info.creator
                    
            except Exception as e:
                print(f"pypdf metadata extraction failed: {e}")
                
                # Fallback to PyPDF2
                try:
                    pdf = PyPDF2.PdfReader(io.BytesIO(content))
                    doc_info = pdf.metadata
                    if doc_info:
                        # Extract metadata fields
                        for key, value in doc_info.items():
                            # Clean up the key name (remove leading /)
                            clean_key = key.lower()
                            if clean_key.startswith('/'):
                                clean_key = clean_key[1:]
                            metadata[clean_key] = value
                except Exception as e:
                    print(f"PyPDF2 metadata extraction failed: {e}")
        
        except Exception as e:
            print(f"Error extracting PDF metadata: {e}")
        
        return metadata
    
    async def process_pdf(self, pdf_content: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Specialized method for processing PDF documents
        
        Args:
            pdf_content: Raw PDF bytes
            metadata: Additional metadata
            
        Returns:
            Processing result
        """
        try:
            # Extract PDF metadata if available
            pdf_metadata = await self.extract_metadata_from_pdf(pdf_content)
            
            # Merge with provided metadata (user-provided metadata takes precedence)
            merged_metadata = {**pdf_metadata, **metadata}
            
            # Set content type if not specified
            if 'content_type' not in merged_metadata:
                merged_metadata['content_type'] = 'pdf'
                
            if 'mime_type' not in merged_metadata:
                merged_metadata['mime_type'] = 'application/pdf'
                
            # Process using the base class method
            result = await self.process_document(pdf_content, merged_metadata)
            
            # Add PDF-specific info to the result
            if result['success']:
                result['pdf_metadata'] = pdf_metadata
                
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f"PDF processing error: {str(e)}"
            }
    
    async def store_as_knowledge_resource(self, pdf_content: bytes, metadata: Dict[str, Any]) -> Dict[str, Any]:
        """
        Process PDF and store as knowledge resource
        
        Args:
            pdf_content: Raw PDF bytes
            metadata: Resource metadata
            
        Returns:
            Processing result
        """
        try:
            # First process the document
            result = await self.process_pdf(pdf_content, metadata)
            
            if not result['success']:
                return result
                
            # Get main document embedding from first chunk
            document_id = result['document_id']
            
            # Query for the first chunk's embedding
            response = self.supabase.table('documents').select('embedding') \
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
            
            # Get full text content
            response = self.supabase.table('document_metadata').select('content') \
                .eq('id', document_id) \
                .limit(1) \
                .execute()
                
            if not response.data:
                return {
                    'success': False,
                    'error': 'Failed to find document content'
                }
                
            full_text = response.data[0]['content']
            
            # Store as knowledge resource
            resource_result = await self.store_knowledge_resource(
                document_id,
                metadata,
                full_text,
                main_embedding
            )
            
            # Combine results
            return {
                **result,
                **resource_result
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Error storing knowledge resource: {str(e)}"
            } 
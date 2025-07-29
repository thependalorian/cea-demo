"""
Website/URL Document Processor for Pendo Climate Economy Assistant RAG Pipeline
Specializes in processing web content from URLs with content cleaning
"""
import httpx
from typing import Dict, Any, List, Union, Optional
import re
import os
from urllib.parse import urlparse

# HTML processing
from bs4 import BeautifulSoup
import trafilatura

# Import base processor
from document_processor import DocumentProcessor

class WebsiteProcessor(DocumentProcessor):
    """
    Website/URL document processor with specialized HTML extraction methods
    """
    
    async def extract_text(self, content: str) -> str:
        """
        Extract clean text from website URL
        
        Args:
            content: URL string to process
            
        Returns:
            Extracted text string
        """
        try:
            # Ensure content is a URL string
            if not isinstance(content, str):
                raise ValueError("Website content must be provided as URL string")
                
            url = content
            
            # Fetch webpage content
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, follow_redirects=True)
                response.raise_for_status()
                html_content = response.text
                
            # First, try Trafilatura for clean content extraction (removes navigation, etc.)
            try:
                extracted_text = trafilatura.extract(html_content, include_links=True, 
                                                   include_images=False, include_tables=True)
                
                if extracted_text and len(extracted_text.strip()) > 100:  # Decent amount of content
                    return extracted_text
            except Exception as e:
                print(f"Trafilatura extraction failed: {e}")
            
            # Fall back to BeautifulSoup
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Remove script, style elements and hidden elements
            for element in soup(['script', 'style', 'header', 'footer', 'nav', '[hidden]', 
                               'noscript', 'iframe', 'head']):
                element.extract()
            
            # Find the main content - look for common content containers
            main_content = None
            for selector in ['main', 'article', '#content', '.content', '#main', '.main']:
                content_element = soup.select_one(selector)
                if content_element:
                    main_content = content_element
                    break
            
            # If no main content container found, use body
            if not main_content:
                main_content = soup.body
            
            # Extract text from the content element
            if main_content:
                # Get text with spacing around elements
                text = main_content.get_text(separator=' ', strip=True)
                
                # Clean up whitespace
                text = re.sub(r'\s+', ' ', text)
                
                # Split into paragraphs
                paragraphs = []
                for line in text.split('\n'):
                    line = line.strip()
                    if line:
                        paragraphs.append(line)
                
                # Rejoin with proper spacing
                clean_text = '\n\n'.join(paragraphs)
                
                # If we got something substantial, return it
                if clean_text and len(clean_text) > 100:
                    return clean_text
            
            # If main content extraction failed, fall back to full body text
            text = soup.body.get_text(separator=' ', strip=True)
            text = re.sub(r'\s+', ' ', text)
            
            if not text or len(text.strip()) < 10:
                return "Unable to extract meaningful text from website."
                
            return text
            
        except Exception as e:
            print(f"Error extracting website content: {e}")
            return f"Error extracting content from website: {str(e)}"
    
    async def extract_metadata_from_website(self, url: str) -> Dict[str, Any]:
        """
        Extract metadata from website
        
        Args:
            url: Website URL
            
        Returns:
            Dictionary of website metadata
        """
        metadata = {
            'source_url': url,
            'content_type': 'article',
            'mime_type': 'text/html'
        }
        
        try:
            # Parse domain for organization info
            parsed_url = urlparse(url)
            domain = parsed_url.netloc
            if domain.startswith('www.'):
                domain = domain[4:]
            metadata['domain'] = domain
            
            # Fetch webpage content
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(url, follow_redirects=True)
                response.raise_for_status()
                html_content = response.text
                
            # Parse HTML
            soup = BeautifulSoup(html_content, 'html.parser')
            
            # Get page title
            title_tag = soup.find('title')
            if title_tag and title_tag.string:
                metadata['title'] = title_tag.string.strip()
                
            # Get meta description
            desc_tag = soup.find('meta', attrs={'name': 'description'}) or \
                      soup.find('meta', attrs={'property': 'og:description'})
            if desc_tag and desc_tag.get('content'):
                metadata['description'] = desc_tag.get('content').strip()
                
            # Get meta keywords
            keywords_tag = soup.find('meta', attrs={'name': 'keywords'})
            if keywords_tag and keywords_tag.get('content'):
                keywords = [k.strip() for k in keywords_tag.get('content').split(',')]
                metadata['keywords'] = keywords
                
            # Get OpenGraph metadata
            og_title = soup.find('meta', attrs={'property': 'og:title'})
            if og_title and og_title.get('content'):
                metadata['og_title'] = og_title.get('content').strip()
                
            og_type = soup.find('meta', attrs={'property': 'og:type'})
            if og_type and og_type.get('content'):
                metadata['og_type'] = og_type.get('content').strip()
                
            og_site = soup.find('meta', attrs={'property': 'og:site_name'})
            if og_site and og_site.get('content'):
                metadata['site_name'] = og_site.get('content').strip()
                
        except Exception as e:
            print(f"Error extracting website metadata: {e}")
            
        # Use og_title or regular title if available
        if 'title' not in metadata and 'og_title' in metadata:
            metadata['title'] = metadata['og_title']
            
        # Default title as domain if nothing found
        if 'title' not in metadata:
            metadata['title'] = f"Content from {domain}"
            
        return metadata
    
    async def process_website(self, url: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process website content
        
        Args:
            url: Website URL
            metadata: Additional metadata
            
        Returns:
            Processing result
        """
        try:
            if metadata is None:
                metadata = {}
                
            # Extract website metadata
            website_metadata = await self.extract_metadata_from_website(url)
            
            # Merge with provided metadata (user-provided takes precedence)
            merged_metadata = {**website_metadata, **metadata}
            
            # Process using the base class method
            result = await self.process_document(url, merged_metadata)
            
            # Add website-specific info to the result
            if result['success']:
                result['website_metadata'] = website_metadata
                result['domain'] = website_metadata.get('domain')
                
            return result
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Website processing error: {str(e)}"
            }
    
    async def store_as_knowledge_resource(self, url: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        """
        Process website and store as knowledge resource
        
        Args:
            url: Website URL
            metadata: Additional metadata
            
        Returns:
            Processing result
        """
        try:
            # First process the website
            result = await self.process_website(url, metadata)
            
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
            
            # Use existing metadata or create new if None was provided
            final_metadata = metadata or {}
            
            # Ensure we have the basic metadata fields
            if 'title' not in final_metadata and 'title' in result:
                final_metadata['title'] = result['title']
                
            if 'source_url' not in final_metadata:
                final_metadata['source_url'] = url
                
            # Store as knowledge resource
            resource_result = await self.store_knowledge_resource(
                document_id,
                final_metadata,
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
                'error': f"Error storing knowledge resource from website: {str(e)}"
            } 
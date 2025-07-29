"""
Resume processing utility for extracting text, generating embeddings,
and performing semantic search.
"""

import base64
import json
import uuid
from typing import List, Dict, Any, Optional
from datetime import datetime
import traceback

from clients import get_agent_clients

class ResumeProcessor:
    def __init__(self):
        self.supabase = None
        # Don't call _init_supabase here since it's async
    
    async def _init_supabase(self):
        """Initialize Supabase client"""
        try:
            supabase, _, _ = await get_agent_clients()
            self.supabase = supabase
        except Exception as e:
            print(f"Error initializing Supabase client: {e}")
            self.supabase = None
    
    async def process_resume(self, content: bytes, file_name: str, user_id: str, content_type: str = "text/plain") -> Dict[str, Any]:
        """Process resume and store in Supabase"""
        try:
            if not self.supabase:
                raise Exception("Supabase client not initialized")
            
            # Decode content if it's base64
            if isinstance(content, str):
                content = base64.b64decode(content)
            
            # Convert content to text
            text_content = content.decode('utf-8', errors='ignore')
            
            # Create resume record
            resume_data = {
                "user_id": user_id,
                "file_name": file_name,
                "content": text_content,
                "content_type": content_type,
                "file_size": len(content),
                "processed": True,
                "processing_status": "completed",
                "processed_at": datetime.utcnow().isoformat(),
                "chunk_count": 0,
                "summary": f"Resume uploaded: {file_name}",
                "skills_extracted": [],
                "work_experience": [],
                "certifications": [],
                "job_titles": [],
                "contact_info": {},
                "industries": [],
                "job_categories": [],
                "preferred_locations": []
            }
            
            # Insert into resumes table
            result = self.supabase.table('resumes').insert(resume_data).execute()
            
            if not result.data:
                raise Exception("Failed to insert resume data")
            
            resume_id = result.data[0]['id']
            
            # Create chunks from content
            chunks = self._create_chunks(text_content)
            
            # Insert chunks
            chunk_data = []
            for i, chunk in enumerate(chunks):
                chunk_record = {
                    "resume_id": resume_id,
                    "chunk_index": i,
                    "content": chunk,
                    "page_number": 0,
                    "chunk_type": "content",
                    "section_type": "experience" if "experience" in chunk.lower() else "education" if "education" in chunk.lower() else "skills" if "skills" in chunk.lower() else "unknown",
                    "importance_score": 0.5,
                    "metadata": {}
                }
                chunk_data.append(chunk_record)
            
            if chunk_data:
                self.supabase.table('resume_chunks').insert(chunk_data).execute()
            
            # Update chunk count
            self.supabase.table('resumes').update({"chunk_count": len(chunks)}).eq("id", resume_id).execute()
            
            return {
                "resume_id": resume_id,
                "user_id": user_id,
                "file_name": file_name,
                "chunks_created": len(chunks),
                "status": "success"
            }
            
        except Exception as e:
            print(f"Error processing resume: {e}")
            traceback.print_exc()
            raise e
    
    def _create_chunks(self, content: str, chunk_size: int = 1000) -> List[str]:
        """Create chunks from resume content"""
        words = content.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            if current_size + len(word) + 1 > chunk_size and current_chunk:
                chunks.append(' '.join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word) + 1
        
        if current_chunk:
            chunks.append(' '.join(current_chunk))
        
        return chunks
    
    def check_resume_exists(self, user_id: str) -> bool:
        """Check if a user has a resume"""
        try:
            if not self.supabase:
                return False
            
            result = self.supabase.table('resumes').select('id').eq('user_id', user_id).execute()
            return len(result.data) > 0
        except Exception as e:
            print(f"Error checking resume existence: {e}")
            return False
    
    def search_resume_content(self, query: str, user_id: str = None, limit: int = 5) -> List[Dict[str, Any]]:
        """Search for content in user's resume chunks"""
        try:
            if not self.supabase:
                return []
            
            # First get the resume ID for the user
            resume_result = self.supabase.table('resumes').select('id').eq('user_id', user_id).execute()
            if not resume_result.data:
                return []
            
            resume_id = resume_result.data[0]['id']
            
            # Search in chunks
            result = self.supabase.table('resume_chunks').select('*').eq('resume_id', resume_id).execute()
            
            # Simple text search (could be enhanced with vector search later)
            matching_chunks = []
            query_lower = query.lower()
            
            for chunk in result.data:
                if query_lower in chunk['content'].lower():
                    matching_chunks.append({
                        'chunk_index': chunk['chunk_index'],
                        'content': chunk['content'],
                        'section_type': chunk.get('section_type', 'unknown'),
                        'importance_score': chunk.get('importance_score', 0.5)
                    })
            
            # Sort by importance score and limit results
            matching_chunks.sort(key=lambda x: x['importance_score'], reverse=True)
            return matching_chunks[:limit]
            
        except Exception as e:
            print(f"Error searching resume content: {e}")
            return []
    
    async def trigger_comprehensive_analysis(self, resume_id: str, user_id: str):
        """Trigger comprehensive analysis for target populations"""
        try:
            if not self.supabase:
                return
            
            # Define target populations
            target_populations = [
                "veterans",
                "environmental_justice", 
                "reentry",
                "internationals"
            ]
            
            analysis_types = [
                "skills_translation",
                "career_pathways", 
                "skills_gap_analysis",
                "credential_evaluation"
            ]
            
            # Create analysis records for each population
            for population in target_populations:
                for analysis_type in analysis_types:
                    analysis_data = {
                        "resume_id": resume_id,
                        "user_id": user_id,
                        "analysis_type": analysis_type,
                        "target_population": population,
                        "analysis_content": {
                            "status": "pending",
                            "message": f"Analysis for {population} - {analysis_type} will be processed by AI agent"
                        },
                        "processing_status": "pending",
                        "created_at": datetime.utcnow().isoformat()
                    }
                    
                    self.supabase.table('resume_analysis').insert(analysis_data).execute()
            
            return {"status": "analysis_triggered", "populations": target_populations}
            
        except Exception as e:
            print(f"Error triggering comprehensive analysis: {e}")
            traceback.print_exc()
            raise e

# Standalone function for enhanced resume processing
async def process_resume_file_enhanced(content: bytes, file_name: str, user_id: str, content_type: str = "text/plain") -> Dict[str, Any]:
    """Enhanced resume processing with comprehensive analysis"""
    try:
        processor = ResumeProcessor()
        await processor._init_supabase()
        
        # Process the resume
        result = await processor.process_resume(content, file_name, user_id, content_type)
        
        # Trigger comprehensive analysis
        if result.get("status") == "success":
            await processor.trigger_comprehensive_analysis(result["resume_id"], user_id)
        
        return result
        
    except Exception as e:
        print(f"Error in enhanced resume processing: {e}")
        traceback.print_exc()
        raise e 
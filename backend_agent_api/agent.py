"""
Enhanced implementation of the Pendo agent with vision capabilities for resume analysis.
"""

import os
import sys
import json
import uuid
import base64
# import fitz  # PyMuPDF for PDF to image conversion - temporarily disabled
from datetime import datetime
from typing import Dict, Any, List, Optional, Callable, AsyncGenerator, Union
import logging
import httpx

# Use our centralized import helper
from fix_imports import Message, Conversation, MessageRole, Request

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class PendoAgentDeps:
    """Dependencies for the Pendo agent."""
    
    def __init__(
        self,
        supabase=None,
        embedding_client=None,
        http_client=None,
        mem0_client=None,
        resume_processor=None,
        validation_enabled=False,
        custom_api_key=None,  # Add custom_api_key parameter
    ):
        """Initialize the agent dependencies."""
        self.supabase = supabase
        self.embedding_client = embedding_client
        self.http_client = http_client
        self.mem0_client = mem0_client
        self.resume_processor = resume_processor
        self.validation_enabled = validation_enabled
        self.custom_api_key = custom_api_key  # Store custom API key
        
        # Always use OpenAI embedding dimensions
        self.embedding_dimensions = 1536  # OpenAI text-embedding-3-small dimensions
            
        logger.info("Initialized PendoAgentDeps")
        
    def get_openai_api_key(self):
        """
        Get the OpenAI API key to use, prioritizing custom key if available.
        
        Returns:
            The API key to use for OpenAI calls
        """
        if self.custom_api_key:
            logger.info("Using custom OpenAI API key")
            return self.custom_api_key
        
        # Fall back to environment variable
        env_api_key = os.environ.get("OPENAI_API_KEY")
        if env_api_key:
            logger.info("Using environment OpenAI API key")
            return env_api_key
            
        logger.warning("No OpenAI API key available")
        return None

class RunContext:
    """Context for running the agent."""
    
    def __init__(self, deps: PendoAgentDeps, request: Dict[str, Any], files: List[Dict[str, Any]] = None):
        """Initialize the run context."""
        self.deps = deps
        self.request = request
        self.user_id = request.get("user_id", "anonymous")
        self.conversation_id = request.get("conversation_id")
        self.session_id = request.get("session_id")
        self.context = request.get("context", {})
        self.files = files or request.get("files", [])  # Support both direct files parameter and request files
        logger.info(f"Initialized RunContext for user {self.user_id} with {len(self.files)} files")


def convert_pdf_to_images(pdf_content: bytes) -> List[Dict[str, Any]]:
    """
    Convert PDF pages to images for vision model analysis.
    
    Args:
        pdf_content: Raw PDF bytes
        
    Returns:
        List of image data dictionaries with base64 content and metadata
    """
    try:
        # import fitz  # PyMuPDF - temporarily disabled
        # doc = fitz.open(stream=pdf_content, filetype="pdf")
        # images = []
        
        # for page_num in range(len(doc)):
        #     page = doc.load_page(page_num)
            
        #     # Render page to image with higher resolution for better OCR
        #     mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for better quality
        #     pix = page.get_pixmap(matrix=mat)
            
        #     # Convert to PNG bytes
        #     img_bytes = pix.tobytes("png")
            
        #     # Convert to base64
        #     img_base64 = base64.b64encode(img_bytes).decode('utf-8')
            
        #     images.append({
        #         "type": "image_url",
        #         "image_url": {
        #             "url": f"data:image/png;base64,{img_base64}"
        #         },
        #         "metadata": {
        #             "page": page_num + 1,
        #             "total_pages": len(doc),
        #             "filename": f"page_{page_num + 1}.png"
        #         }
        #     })
        
        # doc.close()
        # logger.info(f"Converted PDF to {len(images)} images")
        # return images
        
        logger.warning("PDF to image conversion temporarily disabled")
        return []
        
    except ImportError:
        logger.error("PyMuPDF not available for PDF to image conversion")
        return []
    except Exception as e:
        logger.error(f"Error converting PDF to images: {e}")
        return []


async def pendo_agent(
    ctx: RunContext,
    messages: List[Message],
    stream: bool = False
) -> Union[str, AsyncGenerator[str, None]]:
    """
    Main Pendo agent function with enhanced resume analysis capabilities.
    """
    try:
        # Check if we have file attachments for vision analysis
        has_files = ctx.files and len(ctx.files) > 0
        is_resume_analysis = any(
            "resume" in msg.content.lower() or "analyze" in msg.content.lower() 
            for msg in messages
        )
        
        # Process uploaded files first if any
        if has_files and ctx.deps.resume_processor:
            print(f"Processing {len(ctx.files)} uploaded files")
            for file_info in ctx.files:
                if file_info.get("type") == "resume" and file_info.get("result", {}).get("status") == "success":
                    print(f"Resume processed successfully: {file_info.get('filename')}")
                    # The resume has been processed and stored in the database
                    break
        
        # Use tools for resume-related queries
        if is_resume_analysis and ctx.deps.resume_processor:
            # Check if user has a resume
            has_resume = check_user_resume(ctx)
            print(f"User {ctx.user_id} has resume: {has_resume}")
            
            if has_resume:
                # Search for relevant content in the resume
                last_message = messages[-1].content if messages else ""
                search_results = search_resume_content(ctx, last_message)
                
                # Add resume context to the conversation
                if search_results:
                    resume_context = "\n\nResume Analysis Context:\n"
                    for i, result in enumerate(search_results[:3], 1):
                        resume_context += f"{i}. {result['content'][:200]}...\n"
                    
                    # Add resume context to the last user message
                    if messages:
                        messages[-1].content += resume_context
            else:
                # User doesn't have a resume, suggest uploading one
                return "I don't see a resume in your profile yet. Please upload your resume using the file attachment feature so I can provide personalized career guidance for Massachusetts clean energy opportunities."
        
        # Choose the appropriate LLM based on context
        if has_files or is_resume_analysis:
            # Use vision model for file analysis
            llm_choice = os.environ.get("VISION_LLM_CHOICE", "gpt-4o-mini")
            logger.info(f"Using vision model: {llm_choice} for file analysis")
        else:
            # Use standard model for text-only conversations
            llm_choice = os.environ.get("LLM_CHOICE", "gpt-4o-mini")
            logger.info(f"Using standard model: {llm_choice}")
        
        # Initialize OpenAI client with custom API key
        api_key = ctx.deps.get_openai_api_key()
        if not api_key:
            raise ValueError("No OpenAI API key available")
        
        from openai import OpenAI
        client = OpenAI(api_key=api_key)
        
        # Prepare messages for the API
        api_messages = []
        
        # Add system message with enhanced context for resume analysis
        if has_files or is_resume_analysis:
            system_prompt = """You are the Climate Economy Assistant (CEA), an AI expert specializing in Massachusetts clean energy careers and workforce development. 

You are analyzing resumes and providing comprehensive career guidance for target populations including:
- Veterans transitioning to civilian clean energy careers
- Environmental Justice (EJ) community members seeking sustainable employment
- Reentry individuals looking for second-chance opportunities
- International professionals with credentials to evaluate

When analyzing resumes, provide:

**FOR VETERANS:**
1. **Military Skills Translation**: Map military experience to clean energy roles (e.g., logistics → supply chain management, technical training → renewable energy technician)
2. **Veteran Benefits**: Highlight GI Bill benefits, veteran hiring preferences, and Massachusetts veteran programs
3. **Career Pathways**: Solar installation, wind energy, energy efficiency, grid modernization
4. **Local Resources**: Massachusetts veteran employment programs and clean energy partnerships

**FOR ENVIRONMENTAL JUSTICE COMMUNITIES:**
1. **Community Impact**: Focus on local environmental justice initiatives and community-based opportunities
2. **Sustainable Employment**: Green jobs that directly benefit EJ communities
3. **Skills Development**: Training programs accessible to EJ communities
4. **Local Partnerships**: Massachusetts EJ organizations and clean energy employers

**FOR REENTRY INDIVIDUALS:**
1. **Second-Chance Opportunities**: Employers with fair chance hiring policies
2. **Skills Development**: Training programs that welcome reentry individuals
3. **Support Services**: Massachusetts reentry programs and clean energy partnerships
4. **Career Pathways**: Entry-level positions with growth potential

**FOR INTERNATIONAL PROFESSIONALS:**
1. **Credential Evaluation**: Explain US equivalency for international degrees and certifications
2. **Visa Considerations**: Work authorization requirements for clean energy positions
3. **Skills Translation**: Map international experience to Massachusetts clean energy roles
4. **Local Resources**: Massachusetts international professional networks and support services

**GENERAL ANALYSIS FOR ALL POPULATIONS:**
- **Skills Gap Analysis**: Identify specific training needs for target roles
- **Salary Expectations**: Provide realistic compensation guidance for Massachusetts
- **Local Opportunities**: Focus on Massachusetts clean energy employers and programs
- **Training Recommendations**: Suggest specific programs, certifications, and educational pathways
- **Networking**: Connect to relevant professional organizations and support groups

Use the resume content and any attached files to provide personalized, actionable advice that addresses the specific needs of these target populations."""
        else:
            system_prompt = """You are the Climate Economy Assistant (CEA), an AI expert specializing in Massachusetts clean energy careers and workforce development. 

You help job seekers, veterans, environmental justice communities, reentry individuals, and international professionals find opportunities in Massachusetts' growing clean energy sector.

Provide practical, actionable guidance on:
- Clean energy career pathways in Massachusetts
- Skills development and training programs
- Job search strategies for target populations
- Industry trends and growth opportunities
- Local employer connections and networking

Focus on Massachusetts-specific opportunities and resources."""
        
        api_messages.append({"role": "system", "content": system_prompt})
        
        # Add conversation history
        for msg in messages:
            api_messages.append({
                "role": "user" if msg.role == MessageRole.USER else "assistant",
                "content": msg.content
            })
        
        # Handle file attachments for vision analysis
        if has_files:
            # Add file content to the last user message
            file_contents = []
            for file_info in ctx.files:
                if file_info.get("type") in ["resume", "image"]:
                    file_contents.append({
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:{file_info['mime_type']};base64,{file_info['content']}"
                        }
                    })
            
            if file_contents:
                # Add file analysis to the last user message
                last_user_message = api_messages[-1]
                if last_user_message["role"] == "user":
                    last_user_message["content"] += "\n\nPlease analyze the attached resume/document and provide comprehensive career guidance."
                    last_user_message["content"] = [
                        {"type": "text", "text": last_user_message["content"]}
                    ] + file_contents
                else:
                    # Add a new user message with files
                    api_messages.append({
                        "role": "user",
                        "content": [
                            {"type": "text", "text": "Please analyze the attached resume/document and provide comprehensive career guidance."}
                        ] + file_contents
                    })
        
        # Make the API call
        if stream:
            async def response_stream():
                try:
                    response = client.chat.completions.create(
                        model=llm_choice,
                        messages=api_messages,
                        stream=True,
                        max_tokens=4000,
                        temperature=0.7
                    )
                    
                    for chunk in response:
                        if chunk.choices[0].delta.content:
                            yield chunk.choices[0].delta.content
                            
                except Exception as e:
                    logger.error(f"Error in streaming response: {e}")
                    yield f"Error: {str(e)}"
            
            return response_stream()
        else:
            response = client.chat.completions.create(
                model=llm_choice,
                messages=api_messages,
                max_tokens=4000,
                temperature=0.7
            )
            
            return response.choices[0].message.content
            
    except Exception as e:
        logger.error(f"Error in pendo_agent: {e}")
        return f"Error processing your request: {str(e)}"
    
    # Fallback response if everything else fails
    response = f"I'm the Climate Economy Assistant for Massachusetts. You asked: {query}\n\nHow can I help with your clean energy career questions?"
    
    return response


# Tools that would normally be called by the agent
def search_resume_content(ctx: RunContext, query: str) -> Dict[str, Any]:
    """
    Search for content in a user's resume.
    
    Args:
        ctx: The run context
        query: The search query
        
    Returns:
        Search results
    """
    user_id = ctx.user_id
    logger.info(f"Searching resume content for user {user_id} with query: {query}")
    
    if ctx.deps.resume_processor:
        return ctx.deps.resume_processor.search_resume_content(query, user_id)
    
    # Mock response if resume processor not available
    return {
        "matches": [
            {
                "content": f"Mock resume match for query: {query}",
                "similarity": 0.95
            }
        ]
    }


def check_user_resume(ctx: RunContext) -> bool:
    """
    Check if a user has a resume.
    
    Args:
        ctx: The run context
        
    Returns:
        True if user has a resume, False otherwise
    """
    user_id = ctx.user_id
    logger.info(f"Checking if user {user_id} has a resume")
    
    if ctx.deps.resume_processor:
        return ctx.deps.resume_processor.check_resume_exists(user_id)
    
    # Mock response
    return False 
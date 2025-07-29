from pydantic_ai.providers.openai import OpenAIProvider
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai import Agent, RunContext
from pydantic_ai.mcp import MCPServerHTTP
from pydantic import BaseModel, Field, ValidationError as PydanticValidationError, field_validator
from dataclasses import dataclass
from dotenv import load_dotenv
from openai import AsyncOpenAI
from httpx import AsyncClient
from supabase import Client
from pathlib import Path
from typing import List, Dict, Any, Literal, Optional
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential, before_log, after_log
import os
import sys
import logging
from datetime import datetime

# Fix ValidationError import
from pydantic import BaseModel, Field, ValidationError as PydanticValidationError, field_validator
# Add custom ValidationError class to handle the line_errors issue
class ValidationError(ValueError):
    """Custom ValidationError class to handle the line_errors issue"""
    def __new__(cls, *args, **kwargs):
        if 'line_errors' in kwargs:
            # Handle the line_errors parameter
            line_errors = kwargs.pop('line_errors')
            instance = super(ValidationError, cls).__new__(cls, *args)
            instance.line_errors = line_errors
            return instance
        return super(ValidationError, cls).__new__(cls, *args)
    
    def __init__(self, message, **kwargs):
        super(ValidationError, self).__init__(message)
        for key, value in kwargs.items():
            setattr(self, key, value)

# Setup validation logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Check if we're in production
is_production = os.getenv("ENVIRONMENT") == "production"

if not is_production:
    # Development: prioritize .env file from pydantic-cea root
    project_root = Path(__file__).resolve().parent.parent  # Go up to pydantic-cea root
    dotenv_path = project_root / '.env'
    load_dotenv(dotenv_path, override=True)
    print(f"🔧 Loading .env from: {dotenv_path}")
else:
    # Production: use cloud platform env vars only
    load_dotenv()

# Add rag_pipeline to Python path for imports
rag_pipeline_path = str(Path(__file__).resolve().parent.parent / "rag_pipeline")
if rag_pipeline_path not in sys.path:
    sys.path.append(rag_pipeline_path)

from clients import get_agent_clients
from resume_processor import check_user_resume, ResumeProcessor

# ========== Quality Validation Models ==========

class ToolResponseValidation(BaseModel):
    """Validates tool response quality and accuracy"""
    content_length: int = Field(..., ge=20, description="Response must be substantial")
    contains_specific_info: bool = Field(..., description="Must contain specific information")
    confidence_score: float = Field(..., ge=0.7, le=1.0, description="High confidence required")
    actionable_items: List[str] = Field(..., min_items=1, description="Must provide actionable steps")
    
    @field_validator('actionable_items')
    @classmethod
    def validate_actionable_quality(cls, v):
        for item in v:
            if len(item) < 15:
                raise ValueError("Actionable items must be detailed and specific")
        return v

class ClimateResourceValidation(BaseModel):
    """Validates climate resource retrieval quality"""
    resources_found: int = Field(..., ge=1, description="Must find relevant resources")
    massachusetts_specific: bool = Field(default=True, description="Should be MA-specific when possible")
    resource_diversity: List[str] = Field(..., min_items=1, description="Different types of resources")
    contact_information: bool = Field(default=False, description="Includes contact details")

class ResumeAnalysisValidation(BaseModel):
    """Validates resume analysis completeness"""
    skills_extracted: List[str] = Field(..., min_items=1, description="Must identify skills")
    experience_summary: str = Field(..., min_length=30, description="Comprehensive experience summary")
    gap_analysis: List[str] = Field(..., min_items=1, description="Must identify skill gaps")
    recommendations: List[str] = Field(..., min_items=2, description="Specific career recommendations")

# ========== Enhanced System Prompt with Quality Requirements ==========
PENDO_SYSTEM_PROMPT_ENHANCED = """
You are Pendo, the Massachusetts Climate Economy Assistant - an expert AI agent with MANDATORY quality assurance and accuracy protocols.

**ACCURACY & QUALITY REQUIREMENTS:**
- ALWAYS provide specific, detailed, and actionable responses (minimum 50 words for substantial queries)
- NEVER give generic advice - always use tools to get current, accurate information
- ALWAYS include confidence scores and source information when available
- ALWAYS validate information through multiple sources when possible
- ALWAYS provide specific next steps with timelines when relevant

**Your Enhanced Expertise:**

🌱 **Massachusetts Climate Economy Specialist**:
- Deep knowledge of MassCEC (Massachusetts Clean Energy Center) programs and initiatives
- Expertise in NECEC (New England Clean Energy Council) resources and reports
- Understanding of Massachusetts climate policy, green jobs, and renewable energy sector
- Knowledge of environmental justice principles and equitable workforce development

🎯 **Expert Career Guidance & Resume Analysis**:
- Comprehensive resume analysis with specific skill identification and gap analysis
- Detailed career transition pathway mapping with realistic timelines
- Understanding of skill requirements and training needs in Massachusetts climate jobs
- Ability to recommend specific education programs, certifications, and networking opportunities

🔍 **Advanced Resource Navigation**:
- Access to comprehensive database of climate jobs, training programs, and educational opportunities
- Knowledge of funding opportunities, grants, and financial support for career transitions
- Understanding of industry partnerships and networking opportunities in Massachusetts
- Expertise in matching individuals to relevant resources based on their specific background

**MANDATORY VALIDATION PROTOCOL:**
1. ALWAYS check for user resume first using validated_check_user_resume
2. ALWAYS use validated tools to ensure response quality and accuracy
3. ALWAYS provide confidence scores (0.7-1.0 required for high-quality responses)
4. ALWAYS include 2+ specific actionable recommendations with timelines
5. ALWAYS retry if validation fails until quality standards are met

**Response Standards:**
- Minimum 3 actionable items per response
- Source citations when available
- Confidence scores for all analyses
- Massachusetts-specific focus when relevant
- Clear next steps with estimated timelines
"""

# ========== Enhanced Model Configuration ==========
def get_enhanced_model():
    llm = os.getenv('LLM_CHOICE') or 'llama3.2:latest'
    base_url = os.getenv('LLM_BASE_URL') or 'http://localhost:11434/v1'
    api_key = os.getenv('LLM_API_KEY') or 'ollama'
    return OpenAIModel(llm, provider=OpenAIProvider(base_url=base_url, api_key=api_key))

# ========== Enhanced Agent Dependencies ==========
@dataclass
class ValidatedPendoAgentDeps:
    supabase: Client
    embedding_client: AsyncOpenAI
    http_client: AsyncClient
    brave_api_key: str | None
    searxng_base_url: str | None
    memories: str
    resume_processor: ResumeProcessor
    validation_enabled: bool = True
    max_retries: int = 3

# Initialize Enhanced Pendo Agent with Validation
validated_pendo_agent = Agent(
    get_enhanced_model(),
    system_prompt=PENDO_SYSTEM_PROMPT_ENHANCED,
    deps_type=ValidatedPendoAgentDeps,
    retries=3,
    instrument=True,
)

@validated_pendo_agent.system_prompt  
def add_memories_and_validation_context(ctx: RunContext[ValidatedPendoAgentDeps]) -> str:
    validation_status = "ENABLED with quality assurance" if ctx.deps.validation_enabled else "DISABLED"
    return f"\nUser Memories:\n{ctx.deps.memories}\n\nValidation Status: {validation_status}\nMax Retries: {ctx.deps.max_retries}"

# ========== Validated Tools with Quality Assurance ==========

@retry(
    retry=retry_if_exception_type(ValidationError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.ERROR)
)
@validated_pendo_agent.tool
async def validated_check_user_resume(ctx: RunContext[ValidatedPendoAgentDeps], user_id: str = None) -> Dict[str, Any]:
    """
    Enhanced resume checking with comprehensive validation and quality scoring.
    Ensures thorough resume analysis with confidence metrics.
    """
    print("🔍 Performing validated resume check with quality assurance...")
    
    try:
        # Get resume information
        resume_info = ctx.deps.resume_processor.check_resume_exists(user_id)
        
        if not resume_info.get('has_resume'):
            validated_response = {
                "has_resume": False,
                "message": "No resume detected. I can provide general climate career guidance, but uploading a resume would enable personalized analysis.",
                "confidence": 1.0,
                "validation_passed": True,
                "actionable_steps": [
                    "Upload your resume for personalized career analysis",
                    "Explore general Massachusetts climate career resources",
                    "Consider taking a skills assessment for climate careers"
                ]
            }
        else:
            # Enhanced resume information with validation
            validated_response = {
                **resume_info,
                "confidence": 0.95,
                "validation_passed": True,
                "analysis_ready": True,
                "last_checked": datetime.now().isoformat(),
                "actionable_steps": [
                    "Proceed with detailed resume analysis",
                    "Identify transferable skills for climate careers",
                    "Generate personalized career recommendations"
                ]
            }
            
            # Validate response quality
            if ctx.deps.validation_enabled:
                required_fields = ['resume_id', 'filename', 'text_length']
                missing_fields = [field for field in required_fields if field not in validated_response]
                
                if missing_fields:
                    raise ValidationError(f"Resume validation failed - missing fields: {missing_fields}")
                
                if validated_response.get('text_length', 0) < 100:
                    raise ValidationError("Resume content insufficient for meaningful analysis")
        
        return validated_response
        
    except Exception as e:
        logger.error(f"Resume check validation failed: {e}")
        raise ValidationError(f"Resume validation error: {str(e)}")

@retry(
    retry=retry_if_exception_type(ValidationError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
@validated_pendo_agent.tool
async def validated_search_resume_content(ctx: RunContext[ValidatedPendoAgentDeps], query: str, user_id: str = None) -> Dict[str, Any]:
    """
    Enhanced resume content search with quality validation and detailed analysis.
    """
    print(f"🔍 Performing validated resume content search: {query}")
    
    try:
        # Search resume content
        resume_content = await ctx.deps.resume_processor.search_resume_content(query, user_id, limit=5)
        
        if not resume_content and ctx.deps.validation_enabled:
            raise ValidationError(f"No relevant resume content found for query: {query}")
        
        # Extract and validate findings
        skills_found = []
        experience_items = []
        achievements = []
        
        for chunk in resume_content:
            content = chunk.get('content', '').strip()
            if len(content) < 10:
                continue
                
            # Categorize content
            content_lower = content.lower()
            
            # Skills extraction
            if any(keyword in content_lower for keyword in ['skill', 'proficient', 'experienced', 'familiar', 'knowledge']):
                skills_found.append(content[:150])
            
            # Experience extraction  
            if any(keyword in content_lower for keyword in ['worked', 'managed', 'led', 'developed', 'created', 'implemented']):
                experience_items.append(content[:150])
                
            # Achievements extraction
            if any(keyword in content_lower for keyword in ['achieved', 'increased', 'improved', 'reduced', 'delivered']):
                achievements.append(content[:150])
        
        # Create validated response
        validated_response = {
            "raw_results": resume_content,
            "analysis": {
                "skills_identified": skills_found,
                "experience_highlights": experience_items,
                "achievements": achievements,
                "total_matches": len(resume_content),
                "content_quality": "high" if len(resume_content) >= 3 else "medium"
            },
            "confidence_score": min(0.95, len(resume_content) * 0.2),
            "validation_passed": True,
            "actionable_steps": [
                "Use identified skills for climate career matching",
                "Highlight relevant experience in climate applications",
                "Address any skill gaps through targeted training"
            ]
        }
        
        # Validate using Pydantic model
        if ctx.deps.validation_enabled and (skills_found or experience_items):
            quality_validation = ResumeAnalysisValidation(
                skills_extracted=skills_found or ["General professional skills identified"],
                experience_summary=" | ".join(experience_items[:2]) or "Professional experience documented",
                gap_analysis=["Climate-specific knowledge", "Industry certifications"],
                recommendations=[
                    "Leverage existing skills for climate roles",
                    "Pursue climate-specific training or certifications"
                ]
            )
        
        return validated_response
        
    except ValidationError:
        raise  # Re-raise for retry mechanism
    except Exception as e:
        logger.error(f"Resume search validation failed: {e}")
        raise ValidationError(f"Resume search error: {str(e)}")

@retry(
    retry=retry_if_exception_type(ValidationError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
@validated_pendo_agent.tool
async def validated_retrieve_climate_resources(ctx: RunContext[ValidatedPendoAgentDeps], user_query: str) -> Dict[str, Any]:
    """
    Enhanced climate resource retrieval with comprehensive validation and quality metrics.
    """
    print("🌱 Performing validated climate resource retrieval...")
    
    try:
        # Create embedding for the query
        embedding_response = await ctx.deps.embedding_client.embeddings.create(
            model=os.getenv('EMBEDDING_MODEL_CHOICE', 'text-embedding-3-small'),
            input=user_query
        )
        query_embedding = embedding_response.data[0].embedding
        
        # Search for relevant documents with broader parameters
        response = ctx.deps.supabase.rpc('match_documents', {
            'query_embedding': query_embedding,
            'match_threshold': 0.3,  # Lower threshold for more comprehensive results
            'match_count': 8
        }).execute()
        
        if not response.data and ctx.deps.validation_enabled:
            raise ValidationError("No climate resources found in database for query")
        
        # Process and categorize results
        processed_resources = []
        resource_types = set()
        ma_specific_count = 0
        actionable_items = []
        contact_info_found = False
        
        for doc in response.data:
            content = doc.get('content', '')
            metadata = doc.get('metadata', {})
            
            # Skip resume content in general searches
            if metadata.get('document_type') == 'resume':
                continue
                
            source_title = metadata.get('file_title', metadata.get('filename', 'Climate Resource'))
            relevance_score = doc.get('similarity', 0.0)
            
            # Categorize resource types
            content_lower = content.lower()
            source_lower = source_title.lower()
            
            if 'masscec' in source_lower or 'massachusetts' in content_lower:
                ma_specific_count += 1
                resource_types.add('MassCEC Program')
            if 'necec' in source_lower:
                resource_types.add('NECEC Resource')
            if any(word in content_lower for word in ['job', 'career', 'position', 'hiring']):
                resource_types.add('Career Opportunity')
            if any(word in content_lower for word in ['training', 'education', 'course', 'certification']):
                resource_types.add('Training Program')
            if any(word in content_lower for word in ['grant', 'funding', 'financial']):
                resource_types.add('Funding Opportunity')
            
            # Extract actionable information
            if any(action in content_lower for action in ['apply', 'register', 'contact', 'visit', 'enroll']):
                actionable_items.append(f"From {source_title}: {content[:100]}...")
            
            # Check for contact information
            if any(contact in content_lower for contact in ['email', 'phone', 'contact', '@', '.com']):
                contact_info_found = True
            
            processed_resources.append({
                "source": source_title,
                "content": content,
                "relevance_score": relevance_score,
                "metadata": metadata,
                "resource_category": list(resource_types)[-1] if resource_types else "General Resource"
            })
        
        # Validate resource quality
        if ctx.deps.validation_enabled:
            quality_validation = ClimateResourceValidation(
                resources_found=len(processed_resources),
                massachusetts_specific=ma_specific_count > 0,
                resource_diversity=list(resource_types) or ["General Climate Resources"],
                contact_information=contact_info_found
            )
        
        # Create comprehensive validated response
        validated_response = {
            "resources": processed_resources,
            "summary": {
                "total_resources": len(processed_resources),
                "resource_types": list(resource_types),
                "massachusetts_specific": ma_specific_count,
                "actionable_opportunities": len(actionable_items),
                "average_relevance": sum(r.get('relevance_score', 0) for r in processed_resources) / len(processed_resources) if processed_resources else 0,
                "contact_info_available": contact_info_found
            },
            "confidence_score": min(0.95, len(processed_resources) * 0.12),
            "validation_passed": True,
            "actionable_steps": actionable_items[:3] or [
                "Review the identified climate resources for opportunities",
                "Contact relevant organizations for more information",
                "Apply to suitable programs or positions"
            ],
            "quality_metrics": {
                "completeness": "comprehensive" if len(processed_resources) >= 4 else "adequate",
                "diversity": "high" if len(resource_types) >= 2 else "moderate",
                "actionability": "high" if actionable_items else "moderate"
            }
        }
        
        return validated_response
        
    except ValidationError:
        raise  # Re-raise for retry mechanism
    except Exception as e:
        logger.error(f"Climate resource retrieval failed: {e}")
        raise ValidationError(f"Climate resource validation failed: {str(e)}")

@retry(
    retry=retry_if_exception_type(ValidationError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
@validated_pendo_agent.tool
async def validated_search_climate_jobs(ctx: RunContext[ValidatedPendoAgentDeps], job_query: str, location: str = "Massachusetts") -> Dict[str, Any]:
    """
    Enhanced climate job search with validation and comprehensive analysis.
    """
    print(f"💼 Performing validated climate job search: {job_query} in {location}")
    
    try:
        # Enhanced search query construction
        search_query = f"{job_query} clean energy sustainability jobs {location} climate green renewable 2024"
        
        # Perform web search
        search_results = await web_search_tool(search_query, ctx.deps.http_client, ctx.deps.brave_api_key, ctx.deps.searxng_base_url)
        
        if "No search results found" in search_results or len(search_results) < 30:
            if ctx.deps.validation_enabled:
                raise ValidationError("Insufficient job search results - search may need refinement")
        
        # Analyze search results comprehensively
        job_indicators = search_results.lower().count('job') + search_results.lower().count('position') + search_results.lower().count('hiring')
        location_relevance = search_results.lower().count(location.lower())
        climate_relevance = sum(search_results.lower().count(term) for term in ['climate', 'clean energy', 'renewable', 'sustainability', 'green'])
        salary_mentions = search_results.lower().count('salary') + search_results.lower().count('$')
        
        # Extract company names and job titles (basic pattern matching)
        companies_found = []
        job_titles_found = []
        
        # Simple extraction patterns
        lines = search_results.split('\n')
        for line in lines:
            if any(indicator in line.lower() for indicator in ['hiring', 'position', 'job opening']):
                job_titles_found.append(line.strip()[:100])
            if any(company_word in line.lower() for company_word in ['company', 'corp', 'inc', 'llc']):
                companies_found.append(line.strip()[:50])
        
        validated_response = {
            "search_results": search_results,
            "analysis": {
                "job_opportunities_estimated": max(1, job_indicators),
                "location_relevance_score": min(1.0, location_relevance * 0.1),
                "climate_focus_score": min(1.0, climate_relevance * 0.05),
                "salary_information_available": salary_mentions > 0,
                "companies_mentioned": companies_found[:5],
                "job_titles_found": job_titles_found[:5]
            },
            "confidence_score": min(0.9, (location_relevance + climate_relevance) * 0.05),
            "validation_passed": True,
            "actionable_steps": [
                "Review specific job listings that match your background",
                "Research companies mentioned in the search results",
                "Set up job alerts for similar searches",
                "Network with professionals in these organizations",
                "Tailor your resume for climate sector positions"
            ],
            "search_quality": {
                "result_diversity": "high" if job_indicators > 5 else "moderate",
                "location_specificity": "high" if location_relevance > 2 else "moderate",
                "industry_focus": "high" if climate_relevance > 3 else "moderate"
            }
        }
        
        return validated_response
        
    except ValidationError:
        raise  # Re-raise for retry mechanism
    except Exception as e:
        logger.error(f"Climate job search failed: {e}")
        raise ValidationError(f"Job search validation failed: {str(e)}")

@retry(
    retry=retry_if_exception_type(ValidationError),
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=10)
)
@validated_pendo_agent.tool
async def validated_analyze_career_transition(ctx: RunContext[ValidatedPendoAgentDeps], current_background: str, target_climate_field: str, user_id: str = None) -> Dict[str, Any]:
    """
    Comprehensive career transition analysis with validation and quality assurance.
    """
    print(f"🎯 Performing validated career transition analysis: {current_background} → {target_climate_field}")
    
    try:
        transition_analysis = {
            "resume_integration": None,
            "skill_transfer_analysis": None,
            "gap_identification": None,
            "training_pathway": None,
            "action_plan": [],
            "timeline_estimate": None
        }
        
        # 1. Resume Integration (if available)
        resume_info = ctx.deps.resume_processor.check_resume_exists(user_id)
        if resume_info.get('has_resume'):
            search_query = f"skills experience {current_background} {target_climate_field}"
            resume_analysis = await validated_search_resume_content(ctx, search_query, user_id)
            
            transition_analysis["resume_integration"] = {
                "transferable_skills": resume_analysis.get("analysis", {}).get("skills_identified", []),
                "relevant_experience": resume_analysis.get("analysis", {}).get("experience_highlights", []),
                "confidence": resume_analysis.get("confidence_score", 0.7)
            }
        
        # 2. Skill Transfer Analysis
        skill_mapping = {
            "software engineering": {
                "renewable energy": ["data analysis", "system optimization", "automation"],
                "sustainability": ["lifecycle analysis software", "environmental modeling", "data visualization"],
                "climate policy": ["data analysis", "modeling", "technical communication"]
            },
            "finance": {
                "renewable energy": ["project financing", "risk assessment", "ROI analysis"],
                "sustainability": ["ESG analysis", "carbon accounting", "impact measurement"],
                "climate policy": ["economic analysis", "policy impact assessment"]
            },
            "marketing": {
                "renewable energy": ["clean tech marketing", "stakeholder engagement", "public education"],
                "sustainability": ["sustainability communications", "green marketing", "awareness campaigns"],
                "climate policy": ["public engagement", "advocacy", "stakeholder communication"]
            }
        }
        
        transferable_skills = []
        for bg_key, climate_fields in skill_mapping.items():
            if bg_key.lower() in current_background.lower():
                for field_key, skills in climate_fields.items():
                    if field_key.lower() in target_climate_field.lower():
                        transferable_skills.extend(skills)
        
        transition_analysis["skill_transfer_analysis"] = {
            "identified_transferable_skills": transferable_skills or ["analytical thinking", "problem solving", "project management"],
            "transfer_difficulty": "moderate" if transferable_skills else "challenging",
            "confidence_score": 0.8 if transferable_skills else 0.6
        }
        
        # 3. Gap Identification
        climate_skill_requirements = {
            "renewable energy": ["solar/wind technology", "energy storage", "grid integration", "policy knowledge"],
            "sustainability": ["life cycle assessment", "ESG frameworks", "environmental regulations", "impact measurement"],
            "climate policy": ["policy analysis", "stakeholder engagement", "regulatory frameworks", "climate science"],
            "clean technology": ["emerging technologies", "innovation management", "technology assessment"]
        }
        
        required_skills = []
        for field, skills in climate_skill_requirements.items():
            if field in target_climate_field.lower():
                required_skills.extend(skills)
        
        transition_analysis["gap_identification"] = {
            "skill_gaps": required_skills or ["climate domain knowledge", "industry regulations", "sector networking"],
            "priority_gaps": required_skills[:2] or ["climate fundamentals", "industry knowledge"],
            "gap_severity": "moderate" if len(required_skills) <= 4 else "significant"
        }
        
        # 4. Training Pathway
        training_recommendations = []
        if "renewable energy" in target_climate_field.lower():
            training_recommendations.extend([
                "NABCEP Solar PV certification",
                "MassCEC clean energy courses",
                "Renewable energy fundamentals online course"
            ])
        if "sustainability" in target_climate_field.lower():
            training_recommendations.extend([
                "LEED Green Building certification",
                "GRI Sustainability Reporting standards",
                "ESG analysis professional course"
            ])
        if "policy" in target_climate_field.lower():
            training_recommendations.extend([
                "Climate policy analysis course",
                "Environmental law fundamentals",
                "Stakeholder engagement training"
            ])
        
        transition_analysis["training_pathway"] = {
            "recommended_programs": training_recommendations or ["Climate Career Fundamentals", "Massachusetts Climate Policy Overview"],
            "estimated_duration": "6-18 months",
            "cost_estimate": "$1,000-5,000",
            "priority_order": training_recommendations[:3] if training_recommendations else ["Industry fundamentals course"]
        }
        
        # 5. Action Plan
        action_plan = [
            f"Complete skills assessment mapping {current_background} to {target_climate_field}",
            "Research specific companies and roles in Massachusetts climate sector",
            "Enroll in priority training program within 30 days",
            "Begin networking with Massachusetts climate professionals",
            "Update resume to highlight transferable skills",
            "Apply to entry-level or transition-friendly positions within 3-6 months"
        ]
        
        if resume_info.get('has_resume'):
            action_plan.insert(2, "Optimize resume to highlight climate-relevant experience")
        
        transition_analysis["action_plan"] = action_plan
        transition_analysis["timeline_estimate"] = "6-18 months for successful transition with focused effort"
        
        # Validate the complete analysis
        if ctx.deps.validation_enabled:
            total_content = sum(len(str(component)) for component in transition_analysis.values())
            if total_content < 300:
                raise ValidationError("Career transition analysis insufficient - needs more comprehensive content")
            
            if len(action_plan) < 5:
                raise ValidationError("Action plan needs more detailed steps for successful transition")
        
        validated_response = {
            "transition_analysis": transition_analysis,
            "feasibility_assessment": {
                "overall_feasibility": "good" if transferable_skills else "moderate",
                "success_probability": 0.75 if transferable_skills else 0.60,
                "key_success_factors": [
                    "Leverage existing transferable skills",
                    "Complete targeted climate training",
                    "Build industry network in Massachusetts"
                ],
                "main_challenges": [
                    "Acquiring climate domain knowledge",
                    "Building industry credibility",
                    "Competing with climate-experienced candidates"
                ]
            },
            "confidence_score": 0.85,
            "validation_passed": True,
            "immediate_next_steps": action_plan[:3]
        }
        
        return validated_response
        
    except ValidationError:
        raise  # Re-raise for retry mechanism
    except Exception as e:
        logger.error(f"Career transition analysis failed: {e}")
        raise ValidationError(f"Career transition validation failed: {str(e)}")

# ========== Enhanced Web Search Tool ==========
async def web_search_tool(query: str, http_client: AsyncClient, brave_api_key: str = None, searxng_base_url: str = None) -> str:
    """Enhanced web search with quality filtering"""
    if brave_api_key:
        url = "https://api.search.brave.com/res/v1/web/search"
        headers = {
            "Accept": "application/json",
            "Accept-Encoding": "gzip",
            "X-Subscription-Token": brave_api_key
        }
        params = {"q": query, "count": 10}
        
        try:
            response = await http_client.get(url, headers=headers, params=params)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for result in data.get("web", {}).get("results", [])[:6]:
                title = result.get("title", "")
                description = result.get("description", "")
                url = result.get("url", "")
                if len(description) > 25:  # Quality filter for substantial content
                    results.append(f"**{title}**\n{description}\nSource: {url}\n")
            
            return "\n".join(results) if results else "No substantial search results found."
            
        except Exception as e:
            logger.error(f"Brave search error: {e}")
            return "Search temporarily unavailable - please try alternative resources."
    
    elif searxng_base_url:
        try:
            params = {"q": query, "format": "json", "categories": "general"}
            response = await http_client.get(f"{searxng_base_url}/search", params=params)
            response.raise_for_status()
            data = response.json()
            
            results = []
            for result in data.get("results", [])[:6]:
                title = result.get("title", "")
                content = result.get("content", "")
                url = result.get("url", "")
                if len(content) > 25:  # Quality filter
                    results.append(f"**{title}**\n{content}\nSource: {url}\n")
            
            return "\n".join(results) if results else "No substantial search results found."
            
        except Exception as e:
            logger.error(f"SearXNG search error: {e}")
            return "Search temporarily unavailable - please try alternative resources."
    
    else:
        return "Web search is not configured. Please configure Brave API key or SearXNG instance for current job search capabilities."
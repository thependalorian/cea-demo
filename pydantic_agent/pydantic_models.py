from datetime import datetime
from enum import Enum
from typing import Dict, List, Optional, Union, Any
from uuid import UUID
from pydantic import BaseModel, Field, EmailStr, HttpUrl, validator
import ipaddress


# Enums
class ProfileType(str, Enum):
    JOB_SEEKER = "job_seeker"
    PARTNER = "partner"
    ADMIN = "admin"
    GENERAL = "general"


class ConversationStatus(str, Enum):
    ACTIVE = "active"
    PAUSED = "paused"
    COMPLETED = "completed"
    ARCHIVED = "archived"


class ConversationType(str, Enum):
    GENERAL = "general"
    CAREER_GUIDANCE = "career_guidance"
    JOB_SEARCH = "job_search"
    SKILL_ASSESSMENT = "skill_assessment"
    PARTNER_INQUIRY = "partner_inquiry"
    ADMIN_SUPPORT = "admin_support"
    CONTEXT_STORAGE = "context_storage"
    MEMORY_SESSION = "memory_session"
    AI_INTERACTION = "ai_interaction"


class MessageRole(str, Enum):
    HUMAN = "human"
    AI = "ai"
    SYSTEM = "system"
    TOOL = "tool"
    USER = "user"
    ASSISTANT = "assistant"


class FeedbackType(str, Enum):
    HELPFUL = "helpful"
    NOT_HELPFUL = "not_helpful"
    CORRECTION = "correction"
    FLAG = "flag"
    THUMBS_UP = "thumbs_up"
    THUMBS_DOWN = "thumbs_down"
    RATING = "rating"


class WorkflowType(str, Enum):
    AUTHENTICATION = "authentication"
    SESSION_ENHANCEMENT = "session_enhancement"
    CONTEXT_INJECTION = "context_injection"
    MEMORY_MANAGEMENT = "memory_management"
    ADMIN = "admin"
    JOB_SEEKER = "job_seeker"
    PARTNER = "partner"
    AI_INTERACTION = "ai_interaction"
    CAREER_GUIDANCE = "career_guidance"
    JOB_SEARCH = "job_search"
    SKILL_ASSESSMENT = "skill_assessment"


class SubscriptionTier(str, Enum):
    FREE = "free"
    PRO = "pro"
    EARLY_ACCESS = "early_access"
    REGULAR = "regular"


class SubscriptionStatus(str, Enum):
    ACTIVE = "active"
    TRIALING = "trialing"
    PAST_DUE = "past_due"
    CANCELED = "canceled"
    INCOMPLETE = "incomplete"
    INCOMPLETE_EXPIRED = "incomplete_expired"


# Authentication Models
class AuthUser(BaseModel):
    id: UUID
    email: Optional[str]
    phone: Optional[str]
    role: Optional[str]
    app_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="raw_app_meta_data")
    user_metadata: Optional[Dict[str, Any]] = Field(default_factory=dict, alias="raw_user_meta_data")
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    last_sign_in_at: Optional[datetime]
    is_anonymous: bool = False
    is_sso_user: bool = False
    banned_until: Optional[datetime] = None
    deleted_at: Optional[datetime] = None


class Session(BaseModel):
    id: UUID
    user_id: UUID
    created_at: Optional[datetime]
    updated_at: Optional[datetime]
    not_after: Optional[datetime] = None
    refreshed_at: Optional[datetime] = None
    user_agent: Optional[str] = None
    ip: Optional[str] = None
    tag: Optional[str] = None


# Profile Models
class ConsolidatedProfile(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    phone: Optional[str] = None
    profile_type: ProfileType
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    profile_completed: Optional[bool] = False
    last_login: Optional[datetime] = None
    current_title: Optional[str] = None
    experience_level: Optional[str] = None
    climate_interests: Dict[str, Any] = Field(default_factory=dict)
    desired_roles: List[Dict[str, Any]] = Field(default_factory=list)
    resume_url: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    salary_range_min: Optional[int] = None
    salary_range_max: Optional[int] = None
    career_goals: Optional[str] = None
    preferred_locations: Dict[str, Any] = Field(default_factory=dict)
    remote_work_preference: Optional[str] = None
    
    # Partner specific fields
    organization_name: Optional[str] = None
    organization_type: Optional[str] = None
    website: Optional[str] = None
    partnership_level: Optional[str] = "standard"
    verified: Optional[bool] = False
    description: Optional[str] = None
    social_links: Dict[str, Any] = Field(default_factory=dict)
    organization_features: Dict[str, Any] = Field(default_factory=dict)
    organization_size: Optional[str] = None
    headquarters: Optional[str] = None
    mission_statement: Optional[str] = None
    employee_count: Optional[int] = None
    founded_year: Optional[int] = None
    hiring_actively: Optional[bool] = False
    climate_focus: Optional[List[str]] = None
    
    # Admin specific fields
    admin_level: Optional[str] = None
    permissions: Dict[str, Any] = Field(default_factory=dict)
    department: Optional[str] = None
    admin_notes: Optional[str] = None
    emergency_contact: Dict[str, Any] = Field(default_factory=dict)
    last_admin_action: Optional[datetime] = None
    total_admin_actions: Optional[int] = 0
    admin_capabilities: Dict[str, Any] = Field(default_factory=dict)
    
    # Subscription fields
    subscription_tier: Optional[SubscriptionTier] = None
    subscription_status: Optional[SubscriptionStatus] = None
    subscription_id: Optional[UUID] = None
    stripe_customer_id: Optional[str] = None


class AdminProfile(BaseModel):
    id: UUID
    user_id: UUID
    email: str
    full_name: Optional[str] = None
    can_manage_users: bool = False
    can_manage_content: bool = False
    can_manage_partners: bool = False
    can_manage_system: bool = False
    can_view_analytics: bool = False
    profile_completed: bool = False
    permissions: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class UserProfile(BaseModel):
    id: UUID
    email: str
    full_name: Optional[str] = None
    is_admin: bool = False
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Conversation Models
class Conversation(BaseModel):
    id: str
    user_id: Optional[UUID] = None
    title: Optional[str] = None
    description: Optional[str] = None
    conversation_type: Optional[ConversationType] = ConversationType.GENERAL
    thread_id: Optional[str] = None
    context: Dict[str, Any] = Field(default_factory=dict)
    status: Optional[ConversationStatus] = ConversationStatus.ACTIVE
    message_count: Optional[int] = 0
    total_tokens_used: Optional[int] = 0
    created_at: datetime
    updated_at: datetime
    last_activity: datetime
    initial_query: Optional[str] = None
    ended_at: Optional[str] = None
    session_metadata: Dict[str, Any] = Field(default_factory=dict)
    agent: Optional[str] = None
    session_id: str
    is_archived: Optional[bool] = False
    metadata: Dict[str, Any] = Field(default_factory=dict)
    last_message_at: Optional[datetime] = None


class Message(BaseModel):
    id: str
    conversation_id: str
    role: str  # Can be 'human' or 'ai'
    content: str
    message_data: Optional[str] = None
    data: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    tokens_used: Optional[int] = 0
    model_used: Optional[str] = None
    response_time_ms: Optional[int] = None
    context: Dict[str, Any] = Field(default_factory=dict)
    metadata: Dict[str, Any] = Field(default_factory=dict)
    thread_id: Optional[str] = None
    content_type: Optional[str] = "text"
    processed: Optional[bool] = True
    specialist_type: Optional[str] = None
    error_message: Optional[str] = None
    embedding: Optional[Any] = None  # Vector type


class ConversationMessage(BaseModel):
    id: str
    conversation_id: str
    role: MessageRole
    content: str
    content_type: Optional[str] = "text"
    metadata: Dict[str, Any] = Field(default_factory=dict)
    processed: Optional[bool] = False
    error_message: Optional[str] = None
    embedding: Optional[Any] = None  # Vector type
    created_at: str
    updated_at: Optional[str] = None
    specialist_type: Optional[str] = None


class MessageFeedback(BaseModel):
    id: str
    conversation_id: str
    message_id: str
    user_id: UUID
    feedback_type: FeedbackType
    rating: Optional[int] = None
    comment: Optional[str] = None
    correction: Optional[str] = None
    created_at: str


class ConversationAnalytics(BaseModel):
    id: UUID
    conversation_id: str
    user_id: Optional[UUID] = None
    session_duration_seconds: Optional[int] = None
    messages_sent: Optional[int] = 0
    messages_received: Optional[int] = 0
    user_satisfaction_score: Optional[int] = None
    goals_achieved: Optional[bool] = None
    follow_up_actions_taken: Optional[int] = 0
    topics_discussed: Optional[List[str]] = Field(default_factory=list)
    resources_accessed: Optional[List[str]] = Field(default_factory=list)
    jobs_viewed: Optional[List[str]] = Field(default_factory=list)
    partners_contacted: Optional[List[str]] = Field(default_factory=list)
    average_response_time_ms: Optional[float] = None
    total_tokens_consumed: Optional[int] = 0
    ai_accuracy_rating: Optional[int] = None
    conversation_outcome: Optional[str] = None
    next_steps: List[Dict[str, Any]] = Field(default_factory=list)
    analyzed_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    agent_handoffs: Optional[int] = 0
    primary_agent: Optional[str] = None
    coordination_events: Optional[int] = 0
    semantic_routing_confidence: Optional[float] = 0.0
    agent_switches: Optional[int] = 0
    semantic_routing_used: Optional[bool] = False
    routing_confidence: Optional[float] = 0.0
    team_collaborations: Optional[int] = 0
    view_count: Optional[int] = 0
    agent_accuracy_rating: Optional[float] = 0.0
    escalation_count: Optional[int] = 0
    quality_score: Optional[float] = 0.0
    response_quality_rating: Optional[int] = 0


# Agent Models
class Agent(BaseModel):
    id: UUID
    name: str
    agent_id: str
    description: Optional[str] = None
    team: str
    specializations: Optional[List[str]] = None
    intelligence_level: Optional[float] = None
    capabilities: Optional[List[str]] = None
    tools_available: Optional[List[str]] = None
    status: Optional[str] = "active"
    avatar_url: Optional[str] = None
    response_time_avg: Optional[int] = 2
    satisfaction_rating: Optional[float] = 4.5
    total_conversations: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Request Model
class Request(BaseModel):
    id: str
    user_id: UUID
    timestamp: Optional[datetime] = None
    user_query: str


# Resume Models
class Resume(BaseModel):
    id: UUID
    user_id: UUID
    file_name: str
    file_path: Optional[str] = None
    file_size: Optional[int] = None
    content_type: Optional[str] = None
    processed: Optional[bool] = False
    content: Optional[str] = None
    embedding: Optional[Any] = None  # Vector type
    created_at: datetime
    updated_at: datetime
    chunks: Optional[List[str]] = Field(default_factory=list)
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    personal_website: Optional[str] = None
    content_embedding: Optional[Any] = None  # Vector type
    skills_extracted: List[Dict[str, Any]] = Field(default_factory=list)
    experience_years: Optional[int] = None
    education_level: Optional[str] = None
    industry_background: Optional[List[str]] = None
    climate_relevance_score: Optional[float] = None
    processing_status: Optional[str] = "pending"
    processing_error: Optional[str] = None
    processing_metadata: Dict[str, Any] = Field(default_factory=dict)
    certifications: List[Dict[str, Any]] = Field(default_factory=list)
    work_experience: List[Dict[str, Any]] = Field(default_factory=list)
    summary: Optional[str] = None
    chunk_count: Optional[int] = 0
    processed_at: Optional[datetime] = None
    job_titles: List[Dict[str, Any]] = Field(default_factory=list)
    contact_info: Dict[str, Any] = Field(default_factory=dict)
    industries: List[Dict[str, Any]] = Field(default_factory=list)
    job_categories: List[Dict[str, Any]] = Field(default_factory=list)
    career_level: Optional[str] = "entry_level"
    preferred_locations: List[Dict[str, Any]] = Field(default_factory=list)


class ResumeChunk(BaseModel):
    id: UUID
    resume_id: UUID
    chunk_index: int
    content: str
    embedding: Optional[Any] = None  # Vector type
    page_number: Optional[int] = 0
    chunk_type: Optional[str] = "content"
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    section_type: Optional[str] = "unknown"
    importance_score: Optional[float] = 0.5


# Subscription Models
class Subscription(BaseModel):
    id: UUID
    user_id: UUID
    stripe_subscription_id: Optional[str] = None
    stripe_customer_id: Optional[str] = None
    plan_id: str
    status: str = "active"
    current_period_start: Optional[datetime] = None
    current_period_end: Optional[datetime] = None
    cancel_at: Optional[datetime] = None
    canceled_at: Optional[datetime] = None
    trial_start: Optional[datetime] = None
    trial_end: Optional[datetime] = None
    user_type: str  # 'job_seeker' or 'partner'
    tier: str  # 'free', 'pro', 'pro_monthly', 'pro_annual', 'early_access', 'regular', 'partner_early_access', 'partner_regular'
    billing_interval: Optional[str] = None  # 'month' or 'year'
    price_in_cents: int
    currency: str = "usd"
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class SubscriptionFeature(BaseModel):
    id: UUID
    subscription_id: UUID
    feature_name: str
    feature_value: Optional[Dict[str, Any]] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


class SubscriptionUsage(BaseModel):
    id: UUID
    subscription_id: UUID
    feature_name: str
    usage_count: Optional[int] = 0
    reset_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


# Job and Partner Models
class JobListing(BaseModel):
    id: UUID
    partner_id: UUID
    title: str
    description: str
    requirements: Optional[str] = None
    responsibilities: Optional[str] = None
    location: Optional[str] = None
    employment_type: Optional[str] = None
    experience_level: Optional[str] = None
    salary_range: Optional[str] = None
    climate_focus: Optional[List[str]] = Field(default_factory=list)
    skills_required: Optional[List[str]] = Field(default_factory=list)
    benefits: Optional[str] = None
    application_url: Optional[str] = None
    application_email: Optional[str] = None
    is_active: Optional[bool] = True
    expires_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    payment_status: Optional[str] = "pending"


class Payment(BaseModel):
    id: UUID
    partner_id: UUID
    job_listing_id: Optional[UUID] = None
    stripe_session_id: Optional[str] = None
    stripe_payment_intent: Optional[str] = None
    amount: int
    currency: Optional[str] = "usd"
    status: str = "pending"
    payment_type: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    user_id: Optional[UUID] = None


# RAG Document Models
class Source(BaseModel):
    source_id: str
    summary: Optional[str] = None
    total_word_count: Optional[int] = 0
    created_at: datetime
    updated_at: datetime


class CrawledPage(BaseModel):
    id: int
    url: str
    chunk_number: int
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    source_id: str
    embedding: Optional[Any] = None  # Vector type
    created_at: datetime


class CodeExample(BaseModel):
    id: int
    url: str
    chunk_number: int
    content: str
    summary: str
    metadata: Dict[str, Any] = Field(default_factory=dict)
    source_id: str
    embedding: Optional[Any] = None  # Vector type
    created_at: datetime


class DocumentMetadata(BaseModel):
    id: str
    title: Optional[str] = None
    url: Optional[str] = None
    created_at: Optional[datetime] = None
    schema: Optional[str] = None
    embedding: Optional[Any] = None  # Vector type


class DocumentRow(BaseModel):
    id: int
    dataset_id: Optional[str] = None
    row_data: Optional[Dict[str, Any]] = None


# Workflow Models
class WorkflowSession(BaseModel):
    session_id: UUID
    user_id: UUID
    workflow_type: str  # From WorkflowType enum
    data: Dict[str, Any] = Field(default_factory=dict)
    status: Optional[str] = "active"
    created_at: datetime
    updated_at: datetime
    id: UUID


class WorkflowResult(BaseModel):
    id: UUID
    user_id: UUID
    conversation_id: str
    message: str
    analysis: Dict[str, Any] = Field(default_factory=dict)
    agent_id: Optional[str] = None
    result: Dict[str, Any] = Field(default_factory=dict)
    created_at: Optional[datetime] = None 
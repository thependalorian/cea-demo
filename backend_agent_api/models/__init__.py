"""
Models module for backend_agent_api.

This module provides Pydantic models for the backend_agent_api package.
"""

from .pydantic_models import (
    # Enums
    ProfileType,
    ConversationStatus,
    ConversationType,
    MessageRole,
    FeedbackType,
    WorkflowType,
    SubscriptionTier,
    SubscriptionStatus,
    
    # Authentication Models
    AuthUser,
    Session,
    
    # Profile Models
    ConsolidatedProfile,
    AdminProfile,
    UserProfile,
    
    # Conversation Models
    Conversation,
    Message,
    ConversationMessage,
    MessageFeedback,
    ConversationAnalytics,
    
    # Agent Models
    Agent,
    
    # Request Model
    Request,
    
    # Resume Models
    Resume,
    ResumeChunk,
    
    # Subscription Models
    Subscription,
    SubscriptionFeature,
    SubscriptionUsage,
    
    # Job and Partner Models
    JobListing,
    Payment,
    
    # RAG Document Models
    Source,
    CrawledPage,
    CodeExample,
    DocumentMetadata,
    DocumentRow,
    
    # Workflow Models
    WorkflowSession,
    WorkflowResult,
)

__all__ = [
    # Enums
    'ProfileType',
    'ConversationStatus',
    'ConversationType',
    'MessageRole',
    'FeedbackType',
    'WorkflowType',
    'SubscriptionTier',
    'SubscriptionStatus',
    
    # Authentication Models
    'AuthUser',
    'Session',
    
    # Profile Models
    'ConsolidatedProfile',
    'AdminProfile',
    'UserProfile',
    
    # Conversation Models
    'Conversation',
    'Message',
    'ConversationMessage',
    'MessageFeedback',
    'ConversationAnalytics',
    
    # Agent Models
    'Agent',
    
    # Request Model
    'Request',
    
    # Resume Models
    'Resume',
    'ResumeChunk',
    
    # Subscription Models
    'Subscription',
    'SubscriptionFeature',
    'SubscriptionUsage',
    
    # Job and Partner Models
    'JobListing',
    'Payment',
    
    # RAG Document Models
    'Source',
    'CrawledPage',
    'CodeExample',
    'DocumentMetadata',
    'DocumentRow',
    
    # Workflow Models
    'WorkflowSession',
    'WorkflowResult',
] 
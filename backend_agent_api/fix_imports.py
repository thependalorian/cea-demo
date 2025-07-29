"""
Helper module to handle pydantic_agent imports consistently.
This centralizes all import logic in one place.
"""

import sys
import os
from pathlib import Path
from typing import Dict, Any, Optional, List, Union, Tuple
import importlib.util
from pydantic import BaseModel
from enum import Enum

# Add paths for imports
current_dir = Path(__file__).resolve().parent
project_root = current_dir.parent
sys.path.insert(0, str(project_root))
sys.path.insert(0, str(current_dir))

# First try to import from local models directory
try:
    from models.pydantic_models import (
        MessageRole,
        ConversationStatus,
        ConversationType,
        Message,
        ConversationMessage,
        Conversation,
        UserProfile,
        Request,
        Resume,
        ResumeChunk
    )
    print("Successfully imported models from local models directory")
    models_imported = True
except ImportError as e:
    print(f"Could not import from local models: {e}")
    # Try to import pydantic_agent as backup
    try:
        import pydantic_agent
        from pydantic_agent import (
            Message,
            Conversation,
            ConversationMessage,
            UserProfile,
            Request,
            ConversationStatus,
            ConversationType,
            MessageRole,
            Resume,
            ResumeChunk
        )
        print(f"Successfully imported pydantic_agent from: {pydantic_agent.__file__}")
        models_imported = True
    except ImportError:
        print("Using fallback model classes")
        models_imported = False

# If import failed, define fallback classes
if not models_imported:
    class MessageRole(str, Enum):
        SYSTEM = "system"
        USER = "user"
        ASSISTANT = "assistant"
        
    class ConversationStatus(str, Enum):
        ACTIVE = "active"
        ARCHIVED = "archived"
        
    class ConversationType(str, Enum):
        CHAT = "chat"
        JOB_SEARCH = "job_search"
        CAREER_ADVICE = "career_advice"
        
    class Message(BaseModel):
        content: str
        role: MessageRole = MessageRole.USER
        
    class ConversationMessage(BaseModel):
        id: Optional[str] = None
        conversation_id: str
        content: str
        role: MessageRole = MessageRole.USER
        created_at: Optional[str] = None
        
    class Conversation(BaseModel):
        id: str
        user_id: str
        title: Optional[str] = None
        status: ConversationStatus = ConversationStatus.ACTIVE
        type: ConversationType = ConversationType.CHAT
        created_at: Optional[str] = None
        updated_at: Optional[str] = None
        
    class UserProfile(BaseModel):
        id: str
        email: Optional[str] = None
        display_name: Optional[str] = None
        
    class Request(BaseModel):
        query: Optional[str] = None
        user_query: Optional[str] = None
        user_id: str
        session_id: Optional[str] = None
        conversation_id: Optional[str] = None
        context: Optional[Dict[str, Any]] = None
        stream: bool = False
        
        @property
        def actual_query(self) -> str:
            """Get the actual query from either query or user_query field"""
            return self.user_query or self.query or ""
        
    class Resume(BaseModel):
        id: str
        user_id: str
        filename: str
        text_content: str
        created_at: Optional[str] = None
        
    class ResumeChunk(BaseModel):
        id: str
        resume_id: str
        content: str
        chunk_index: int
        embedding: Optional[List[float]] = None 
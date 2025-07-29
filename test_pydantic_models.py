#!/usr/bin/env python3
"""
Test script to verify Pydantic models can be imported and used in the pydantic-cea project.
"""

import sys
from datetime import datetime
from uuid import uuid4, UUID
import json

# Custom JSON encoder to handle UUID objects
class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# Import models from our renamed package
from pydantic_agent import (
    ConversationMessage,
    Message,
    Conversation,
    ConversationStatus,
    ConversationType,
    MessageRole,
    UserProfile,
    Agent,
    DocumentRow,
    DocumentMetadata
)

def test_document_models():
    """Test creating document models for RAG."""
    print("\n=== Testing Document Models ===")
    
    # Create a document metadata instance
    metadata = DocumentMetadata(
        id=str(uuid4()),
        title="Climate Change Impact on Massachusetts",
        url="https://example.com/climate-ma",
        created_at=datetime.now().isoformat(),
        schema="climate_resources"
    )
    
    # Create a document row instance
    doc = DocumentRow(
        id=1,  # Using integer ID as expected by the model
        dataset_id=metadata.id,
        row_data={"content": "Massachusetts is implementing innovative climate policies to reduce emissions."}
    )
    
    print(f"Created document metadata with ID: {metadata.id}")
    print(f"Document title: {metadata.title}")
    print(f"Document URL: {metadata.url}")
    
    print(f"Created document row with ID: {doc.id}")
    print(f"Document dataset ID: {doc.dataset_id}")
    print("Document models test passed!")

def test_conversation_flow():
    """Test a complete conversation flow."""
    print("\n=== Testing Conversation Flow ===")
    
    # Create a user profile
    user_id = str(uuid4())
    profile = UserProfile(
        id=user_id,
        email="user@example.com",
        full_name="Test User",
        is_admin=False,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )
    
    # Create a conversation
    conversation_id = str(uuid4())
    conv = Conversation(
        id=conversation_id,
        user_id=user_id,
        title="Career Transition Advice",
        status=ConversationStatus.ACTIVE,
        conversation_type=ConversationType.CAREER_GUIDANCE,
        session_id=str(uuid4()),
        metadata={"source": "web_app"},
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
        last_message_at=datetime.now().isoformat(),
        last_activity=datetime.now().isoformat(),
        specialist_type=None
    )
    
    # Create user message
    user_msg = ConversationMessage(
        id=str(uuid4()),
        conversation_id=conversation_id,
        role=MessageRole.USER,
        content="How can I transition to a career in renewable energy in Massachusetts?",
        content_type="text",
        metadata={"client": "web"},
        processed=True,
        error_message=None,
        embedding=None,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
        specialist_type=None
    )
    
    # Create agent message
    agent_msg = ConversationMessage(
        id=str(uuid4()),
        conversation_id=conversation_id,
        role=MessageRole.ASSISTANT,
        content="Massachusetts offers several pathways for transitioning to renewable energy careers...",
        content_type="text",
        metadata={"sources": ["climate_resources", "job_listings"]},
        processed=True,
        error_message=None,
        embedding=None,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
        specialist_type=None
    )
    
    # Simulate conversation storage
    conversation_data = {
        "profile": profile.model_dump(),
        "conversation": conv.model_dump(),
        "messages": [
            user_msg.model_dump(),
            agent_msg.model_dump()
        ]
    }
    
    # Save to JSON for inspection using custom encoder
    with open("/tmp/conversation_test.json", "w") as f:
        json.dump(conversation_data, f, indent=2, cls=UUIDEncoder)
    
    print(f"Created conversation flow for user: {profile.full_name}")
    print(f"Conversation title: {conv.title}")
    print(f"Number of messages: {len(conversation_data['messages'])}")
    print(f"Test data saved to: /tmp/conversation_test.json")
    print("Conversation flow test passed!")

def main():
    """Run all tests."""
    print("=== Starting Pydantic Models Integration Tests ===")
    
    try:
        test_document_models()
        test_conversation_flow()
        
        print("\n✅ All integration tests passed successfully!")
        return 0
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main()) 
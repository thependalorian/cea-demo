#!/usr/bin/env python3
"""
Test script to verify Pydantic models can be imported and used.
"""

import sys
from datetime import datetime
from uuid import uuid4, UUID

# Import models from our renamed package
from pydantic_agent import (
    ConversationMessage,
    Message,
    Conversation,
    ConversationStatus,
    ConversationType,
    MessageRole,
    UserProfile,
    Agent
)

def test_conversation_message():
    """Test creating a ConversationMessage instance."""
    print("\n=== Testing ConversationMessage ===")
    
    msg = ConversationMessage(
        id=str(uuid4()),
        conversation_id=str(uuid4()),
        role=MessageRole.USER,
        content="Hello, this is a test message",
        content_type="text",
        metadata={"source": "test_script"},
        processed=True,
        error_message=None,
        embedding=None,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
        specialist_type=None
    )
    
    print(f"Created message with ID: {msg.id}")
    print(f"Message content: {msg.content}")
    print(f"Message role: {msg.role}")
    print(f"Message created at: {msg.created_at}")
    print("ConversationMessage test passed!")

def test_conversation():
    """Test creating a Conversation instance."""
    print("\n=== Testing Conversation ===")
    
    conv = Conversation(
        id=str(uuid4()),
        user_id=str(uuid4()),
        title="Test Conversation",
        status=ConversationStatus.ACTIVE,
        conversation_type=ConversationType.GENERAL,
        session_id=str(uuid4()),
        metadata={"test": True},
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat(),
        last_message_at=datetime.now().isoformat(),
        last_activity=datetime.now().isoformat(),
        specialist_type=None
    )
    
    print(f"Created conversation with ID: {conv.id}")
    print(f"Conversation title: {conv.title}")
    print(f"Conversation status: {conv.status}")
    print(f"Conversation type: {conv.conversation_type}")
    print("Conversation test passed!")

def test_user_profile():
    """Test creating a UserProfile instance."""
    print("\n=== Testing UserProfile ===")
    
    profile = UserProfile(
        id=str(uuid4()),
        email="test@example.com",
        full_name="Test User",
        is_admin=False,
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )
    
    print(f"Created user profile with ID: {profile.id}")
    print(f"User email: {profile.email}")
    print(f"User full name: {profile.full_name}")
    print(f"Is admin: {profile.is_admin}")
    print("UserProfile test passed!")

def test_agent():
    """Test creating an Agent instance."""
    print("\n=== Testing Agent ===")
    
    agent = Agent(
        id=str(uuid4()),
        name="Test Agent",
        agent_id="test-agent-001",
        specializations=["climate", "career"],
        capabilities=["chat", "search", "analyze"],
        status="active",
        team="climate-team",
        created_at=datetime.now().isoformat(),
        updated_at=datetime.now().isoformat()
    )
    
    print(f"Created agent with ID: {agent.id}")
    print(f"Agent name: {agent.name}")
    print(f"Agent specializations: {agent.specializations}")
    print(f"Agent capabilities: {agent.capabilities}")
    print(f"Agent team: {agent.team}")
    print("Agent test passed!")

def main():
    """Run all tests."""
    print("=== Starting Pydantic Models Tests ===")
    
    try:
        test_conversation_message()
        test_conversation()
        test_user_profile()
        test_agent()
        
        print("\n✅ All tests passed successfully!")
        return 0
    except Exception as e:
        print(f"\n❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1

if __name__ == "__main__":
    sys.exit(main()) 
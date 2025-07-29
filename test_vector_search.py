#!/usr/bin/env python3
"""
Test vector search functionality in Supabase.
This script tests the vector search functions in the database using our standardized models.
"""

import os
import json
import numpy as np
from supabase import create_client
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
from uuid import uuid4

# Import our standardized models
from pydantic_agent import (
    DocumentRow,
    DocumentMetadata,
    Resume,
    ResumeChunk,
    ConversationMessage,
    Message
)

# Load environment variables
load_dotenv()

# Supabase configuration
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

# Initialize Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# Vector dimensions for Nomic embeddings
VECTOR_DIMENSIONS = 768

def generate_random_embedding(dimensions: int = VECTOR_DIMENSIONS) -> List[float]:
    """Generate a random embedding vector normalized to unit length."""
    embedding = np.random.normal(0, 1, dimensions).astype(np.float32)
    # Normalize to unit length
    embedding = embedding / np.linalg.norm(embedding)
    return embedding.tolist()

def test_match_documents() -> None:
    """Test the match_documents function."""
    print("\n=== Testing match_documents function ===")
    
    try:
        # Generate a random query embedding
        query_embedding = generate_random_embedding()
        
        # Call the match_documents function
        result = supabase.rpc(
            "match_documents", 
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": 5
            }
        ).execute()
        
        # Print results
        print(f"Found {len(result.data)} matching documents:")
        for i, doc in enumerate(result.data):
            print(f"{i+1}. {doc['title']} (similarity: {doc['similarity']:.4f})")
        
    except Exception as e:
        print(f"Error testing match_documents: {str(e)}")

def test_match_knowledge_resources() -> None:
    """Test the match_knowledge_resources function."""
    print("\n=== Testing match_knowledge_resources function ===")
    
    try:
        # Generate a random query embedding
        query_embedding = generate_random_embedding()
        
        # Call the match_knowledge_resources function
        result = supabase.rpc(
            "match_knowledge_resources", 
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": 5
            }
        ).execute()
        
        # Print results
        print(f"Found {len(result.data)} matching knowledge resources:")
        for i, resource in enumerate(result.data):
            print(f"{i+1}. {resource['title']} (similarity: {resource['similarity']:.4f})")
            print(f"   Climate sectors: {', '.join(resource['climate_sectors'])}")
            print(f"   Career stages: {', '.join(resource['career_stages'])}")
        
    except Exception as e:
        print(f"Error testing match_knowledge_resources: {str(e)}")

def test_match_resume_content() -> None:
    """Test the match_resume_content function using our ResumeChunk model."""
    print("\n=== Testing match_resume_content function ===")
    
    try:
        # Generate a random query embedding
        query_embedding = generate_random_embedding()
        
        # Call the match_resume_content function
        result = supabase.rpc(
            "match_resume_content", 
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": 5,
                "user_id_param": None  # Test without user filter first
            }
        ).execute()
        
        # Convert results to ResumeChunk models
        resume_chunks = []
        for chunk_data in result.data:
            try:
                # Create a ResumeChunk model from the data
                chunk = ResumeChunk(
                    id=str(uuid4()),  # Generate a new ID for this instance
                    resume_id=chunk_data.get("resume_id", ""),
                    chunk_index=0,  # Default if not available
                    content=chunk_data.get("content", ""),
                    embedding=None,  # Embedding not returned in search results
                    page_number=0,  # Default if not available
                    chunk_type="content",
                    metadata={"user_id": chunk_data.get("user_id", "")},
                    created_at=chunk_data.get("created_at", ""),
                    updated_at=chunk_data.get("updated_at", ""),
                    section_type="general",
                    importance_score=chunk_data.get("similarity", 0.0)
                )
                resume_chunks.append(chunk)
            except Exception as e:
                print(f"Error converting chunk to model: {e}")
        
        # Print results
        print(f"Found {len(resume_chunks)} matching resumes:")
        for i, chunk in enumerate(resume_chunks):
            print(f"{i+1}. Resume ID: {chunk.resume_id} (similarity: {chunk.importance_score:.4f})")
            print(f"   Content preview: {chunk.content[:50]}...")
        
    except Exception as e:
        print(f"Error testing match_resume_content: {str(e)}")

def test_match_resume_chunks() -> None:
    """Test the match_resume_chunks function."""
    print("\n=== Testing match_resume_chunks function ===")
    
    try:
        # Generate a random query embedding
        query_embedding = generate_random_embedding()
        
        # Call the match_resume_chunks function
        result = supabase.rpc(
            "match_resume_chunks", 
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": 5,
                "user_id_param": None  # Test without user filter first
            }
        ).execute()
        
        # Print results
        print(f"Found {len(result.data)} matching resume chunks:")
        for i, chunk in enumerate(result.data):
            print(f"{i+1}. Resume ID: {chunk['resume_id']} (similarity: {chunk['similarity']:.4f})")
            print(f"   Chunk preview: {chunk['chunk_text'][:50]}...")
        
    except Exception as e:
        print(f"Error testing match_resume_chunks: {str(e)}")

def test_search_conversation_messages() -> None:
    """Test the search_conversation_messages function using our ConversationMessage model."""
    print("\n=== Testing search_conversation_messages function ===")
    
    try:
        # Generate a random query embedding
        query_embedding = generate_random_embedding()
        
        # Call the search_conversation_messages function
        result = supabase.rpc(
            "search_conversation_messages", 
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": 5,
                "user_id_param": None  # Test without user filter first
            }
        ).execute()
        
        # Convert results to ConversationMessage models
        conversation_messages = []
        for msg_data in result.data:
            try:
                # Create a ConversationMessage model from the data
                msg = ConversationMessage(
                    id=msg_data.get("id", str(uuid4())),
                    conversation_id=msg_data.get("conversation_id", ""),
                    role=msg_data.get("role", "assistant"),
                    content=msg_data.get("content", ""),
                    content_type="text",
                    metadata={"similarity": msg_data.get("similarity", 0.0)},
                    processed=True,
                    error_message=None,
                    embedding=None,  # Embedding not returned in search results
                    created_at=msg_data.get("created_at", ""),
                    updated_at=msg_data.get("updated_at", ""),
                    specialist_type=None
                )
                conversation_messages.append(msg)
            except Exception as e:
                print(f"Error converting message to model: {e}")
        
        # Print results
        print(f"Found {len(conversation_messages)} matching conversation messages:")
        for i, msg in enumerate(conversation_messages):
            print(f"{i+1}. Conversation ID: {msg.conversation_id} (similarity: {msg.metadata.get('similarity', 0.0):.4f})")
            print(f"   Role: {msg.role}")
            print(f"   Content: {msg.content}")
        
    except Exception as e:
        print(f"Error testing search_conversation_messages: {str(e)}")

def test_search_training_messages() -> None:
    """Test the search_training_messages function."""
    print("\n=== Testing search_training_messages function ===")
    
    try:
        # Generate a random query embedding
        query_embedding = generate_random_embedding()
        
        # Call the search_training_messages function
        result = supabase.rpc(
            "search_training_messages", 
            {
                "query_embedding": query_embedding,
                "match_threshold": 0.5,
                "match_count": 5
            }
        ).execute()
        
        # Print results
        print(f"Found {len(result.data)} matching training messages:")
        for i, msg in enumerate(result.data):
            print(f"{i+1}. ID: {msg['id']} (similarity: {msg['similarity']:.4f})")
            print(f"   Role: {msg['role']}")
            print(f"   Content: {msg['content']}")
        
    except Exception as e:
        print(f"Error testing search_training_messages: {str(e)}")

def main() -> None:
    """Run all vector search tests using our standardized Pydantic models."""
    print("Starting vector search tests with Pydantic models...")
    print("Using standardized models from pydantic_agent package:")
    print(f"  - DocumentRow, DocumentMetadata")
    print(f"  - Resume, ResumeChunk")
    print(f"  - ConversationMessage, Message")
    print("")
    
    # Run tests for each vector search function
    test_match_documents()
    test_match_knowledge_resources()
    test_match_resume_content()
    test_match_resume_chunks()
    test_search_conversation_messages()
    test_search_training_messages()
    
    print("\nVector search tests completed with standardized Pydantic models!")

if __name__ == "__main__":
    main() 
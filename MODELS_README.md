# Pydantic Models for Climate Economy Assistant

This document provides guidance on using the Pydantic models for the Climate Economy Assistant (CEA) project. These models represent the database schema and provide validation for data used throughout the application.

## Overview

The Pydantic models have been successfully integrated with the CEA project and are ready for use. The models are organized into several categories:

- **Authentication Models**: User authentication and session management
- **Profile Models**: User profiles and related data
- **Conversation Models**: Chat conversations and messages
- **Agent Models**: AI agent configuration and capabilities
- **Resume Models**: Resume processing and analysis
- **Subscription Models**: Subscription management
- **RAG Document Models**: Document storage and retrieval
- **Workflow Models**: Workflow management

## Integration Status

✅ **Models Created**: All required models have been created and tested
✅ **Package Structure**: Models are available in a properly structured package
✅ **Tests**: Basic validation tests are passing
✅ **Documentation**: Model usage is documented

## How to Use the Models

### Basic Import

```python
# Import specific models
from pydantic_agent import ConversationMessage, UserProfile, Agent

# Or import all models
from pydantic_agent import *
```

### Creating Model Instances

```python
from pydantic_agent import ConversationMessage, MessageRole
from datetime import datetime
from uuid import uuid4

# Create a new message
message = ConversationMessage(
    id=str(uuid4()),
    conversation_id=str(uuid4()),
    role=MessageRole.USER,
    content="How can I transition to a career in renewable energy?",
    content_type="text",
    metadata={"source": "web_app"},
    processed=True,
    error_message=None,
    embedding=None,
    created_at=datetime.now().isoformat(),
    updated_at=datetime.now().isoformat(),
    specialist_type=None
)
```

### Using with Supabase

```python
from pydantic_agent import UserProfile
from supabase import create_client

# Initialize Supabase client
supabase = create_client(supabase_url, supabase_key)

# Fetch user profile from database
response = supabase.table('user_profiles').select('*').eq('id', user_id).execute()
user_data = response.data[0] if response.data else None

if user_data:
    # Convert to Pydantic model for validation
    user_profile = UserProfile(**user_data)
    print(f"User: {user_profile.full_name}")
```

### Using with Vector Search

```python
from pydantic_agent import DocumentRow
import numpy as np

# Fetch documents with vector search
response = supabase.rpc(
    'match_knowledge_resources',
    {
        'query_embedding': embedding,
        'match_threshold': 0.8,
        'match_count': 5
    }
).execute()

# Convert to Pydantic models
documents = [DocumentRow(**doc) for doc in response.data]
```

### JSON Serialization

When working with UUID fields, you'll need a custom JSON encoder:

```python
import json
from uuid import UUID

class UUIDEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, UUID):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

# Use the encoder when dumping to JSON
with open("data.json", "w") as f:
    json.dump(data, f, indent=2, cls=UUIDEncoder)
```

## Key Models Reference

### Authentication

- `AuthUser`: Represents a user in the authentication system
- `Session`: Represents an authenticated session

### Conversations

- `Conversation`: Represents a conversation thread
- `ConversationMessage`: Represents a message in a conversation
- `Message`: Represents a basic message

### Profiles

- `UserProfile`: Basic user profile information
- `ConsolidatedProfile`: Comprehensive user profile with all fields
- `AdminProfile`: Profile for administrative users

### Documents

- `DocumentMetadata`: Metadata for a document
- `DocumentRow`: A row of document content
- `Source`: Information about a content source
- `CrawledPage`: A crawled web page

### Agents

- `Agent`: Configuration for an AI agent

## Testing

To run the model tests:

```bash
# Run basic model tests
python -m pydantic_agent.test_models

# Run integration tests
python test_pydantic_models.py
```

## Notes on Model Fields

- `id` fields are typically strings (UUID format) except for certain tables like `DocumentRow` where they are integers
- Datetime fields should be passed as ISO format strings
- Enum fields should use the appropriate Enum class (e.g., `MessageRole.USER`)
- Vector embeddings are represented as `Optional[Any]` and can be None for testing

## Common Issues

- **UUID Serialization**: Use the provided UUIDEncoder for JSON serialization
- **Field Type Mismatch**: Check the model definition for the correct field type
- **Missing Required Fields**: Ensure all required fields are provided
- **Enum Values**: Use the appropriate Enum class for enum fields

## Next Steps

1. Integrate models with the backend API endpoints
2. Add validation to incoming requests
3. Use models for database operations
4. Add comprehensive tests for edge cases

## Related Documentation

- [Pydantic Documentation](https://docs.pydantic.dev/)
- [Supabase Documentation](https://supabase.io/docs)
- [Climate Economy Assistant Documentation](https://github.com/your-org/climate-economy-assistant) 
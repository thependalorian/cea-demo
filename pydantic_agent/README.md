# Pydantic Agent Models

This package provides comprehensive Pydantic models for the Climate Economy Assistant application. These models represent the database schema and provide validation for data used throughout the application.

## Overview

The models in this package are organized into several categories:

- **Authentication Models**: User authentication and session management
- **Profile Models**: User profiles and related data
- **Conversation Models**: Chat conversations and messages
- **Agent Models**: AI agent configuration and capabilities
- **Resume Models**: Resume processing and analysis
- **Subscription Models**: Subscription management
- **RAG Document Models**: Document storage and retrieval
- **Workflow Models**: Workflow management

## Usage

### Basic Import

```python
from pydantic_agent import ConversationMessage, UserProfile, Agent
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

## Model Validation

All models include Pydantic validation to ensure data integrity:

```python
from pydantic_agent import ConversationMessage
from pydantic import ValidationError

try:
    # This will fail validation
    message = ConversationMessage(
        id="123",
        # Missing required fields
    )
except ValidationError as e:
    print(f"Validation error: {e}")
```

## Testing

To run the test suite:

```bash
python -m pydantic_agent.test_models
```

## Integration with Pydantic CEA

This package is designed to integrate with the Pydantic CEA project. The models are used throughout the backend services to ensure data consistency and validation.

## License

MIT License 
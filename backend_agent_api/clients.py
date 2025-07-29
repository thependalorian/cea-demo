"""
Client implementations for backend API services.
"""

import os
from typing import Dict, Any, Optional, Tuple, List, AsyncGenerator
import httpx
import logging
from supabase import create_client, Client

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def get_agent_clients(custom_api_key=None) -> Tuple[Any, Any, Any]:
    """
    Get agent clients (supabase, embedding_client, http_client).
    
    Args:
        custom_api_key: Custom OpenAI API key provided by the user (for demo mode)
    
    Returns:
        A tuple of (supabase_client, embedding_client, http_client)
    """
    # Initialize Supabase client
    supabase_url = os.getenv("SUPABASE_URL", "https://zugdojmdktxalqflxbbh.supabase.co")
    supabase_key = os.getenv("SUPABASE_SERVICE_KEY", "")
    
    try:
        supabase = create_client(supabase_url, supabase_key)
        logger.info("Created Supabase client")
    except Exception as e:
        logger.error(f"Failed to create Supabase client: {e}")
        supabase = {"type": "supabase_client_error", "error": str(e)}
    
    # Create embedding client based on configuration
    # If custom_api_key is provided, we'll use that, otherwise env variable
    embedding_client = None
    embedding_dimensions = 1536  # Default for OpenAI text-embedding-3-small
    
    # Get API key - either from custom_api_key parameter or environment
    api_key = custom_api_key or os.getenv("OPENAI_API_KEY") or os.getenv("EMBEDDING_API_KEY")
    if not api_key or api_key == "YOUR_OPENAI_API_KEY_HERE":
        logger.warning("No valid OpenAI API key found")
        embedding_client = None
    else:
        # Create OpenAI client for embeddings
        try:
            from openai import AsyncOpenAI
            embedding_base_url = os.getenv("EMBEDDING_BASE_URL", "https://api.openai.com/v1")
            embedding_model = os.getenv("EMBEDDING_MODEL_CHOICE", "text-embedding-3-small")
            
            embedding_client = AsyncOpenAI(
                api_key=api_key,
                base_url=embedding_base_url
            )
            logger.info(f"Created OpenAI embedding client with model {embedding_model} ({embedding_dimensions} dimensions)")
        except ImportError:
            logger.error("OpenAI package not installed")
            embedding_client = None
        except Exception as e:
            logger.error(f"Failed to create OpenAI client: {e}")
            embedding_client = None
    
    # Create HTTP client for general requests
    http_client = httpx.AsyncClient()
    
    # Add dimension information to context so it can be used for proper handling
    context = {
        "embedding_dimensions": embedding_dimensions
    }
    
    return supabase, embedding_client, http_client


async def get_mem0_client_async() -> Any:
    """
    Get Memory client for async operations.
    
    Returns:
        A memory client instance
    """
    # Use a simple in-memory store for the demo
    class SimpleMemory:
        def __init__(self):
            self.store = {}
            
        async def store(self, data: Any, key: Optional[str] = None, *args, **kwargs) -> str:
            """Store data in memory"""
            if key is None:
                import uuid
                key = f"mem_{uuid.uuid4().hex}"
            
            self.store[key] = data
            return key
            
        async def recall(self, query: str, *args, **kwargs) -> List[Dict[str, Any]]:
            """Recall data based on query"""
            # This is a simple implementation that returns all stored data
            # In a real implementation, you'd do semantic search
            return [{"key": k, "data": v} for k, v in self.store.items()]
    
    return SimpleMemory() 
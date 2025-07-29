
"""
Test script to verify environment variables are loaded correctly.
"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Check Supabase configuration
print("=== Supabase Configuration ===")
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_KEY") or os.environ.get("SUPABASE_SERVICE_KEY")

print(f"SUPABASE_URL: {'Set' if supabase_url else 'Not set'}")
print(f"SUPABASE_KEY: {'Set' if supabase_key else 'Not set'}")

if not supabase_url or not supabase_key:
    print("\nMissing Supabase configuration. Setting from .env values...")
    
    # Try to set from .env values
    if not supabase_url and os.environ.get("SUPABASE_URL"):
        supabase_url = os.environ.get("SUPABASE_URL")
        print(f"Set SUPABASE_URL from .env")
        
    if not supabase_key:
        if os.environ.get("SUPABASE_SERVICE_KEY"):
            supabase_key = os.environ.get("SUPABASE_SERVICE_KEY")
            print(f"Set SUPABASE_KEY from SUPABASE_SERVICE_KEY in .env")
        elif os.environ.get("SUPABASE_KEY"):
            supabase_key = os.environ.get("SUPABASE_KEY")
            print(f"Set SUPABASE_KEY from SUPABASE_KEY in .env")
    
    # Update environment variables
    if supabase_url:
        os.environ["SUPABASE_URL"] = supabase_url
    if supabase_key:
        os.environ["SUPABASE_KEY"] = supabase_key
    
    print("\nUpdated Supabase configuration:")
    print(f"SUPABASE_URL: {'Set' if os.environ.get('SUPABASE_URL') else 'Not set'}")
    print(f"SUPABASE_KEY: {'Set' if os.environ.get('SUPABASE_KEY') else 'Not set'}")

print("\n=== LLM Configuration ===")
print(f"LLM_PROVIDER: {os.environ.get('LLM_PROVIDER', 'Not set')}")
print(f"LLM_BASE_URL: {os.environ.get('LLM_BASE_URL', 'Not set')}")
print(f"LLM_CHOICE: {os.environ.get('LLM_CHOICE', 'Not set')}")

print("\n=== Embedding Configuration ===")
print(f"EMBEDDING_PROVIDER: {os.environ.get('EMBEDDING_PROVIDER', 'Not set')}")
print(f"EMBEDDING_BASE_URL: {os.environ.get('EMBEDDING_BASE_URL', 'Not set')}")
print(f"EMBEDDING_MODEL_CHOICE: {os.environ.get('EMBEDDING_MODEL_CHOICE', 'Not set')}")

print("\n=== Database Configuration ===")
print(f"DATABASE_URL: {'Set' if os.environ.get('DATABASE_URL') else 'Not set'}")

print("\nEnvironment check complete!")
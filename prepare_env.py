#!/usr/bin/env python3
"""
prepare_env.py

This script helps prepare the .env file for deployment by combining templates
and extracting credentials from existing files.

Usage:
    python prepare_env.py

The script will create:
1. .env.deploy - Combined configuration from blueprint templates
2. .env.credentials - File with extracted credentials
"""

import os
from pathlib import Path

def extract_credentials():
    """Extract credentials from existing .env files"""
    credentials = {}
    
    # Extract from backend_agent_api/.env
    backend_env_file = Path("./backend_agent_api/.env")
    if backend_env_file.exists():
        print(f"Extracting credentials from {backend_env_file}")
        with open(backend_env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    credentials[key.strip()] = value.strip()
    
    # Extract from main .env file
    main_env_file = Path("./.env")
    if main_env_file.exists():
        print(f"Extracting credentials from {main_env_file}")
        with open(main_env_file, 'r') as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    # Only override if not already set
                    if key.strip() not in credentials:
                        credentials[key.strip()] = value.strip()
    
    return credentials

def create_credentials_file(credentials):
    """Create a .env.credentials file with extracted credentials"""
    with open('.env.credentials', 'w') as f:
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# PENDO CLIMATE ECONOMY ASSISTANT - EXTRACTED CREDENTIALS\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# Copy these values to your .env.deploy file\n\n")
        
        # LLM Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# LLM CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"LLM_PROVIDER={credentials.get('LLM_PROVIDER', 'openai')}\n")
        f.write(f"LLM_BASE_URL={credentials.get('LLM_BASE_URL', 'https://api.openai.com/v1')}\n")
        f.write(f"LLM_API_KEY={credentials.get('LLM_API_KEY', 'YOUR_OPENAI_API_KEY_HERE')}\n")
        f.write(f"LLM_CHOICE={credentials.get('LLM_CHOICE', 'gpt-4o-mini')}\n")
        f.write(f"VISION_LLM_CHOICE={credentials.get('VISION_LLM_CHOICE', 'gpt-4o-mini')}\n\n")
        
        # Embedding Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# EMBEDDING CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"EMBEDDING_PROVIDER={credentials.get('EMBEDDING_PROVIDER', 'openai')}\n")
        f.write(f"EMBEDDING_BASE_URL={credentials.get('EMBEDDING_BASE_URL', 'https://api.openai.com/v1')}\n")
        f.write(f"EMBEDDING_API_KEY={credentials.get('EMBEDDING_API_KEY', 'YOUR_OPENAI_API_KEY_HERE')}\n")
        f.write(f"EMBEDDING_MODEL_CHOICE={credentials.get('EMBEDDING_MODEL_CHOICE', 'text-embedding-3-small')}\n\n")
        
        # Supabase Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# SUPABASE CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"SUPABASE_URL={credentials.get('SUPABASE_URL', 'https://zugdojmdktxalqflxbbh.supabase.co')}\n")
        f.write(f"SUPABASE_SERVICE_KEY={credentials.get('SUPABASE_SERVICE_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2Rvam1ka3R4YWxxZmx4YmJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MzU4NSwiZXhwIjoyMDY0MTY5NTg1fQ.-tp3_RUU1FF1TEw2wAGwr3phBSCiElPGQqAiorZJHFc')}\n")
        f.write(f"DATABASE_URL={credentials.get('DATABASE_URL', 'postgresql://postgres.zugdojmdktxalqflxbbh:CuKaXvAALZAbrrMe@aws-0-us-east-1.pooler.supabase.com:6543/postgres')}\n")
        f.write(f"NEXT_PUBLIC_SUPABASE_URL={credentials.get('NEXT_PUBLIC_SUPABASE_URL', credentials.get('SUPABASE_URL', 'https://zugdojmdktxalqflxbbh.supabase.co'))}\n")
        # You might want to retrieve the anon key from somewhere else
        f.write(f"NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2Rvam1ka3R4YWxxZmx4YmJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1OTM1ODUsImV4cCI6MjA2NDE2OTU4NX0.ItgGe5R8VyjdgIxaWHmSO_QhOF5iM3nQUzmBm9h9w0s'\n\n")
        
        # Web Search Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# WEB SEARCH CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"BRAVE_API_KEY={credentials.get('BRAVE_API_KEY', 'BSADjzsSJZvOHbMs9jeeETw4XRn7j5d')}\n")
        f.write(f"SEARXNG_BASE_URL={credentials.get('SEARXNG_BASE_URL', '')}\n\n")
        
        # Deployment Domain Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# DEPLOYMENT DOMAIN CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"FRONTEND_HOSTNAME={credentials.get('FRONTEND_HOSTNAME', 'cea.georgenekwaya.com')}\n")
        f.write(f"AGENT_API_HOSTNAME={credentials.get('AGENT_API_HOSTNAME', 'agent-api.georgenekwaya.com')}\n")
        f.write(f"RAG_API_HOSTNAME={credentials.get('RAG_API_HOSTNAME', 'rag-api.georgenekwaya.com')}\n")
        f.write(f"LETSENCRYPT_EMAIL={credentials.get('LETSENCRYPT_EMAIL', 'george@buffr.ai')}\n\n")
        
        # Frontend URLs
        f.write("# For frontend\n")
        f.write(f"NEXT_PUBLIC_APP_URL=https://{credentials.get('FRONTEND_HOSTNAME', 'cea.georgenekwaya.com')}\n")
        f.write(f"NEXT_PUBLIC_AGENT_ENDPOINT=https://{credentials.get('AGENT_API_HOSTNAME', 'agent-api.georgenekwaya.com')}/api/pendo-agent\n")
        f.write(f"NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT=https://{credentials.get('RAG_API_HOSTNAME', 'rag-api.georgenekwaya.com')}\n\n")
        
        # Docker Communication
        f.write("# For Docker communication\n")
        f.write("BACKEND_API_URL=http://rag-pipeline-api:8000\n")
        f.write("BACKEND_AGENT_API_URL=http://agent-api:8001\n")
    
    print(f"Created .env.credentials file")

def main():
    """Main function"""
    # Combine blueprint templates
    print("Creating combined .env.deploy file from templates...")
    os.system("cat ./blueprints/agent-api-env.env.example ./blueprints/rag-pipeline-env.env.example ./blueprints/frontend-env.env.example > .env.deploy")
    
    # Extract and create credentials file
    print("Extracting credentials...")
    credentials = extract_credentials()
    create_credentials_file(credentials)
    
    print("\nDone! Created two files:")
    print("  1. .env.deploy - Combined configuration from blueprint templates")
    print("  2. .env.credentials - File with extracted credentials")
    print("\nNext steps:")
    print("  1. Review the .env.credentials file and update any missing values")
    print("  2. Update domain names in .env.credentials if needed")
    print("  3. Create your final .env file by running:")
    print("     cat .env.credentials > .env.final")
    print("     cat .env.deploy >> .env.final")
    print("     mv .env.final .env")

if __name__ == "__main__":
    main() 
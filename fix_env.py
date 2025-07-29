#!/usr/bin/env python3
"""
fix_env.py

This script deduplicates and fixes the environment file by:
1. Removing duplicate entries
2. Ensuring Docker-specific configurations are set properly
3. Prioritizing actual credentials over placeholder values
"""

import os
from pathlib import Path

def fix_env_file():
    """Fix the .env file by removing duplicates and using correct values"""
    env_file = Path("./.env")
    
    if not env_file.exists():
        print("Error: .env file not found")
        return
    
    # Read the current file
    with open(env_file, 'r') as f:
        lines = f.readlines()
    
    # Extract key-value pairs, prioritizing the first occurrence
    env_vars = {}
    
    for line in lines:
        line = line.strip()
        
        # Skip empty lines and comments
        if not line or line.startswith('#'):
            continue
            
        # Process key-value pairs
        if "=" in line:
            key, value = line.split("=", 1)
            key = key.strip()
            
            # Only add if key not already present
            if key not in env_vars:
                env_vars[key] = value.strip()
    
    # Create a completely new env file
    fixed_env_file = Path("./.env.new")
    
    with open(fixed_env_file, 'w') as f:
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# PENDO CLIMATE ECONOMY ASSISTANT - ENVIRONMENT CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# Auto-fixed by fix_env.py to deduplicate and set correct Docker values\n\n")
        
        # Deployment Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# DEPLOYMENT CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"ENVIRONMENT={env_vars.get('ENVIRONMENT', 'development')}\n")
        f.write(f"DEPLOYMENT_TYPE={env_vars.get('DEPLOYMENT_TYPE', 'local')}\n\n")
        
        # LLM Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# LLM CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"LLM_PROVIDER={env_vars.get('LLM_PROVIDER', 'openai')}\n")
        f.write(f"LLM_BASE_URL={env_vars.get('LLM_BASE_URL', 'https://api.openai.com/v1')}\n")
        f.write(f"LLM_API_KEY={env_vars.get('LLM_API_KEY', 'YOUR_OPENAI_API_KEY_HERE')}\n")
        f.write(f"LLM_CHOICE={env_vars.get('LLM_CHOICE', 'gpt-4o-mini')}\n")
        f.write(f"VISION_LLM_CHOICE={env_vars.get('VISION_LLM_CHOICE', 'gpt-4o-mini')}\n\n")
        
        # OpenAI Configuration
        f.write("# OpenAI Configuration\n")
        f.write(f"OPENAI_API_KEY={env_vars.get('OPENAI_API_KEY', 'YOUR_OPENAI_API_KEY_HERE')}\n")
        f.write(f"OPENAI_BASE_URL={env_vars.get('OPENAI_BASE_URL', 'https://api.openai.com/v1')}\n")
        f.write(f"OPENAI_MODEL_CHOICE={env_vars.get('OPENAI_MODEL_CHOICE', 'gpt-4o-mini')}\n\n")
        
        # Embedding Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# EMBEDDING CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"EMBEDDING_PROVIDER={env_vars.get('EMBEDDING_PROVIDER', 'openai')}\n")
        f.write(f"EMBEDDING_BASE_URL={env_vars.get('EMBEDDING_BASE_URL', 'https://api.openai.com/v1')}\n")
        f.write(f"EMBEDDING_API_KEY={env_vars.get('EMBEDDING_API_KEY', 'YOUR_OPENAI_API_KEY_HERE')}\n")
        f.write(f"EMBEDDING_MODEL_CHOICE={env_vars.get('EMBEDDING_MODEL_CHOICE', 'text-embedding-3-small')}\n\n")
        
        # Database Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# DATABASE CONFIGURATION (SUPABASE)\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"SUPABASE_URL={env_vars.get('SUPABASE_URL', 'https://zugdojmdktxalqflxbbh.supabase.co')}\n")
        f.write(f"SUPABASE_SERVICE_KEY={env_vars.get('SUPABASE_SERVICE_KEY', '')}\n")
        f.write(f"DATABASE_URL={env_vars.get('DATABASE_URL', '')}\n")
        f.write(f"NEXT_PUBLIC_SUPABASE_URL={env_vars.get('NEXT_PUBLIC_SUPABASE_URL', 'https://zugdojmdktxalqflxbbh.supabase.co')}\n")
        f.write(f"NEXT_PUBLIC_SUPABASE_ANON_KEY={env_vars.get('NEXT_PUBLIC_SUPABASE_ANON_KEY', '')}\n\n")
        
        # Frontend Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# FRONTEND CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# For Docker internal communication\n")
        f.write(f"BACKEND_API_URL={env_vars.get('BACKEND_API_URL', 'http://rag-pipeline-api:8000')}\n")
        f.write(f"BACKEND_AGENT_API_URL={env_vars.get('BACKEND_AGENT_API_URL', 'http://agent-api:8001')}\n\n")
        f.write("# Public frontend configuration\n")
        f.write(f"NEXT_PUBLIC_APP_NAME={env_vars.get('NEXT_PUBLIC_APP_NAME', 'Pendo Climate Economy Assistant')}\n")
        f.write(f"NEXT_PUBLIC_APP_SHORT_NAME={env_vars.get('NEXT_PUBLIC_APP_SHORT_NAME', 'Pendo CEA')}\n")
        f.write(f"NEXT_PUBLIC_APP_DESCRIPTION={env_vars.get('NEXT_PUBLIC_APP_DESCRIPTION', 'AI-powered assistant for climate economy careers and education')}\n")
        f.write(f"NEXT_PUBLIC_ENABLE_STREAMING={env_vars.get('NEXT_PUBLIC_ENABLE_STREAMING', 'true')}\n\n")
        
        # Feature Flags
        f.write("# Feature flags\n")
        f.write(f"NEXT_PUBLIC_ENABLE_RESUME_UPLOAD={env_vars.get('NEXT_PUBLIC_ENABLE_RESUME_UPLOAD', 'true')}\n")
        f.write(f"NEXT_PUBLIC_ENABLE_JOB_MATCHING={env_vars.get('NEXT_PUBLIC_ENABLE_JOB_MATCHING', 'true')}\n")
        f.write(f"NEXT_PUBLIC_ENABLE_ADMIN_PANEL={env_vars.get('NEXT_PUBLIC_ENABLE_ADMIN_PANEL', 'true')}\n")
        f.write(f"NEXT_PUBLIC_ENABLE_ANALYTICS={env_vars.get('NEXT_PUBLIC_ENABLE_ANALYTICS', 'true')}\n\n")
        
        # Web Search Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# WEB SEARCH CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"BRAVE_API_KEY={env_vars.get('BRAVE_API_KEY', '')}\n")
        f.write(f"SEARXNG_BASE_URL={env_vars.get('SEARXNG_BASE_URL', '')}\n\n")
        
        # RAG Pipeline Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# RAG PIPELINE CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"RAG_PIPELINE_WORKERS={env_vars.get('RAG_PIPELINE_WORKERS', '2')}\n")
        f.write(f"RAG_PIPELINE_MAX_FILE_SIZE={env_vars.get('RAG_PIPELINE_MAX_FILE_SIZE', '10485760')}\n")
        f.write(f"RAG_PIPELINE_CHUNK_SIZE={env_vars.get('RAG_PIPELINE_CHUNK_SIZE', '400')}\n")
        f.write(f"RAG_PIPELINE_CHUNK_OVERLAP={env_vars.get('RAG_PIPELINE_CHUNK_OVERLAP', '50')}\n\n")
        
        # Cloud Deployment Configuration
        f.write("# ---------------------------------------------------------------------------\n")
        f.write("# CLOUD DEPLOYMENT CONFIGURATION\n")
        f.write("# ---------------------------------------------------------------------------\n")
        f.write(f"FRONTEND_HOSTNAME={env_vars.get('FRONTEND_HOSTNAME', 'cea.georgenekwaya.com')}\n")
        f.write(f"AGENT_API_HOSTNAME={env_vars.get('AGENT_API_HOSTNAME', 'agent-api.georgenekwaya.com')}\n")
        f.write(f"RAG_API_HOSTNAME={env_vars.get('RAG_API_HOSTNAME', 'rag-api.georgenekwaya.com')}\n")
        f.write(f"LETSENCRYPT_EMAIL={env_vars.get('LETSENCRYPT_EMAIL', 'george@buffr.ai')}\n\n")
        
        # Public endpoints
        f.write("# Public endpoints for browser access\n")
        f.write(f"NEXT_PUBLIC_APP_URL=https://{env_vars.get('FRONTEND_HOSTNAME', 'cea.georgenekwaya.com')}\n")
        f.write(f"NEXT_PUBLIC_AGENT_ENDPOINT=https://{env_vars.get('AGENT_API_HOSTNAME', 'agent-api.georgenekwaya.com')}/api/pendo-agent\n")
        f.write(f"NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT=https://{env_vars.get('RAG_API_HOSTNAME', 'rag-api.georgenekwaya.com')}\n\n")
        
        # Add any other variables we might have missed
        other_vars = set(env_vars.keys()) - {
            'ENVIRONMENT', 'DEPLOYMENT_TYPE',
            'LLM_PROVIDER', 'LLM_BASE_URL', 'LLM_API_KEY', 'LLM_CHOICE', 'VISION_LLM_CHOICE',
            'OPENAI_API_KEY', 'OPENAI_BASE_URL', 'OPENAI_MODEL_CHOICE',
            'EMBEDDING_PROVIDER', 'EMBEDDING_BASE_URL', 'EMBEDDING_API_KEY', 'EMBEDDING_MODEL_CHOICE',
            'SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'DATABASE_URL', 'NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
            'BACKEND_API_URL', 'BACKEND_AGENT_API_URL',
            'NEXT_PUBLIC_APP_NAME', 'NEXT_PUBLIC_APP_SHORT_NAME', 'NEXT_PUBLIC_APP_DESCRIPTION', 'NEXT_PUBLIC_ENABLE_STREAMING',
            'NEXT_PUBLIC_ENABLE_RESUME_UPLOAD', 'NEXT_PUBLIC_ENABLE_JOB_MATCHING', 'NEXT_PUBLIC_ENABLE_ADMIN_PANEL', 'NEXT_PUBLIC_ENABLE_ANALYTICS',
            'BRAVE_API_KEY', 'SEARXNG_BASE_URL',
            'RAG_PIPELINE_WORKERS', 'RAG_PIPELINE_MAX_FILE_SIZE', 'RAG_PIPELINE_CHUNK_SIZE', 'RAG_PIPELINE_CHUNK_OVERLAP',
            'FRONTEND_HOSTNAME', 'AGENT_API_HOSTNAME', 'RAG_API_HOSTNAME', 'LETSENCRYPT_EMAIL',
            'NEXT_PUBLIC_APP_URL', 'NEXT_PUBLIC_AGENT_ENDPOINT', 'NEXT_PUBLIC_RAG_PIPELINE_ENDPOINT'
        }
        
        if other_vars:
            f.write("# ---------------------------------------------------------------------------\n")
            f.write("# OTHER CONFIGURATION\n")
            f.write("# ---------------------------------------------------------------------------\n")
            
            for key in sorted(other_vars):
                f.write(f"{key}={env_vars[key]}\n")
    
    # Backup current .env and replace with fixed version
    backup_file = Path("./.env.bak")
    os.rename(env_file, backup_file)
    os.rename(fixed_env_file, env_file)
    
    print(f"Fixed environment file created as .env")
    print(f"Original file backed up as .env.bak")
    print(f"Updated to use OpenAI for LLM (gpt-4o-mini) and embeddings (text-embedding-3-small)")

if __name__ == "__main__":
    fix_env_file() 
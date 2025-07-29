# Environment Setup Guide

This document provides instructions for setting up virtual environments and installing dependencies for the Pydantic Climate Employment Agent (PCEA).

## Prerequisites

- Python 3.11+
- pip (latest version recommended)
- Git

## Virtual Environment Setup

The project uses two separate virtual environments:
1. `rag_venv`: For the RAG pipeline components
2. `agent_venv`: For the agent API components

### RAG Pipeline Virtual Environment

```bash
# Create the RAG pipeline virtual environment
python -m venv rag_venv

# Activate the virtual environment
# On macOS/Linux with bash/zsh
source rag_venv/bin/activate
# On macOS with fish shell
source rag_venv/bin/activate.fish
# On Windows
rag_venv\Scripts\activate

# Install required packages
pip install -r rag_pipeline/requirements.txt

# Install pydantic_agent package in development mode
cd pydantic_agent
pip install -e .
cd ..

# Install langfuse for observability
pip install langfuse
```

### Agent API Virtual Environment

```bash
# Create the Agent API virtual environment
python -m venv agent_venv

# Activate the virtual environment
# On macOS/Linux with bash/zsh
source agent_venv/bin/activate
# On macOS with fish shell
source agent_venv/bin/activate.fish
# On Windows
agent_venv\Scripts\activate

# Install required packages
pip install -r backend_agent_api/requirements.txt

# Install pydantic_agent package in development mode
cd pydantic_agent
pip install -e .
cd ..

# Install langfuse for observability
pip install langfuse
```

## Running Services

### Running the RAG Pipeline API

```bash
# Activate the RAG virtual environment
source rag_venv/bin/activate.fish  # Or appropriate activation command for your shell

# Set required environment variables
export SUPABASE_KEY="$(grep SUPABASE_SERVICE_KEY .env | head -1 | cut -d'=' -f2)"
export OPENAI_API_KEY="your_openai_api_key_here"

# Run the RAG pipeline API server
python -m uvicorn rag_pipeline.api:app --port 8002 --reload
```

### Running the Agent API

```bash
# Activate the Agent API virtual environment
source agent_venv/bin/activate.fish  # Or appropriate activation command for your shell

# Set required environment variables
export SUPABASE_KEY="$(grep SUPABASE_SERVICE_KEY .env | head -1 | cut -d'=' -f2)"
export OPENAI_API_KEY="your_openai_api_key_here"

# Run the Agent API server
python -m uvicorn backend_agent_api.agent_api:app --port 8003 --reload
```

## Troubleshooting

### Import Errors

If you encounter errors related to imports, ensure that:
1. You're using the correct virtual environment for each component
2. The Python package is installed in development mode (`pip install -e .`)
3. All required dependencies are installed
4. The directory structure contains `__init__.py` files to make directories proper Python packages

### Environment Variables

If you encounter errors related to missing environment variables:
1. Ensure your `.env` file exists and contains all required variables
2. Check that environment variables are properly exported before running services
3. Verify that variable names match exactly what the code expects (e.g., `SUPABASE_KEY` vs `SUPABASE_SERVICE_KEY`)

### Address Already in Use

If you get an error like `[Errno 48] error while attempting to bind on address: address already in use`:
1. Choose a different port (e.g., 8002, 8003, 8004)
2. Check for and terminate any existing processes using the same port:
   ```bash
   ps aux | grep uvicorn  # Find the process
   kill <process_id>      # Terminate the process
   ``` 
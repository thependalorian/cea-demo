#!/bin/bash

# Script to run both services for PCEA
echo "Starting services for Pydantic Climate Employment Agent (PCEA)"

# Check for .env file
if [ ! -f .env ]; then
  echo "Error: .env file not found. Please create it first."
  echo "You can copy env.example to .env and edit it with your credentials."
  exit 1
fi

# Extract environment variables
SUPABASE_KEY=$(grep SUPABASE_SERVICE_KEY .env | head -1 | cut -d'=' -f2)
OPENAI_API_KEY=$(grep OPENAI_API_KEY .env | head -1 | cut -d'=' -f2)

if [ -z "$SUPABASE_KEY" ]; then
  echo "Warning: SUPABASE_SERVICE_KEY not found in .env file."
  echo "You will need to set this manually."
fi

if [ -z "$OPENAI_API_KEY" ]; then
  echo "Warning: OPENAI_API_KEY not found in .env file."
  echo "You will need to set this manually."
fi

# Print instructions
echo ""
echo "To run the RAG Pipeline API:"
echo "--------------------------"
echo "  source rag_venv/bin/activate.fish  # Or appropriate for your shell"
echo "  export SUPABASE_KEY=\"$SUPABASE_KEY\""
echo "  export OPENAI_API_KEY=\"$OPENAI_API_KEY\""
echo "  python -m uvicorn rag_pipeline.api:app --port 8002 --reload"
echo ""
echo "To run the Agent API:"
echo "-------------------"
echo "  source agent_venv/bin/activate.fish  # Or appropriate for your shell"
echo "  export SUPABASE_KEY=\"$SUPABASE_KEY\""
echo "  export OPENAI_API_KEY=\"$OPENAI_API_KEY\""
echo "  python -m uvicorn backend_agent_api.agent_api:app --port 8003 --reload"
echo ""
echo "Run each of these commands in separate terminal windows."
echo "Refer to ENVIRONMENT_SETUP.md for detailed instructions." 
#!/bin/bash

# Script to set up virtual environments for PCEA
echo "Setting up virtual environments for Pydantic Climate Employment Agent (PCEA)"

# Detect shell
SHELL_NAME=$(basename "$SHELL")
if [ "$SHELL_NAME" = "fish" ]; then
  ACTIVATE_CMD="source {}/bin/activate.fish"
else
  ACTIVATE_CMD="source {}/bin/activate"
fi

# Create and set up RAG pipeline environment
echo "Setting up RAG pipeline environment (rag_venv)..."
python3 -m venv rag_venv
eval "$(printf "$ACTIVATE_CMD" "rag_venv")"
pip install --upgrade pip
pip install -r rag_pipeline/requirements.txt
cd pydantic_agent
pip install -e .
cd ..
pip install langfuse
echo "RAG pipeline environment setup complete."
echo ""

# Deactivate the current environment
if [ "$SHELL_NAME" = "fish" ]; then
  command -v deactivate >/dev/null && deactivate
else
  deactivate
fi

# Create and set up Agent API environment
echo "Setting up Agent API environment (agent_venv)..."
python3 -m venv agent_venv
eval "$(printf "$ACTIVATE_CMD" "agent_venv")"
pip install --upgrade pip
pip install -r backend_agent_api/requirements.txt
cd pydantic_agent
pip install -e .
cd ..
pip install langfuse
echo "Agent API environment setup complete."
echo ""

# Deactivate the current environment
if [ "$SHELL_NAME" = "fish" ]; then
  command -v deactivate >/dev/null && deactivate
else
  deactivate
fi

echo "Both environments are set up."
echo "To activate the RAG pipeline environment:"
echo "  $(printf "$ACTIVATE_CMD" "rag_venv")"
echo "To activate the Agent API environment:"
echo "  $(printf "$ACTIVATE_CMD" "agent_venv")"
echo ""
echo "Refer to ENVIRONMENT_SETUP.md for detailed instructions on using these environments." 
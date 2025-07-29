# Pendo Climate Economy Assistant - Deployment Guide

This guide provides step-by-step instructions for deploying the Pendo Climate Economy Assistant using Docker Compose. The application consists of three main services:

1. **Agent API** - Enhanced AI assistant using LLMs
2. **RAG Pipeline API** - Document processing and retrieval-augmented generation
3. **Frontend** - Next.js web interface

## Prerequisites

- Docker and Docker Compose installed
- Ollama running locally (or configure for OpenAI)
- Supabase project set up with tables for conversations, messages, etc.

## Deployment Steps

### 1. Prepare Environment

Create a `.env` file based on the example:

```bash
cp env.example .env
```

Edit the `.env` file and update the following:

- **Supabase credentials**:
  ```
  SUPABASE_URL=https://your-project-id.supabase.co
  SUPABASE_SERVICE_KEY=your-service-role-key-here
  DATABASE_URL=postgresql://postgres:PASSWORD@db.your-project-id.supabase.co:5432/postgres
  NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  ```

- **LLM Configuration** (if using OpenAI instead of Ollama):
  ```
  LLM_PROVIDER=openai
  LLM_BASE_URL=https://api.openai.com/v1
  LLM_API_KEY=your-openai-api-key-here
  LLM_CHOICE=gpt-4o-mini
  ```

### 2. Verify Pydantic Models Integration

Ensure the `pydantic_agent` directory is properly integrated:

1. The `pydantic_agent` directory should be in the project root
2. Import paths in backend files are correctly set up
3. Models like `Resume`, `ResumeChunk`, `Message`, etc. are being imported

### 3. Start Local Deployment

For local development and testing:

```bash
python deploy.py --type local --project pendo-cea
```

This will:
- Build Docker images for all services
- Start the containers with local configuration
- Connect to your local Ollama instance

### 4. Cloud Deployment

For cloud deployment with Caddy as reverse proxy:

1. Update cloud-specific environment variables:
   ```
   LETSENCRYPT_EMAIL=your-email@domain.com
   FRONTEND_HOSTNAME=cea.yourdomain.com
   AGENT_API_HOSTNAME=agent-api.yourdomain.com
   RAG_API_HOSTNAME=rag-api.yourdomain.com
   ```

2. Run the cloud deployment command:
   ```bash
   python deploy.py --type cloud
   ```

### 5. Monitoring

To check the status of your deployment:

```bash
# Check status
python deploy.py --status --type local --project pendo-cea

# View logs
python deploy.py --logs --type local --project pendo-cea
```

### 6. Stopping Services

To stop the services:

```bash
python deploy.py --down --type local --project pendo-cea
```

## Troubleshooting

### Import errors with pydantic_agent
If you encounter import errors related to `pydantic_agent`, make sure you've run the setup script:
```bash
python setup_pydantic_agent.py
```

### Database connection issues
If you're having trouble connecting to Supabase, double check your credentials in the `.env` file.

### LLM connection issues
For local deployment, ensure Ollama is running on the host machine before starting the containers.

## Security Features

### Rate Limiting

Both the Agent API and RAG Pipeline API implement rate limiting to prevent abuse and ensure fair usage of system resources. Rate limiting is configured through environment variables:

- `RATE_LIMIT_PER_MINUTE`: Maximum number of requests allowed per minute per client (default: 60)
- `RATE_LIMIT_BURST`: Maximum number of burst requests allowed before rate limiting takes effect (default: 10)

The rate limiter identifies clients by:
1. User ID (for authenticated requests)
2. IP address (for unauthenticated requests)

When a client exceeds their rate limit:
- They receive a 429 Too Many Requests response
- A Retry-After header indicates when they can try again
- Health check endpoints are excluded from rate limiting

You can adjust these limits in the `.env` file based on your specific requirements:

```
# More permissive rate limits
RATE_LIMIT_PER_MINUTE=120
RATE_LIMIT_BURST=20

# More restrictive rate limits
RATE_LIMIT_PER_MINUTE=30
RATE_LIMIT_BURST=5
```

## Next Steps

Once your deployment is up and running, consider:

1. Test all functionalities
2. Configure monitoring and alerting
3. Set up automated backups
4. Plan for scaling if needed 
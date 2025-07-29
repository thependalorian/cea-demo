# Pendo Climate Economy Assistant

A comprehensive RAG (Retrieval Augmented Generation) pipeline for the Climate Economy Assistant, featuring document processing, resume analysis, and knowledge management capabilities.

## Architecture

This application follows a microservices architecture with three main components:

- **Frontend**: Next.js application for user interface
- **Agent API**: Pydantic AI agent for conversational AI (following 6_Agent_Deployment patterns)
- **RAG Pipeline API**: FastAPI service for document processing and embedding generation

## Setup and Deployment

### Quick Start

1. **Set up pydantic_agent models**:
   ```bash
   # Copy the pydantic_agent models from the root directory
   python setup_pydantic_agent.py
   ```

2. **Prepare environment variables**:
   ```bash
   # Copy and edit environment variables
   cp env.example .env
   # Edit .env with your credentials
   ```

3. **Deploy locally**:
   ```bash
   # Deploy with local configuration
   python deploy.py --type local --project pendo-cea
   ```

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed deployment instructions.

### Development Environment Setup

For setting up the development environment with virtual environments and dependencies, see [ENVIRONMENT_SETUP.md](./ENVIRONMENT_SETUP.md).

### Enhanced Agent

We've integrated an enhanced agent with improved capabilities:

- **Improved Model Integration**: Better integration with pydantic_agent models
- **Robust Path Handling**: Enhanced path resolution for imports
- **Resume Processing**: Improved resume analysis capabilities
- **Validation Systems**: Enhanced data validation for agent responses

The enhanced agent uses our standardized pydantic models and implements more robust error handling and path resolution to ensure proper integration between components.

## Features

### RAG Pipeline
- **Document Processing**: PDF extraction, website content scraping
- **Resume Analysis**: Specialized resume processing with skill extraction
- **Embedding Generation**: Vector embeddings using Nomic models
- **Job Matching**: Resume-to-job matching capabilities
- **Async Processing**: Background job queue with status tracking

### Frontend Features
- **Resource Management**: Admin interface for uploading documents
- **Resume Upload**: User interface for resume submission
- **Job Status Monitoring**: Real-time processing status
- **Authentication**: Supabase-based auth with role-based access

### Security
- **Role-Based Access**: Admin, Partner, and User roles
- **Token Validation**: Supabase JWT token authentication
- **File Validation**: Type and size restrictions
- **Rate Limiting**: Built-in request throttling

## API Endpoints

### RAG Pipeline API (Port 8000)

#### Health Check
```
GET /health
```

#### Document Processing
```
POST /process
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <PDF file>,
  "title": "Document Title",
  "description": "Document description",
  "content_type": "article",
  "target_table": "knowledge_resources"
}
```

#### Resume Upload
```
POST /resume/upload
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "file": <PDF resume>
}
```

#### Job Status
```
GET /status/{job_id}
Authorization: Bearer <token>
```

#### List Jobs
```
GET /jobs?status=processing&limit=10&offset=0
Authorization: Bearer <token>
```

### Frontend API Routes

All frontend API routes proxy to the backend with authentication:

- `/api/v1/rag-pipeline/process` - Document processing
- `/api/v1/rag-pipeline/jobs` - Job status
- `/api/v1/rag-pipeline/resume/upload` - Resume upload
- `/api/v1/rag-pipeline/resume/{userId}` - Resume management

## Database Schema

### Tables
- `knowledge_resources` - Knowledge base articles and documents
- `job_listings` - Job postings
- `education_programs` - Educational content
- `user_resumes` - User resume storage
- `resume_skills` - Extracted skills from resumes
- `job_matches` - Resume-to-job matching results

### Processing Jobs
- Async background processing with job status tracking
- Chunk-based text processing for optimal retrieval
- Vector storage for semantic search

## Development

### Backend Development

1. Install dependencies:
```bash
cd rag_pipeline
pip install -r requirements.txt
```

2. Run the API server:
```bash
uvicorn api:app --reload --port 8000
```

### Frontend Development

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Run the development server:
```bash
npm run dev
```

### Running Tests

```bash
# Backend tests
cd rag_pipeline
python -m pytest

# Frontend tests (if implemented)
cd frontend
npm test
```

## Configuration

### Environment Variables

See `env.example` for all available configuration options:

- **Database**: Supabase configuration
- **LLM**: OpenAI or other LLM provider settings
- **Embeddings**: Ollama (local) or OpenAI embeddings
- **RAG Pipeline**: Chunk size, workers, file limits
- **Deployment**: Domain names and SSL configuration

### Docker Configuration

- `docker-compose.yml` - Base services configuration
- `docker-compose.caddy.yml` - Caddy reverse proxy for cloud deployment
- `Caddyfile` - Caddy server configuration with SSL

## Monitoring

### Health Checks

All services include health check endpoints:
- Frontend: `/health`
- RAG Pipeline API: `/health`
- Agent API: `/health` (from 6_Agent_Deployment)

### Logging

Docker Compose includes centralized logging. View logs with:
```bash
python deploy.py --logs --project pendo-cea
```

## Troubleshooting

### Common Issues

1. **Database Connection**: Verify Supabase credentials in `.env`
2. **Embedding Model**: Ensure Ollama is running for local embeddings
3. **File Upload**: Check file size limits and permissions
4. **Network Issues**: Verify Docker network connectivity

### Debug Mode

Enable debug logging by setting:
```bash
export ENVIRONMENT=development
```

## Contributing

1. Follow the established patterns from 6_Agent_Deployment
2. Maintain consistent error handling and response formats
3. Add comprehensive tests for new features
4. Update documentation for any API changes

## Production Considerations

### Performance Tuning
- Adjust `RAG_PIPELINE_WORKERS` based on server capacity
- Configure `RAG_PIPELINE_CHUNK_SIZE` for optimal retrieval
- Monitor memory usage with large document processing

### Security Checklist
- [ ] Update default Supabase keys
- [ ] Configure proper CORS settings
- [ ] Set up rate limiting
- [ ] Review file upload restrictions
- [ ] Enable HTTPS in production

### Scaling
- Multiple RAG pipeline workers can be deployed
- Database connections are pooled
- Frontend can be deployed behind CDN
- Consider Redis for job queue persistence

## Migration from Other Stacks

This implementation follows the established patterns from `6_Agent_Deployment` for consistency:
- Docker Compose structure
- Health check implementations
- Environment variable patterns
- Reverse proxy configuration
- Deployment scripts

## License

MIT License - See LICENSE file for details
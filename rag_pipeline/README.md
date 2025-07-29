 

This module implements a comprehensive RAG (Retrieval-Augmented Generation) pipeline for processing, embedding, and storing various document types into Supabase for the Pendo Climate Economy Assistant.

## Overview

The RAG Pipeline enables partners and admins to contribute data from various sources (PDFs, websites, resumes) which can be semantically searched and retrieved to enhance AI responses. It supports:

- PDF document processing
- Website/URL content extraction
- Resume processing and skill extraction
- Background job queuing and processing
- RESTful API endpoints

## Components

### Core Classes

1. **DocumentProcessor**  
   Base class that provides common functionality for document processing:
   - Text extraction
   - Text chunking
   - Embedding generation
   - Document storage in Supabase

2. **Specialized Processors**
   - **PDFProcessor**: Handles PDF document extraction and processing
   - **WebsiteProcessor**: Handles website URL content extraction
   - **ResumeProcessor**: Specialized processor for resumes with skill extraction

3. **RAGPipelineManager**
   - Orchestrates document processing
   - Manages background jobs
   - Routes documents to appropriate processors

4. **API**
   - RESTful endpoints for document processing
   - Authentication with Supabase
   - Job status tracking

## Storage Tables

The pipeline stores documents and their embeddings in several Supabase tables:

- `document_metadata`: Stores document metadata and full text content
- `documents`: Stores document chunks with vector embeddings
- `knowledge_resources`: Articles, guides, reports
- `job_listings`: Employment opportunities
- `education_programs`: Training programs

## Usage

### API Endpoints

- `POST /process`: Process a document (PDF/website) and store in specified table
- `POST /resume/upload`: Upload and process a resume
- `GET /resume/{user_id}`: Get resume information for a user
- `GET /status/{job_id}`: Get status of a processing job
- `GET /jobs`: List processing jobs with filtering
- `POST /batch`: Process multiple documents in batch

### Example: Processing a PDF

```python
import httpx
import json

# API endpoint
url = "http://localhost:8000/process"

# Prepare form data
files = {"file": ("example.pdf", open("example.pdf", "rb"), "application/pdf")}
data = {
    "title": "Example PDF",
    "description": "An example PDF document",
    "content_type": "guide",
    "target_table": "knowledge_resources"
}

# Send request
headers = {"Authorization": "Bearer YOUR_TOKEN"}
response = httpx.post(url, files=files, data=data, headers=headers)
print(response.json())
```

## Setup

### Dependencies

```bash
pip install -r requirements.txt
```

### Environment Variables

- `SUPABASE_URL`: URL for Supabase instance
- `SUPABASE_SERVICE_KEY`: Service key for Supabase
- `EMBEDDING_BASE_URL`: URL for embedding service (default: http://localhost:11434/v1)
- `EMBEDDING_API_KEY`: API key for embedding service
- `EMBEDDING_MODEL_CHOICE`: Model for embeddings (default: nomic-embed-text)

### Running the API

```bash
uvicorn rag_pipeline.api:app --reload
```

## Extending

To add support for new document types:

1. Create a new processor class that extends `DocumentProcessor`
2. Implement the `extract_text()` method
3. Add specialized storage methods if needed
4. Update the `RAGPipelineManager` to use your new processor
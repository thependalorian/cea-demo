# Use Python 3.11 slim image for smaller size
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    g++ \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user with home directory
RUN groupadd -r ragapi && useradd -r -g ragapi -m -d /home/ragapi ragapi

# Set working directory
WORKDIR /app

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Create temp directory for file processing
RUN mkdir -p /app/temp && \
    chown -R ragapi:ragapi /app && \
    chown -R ragapi:ragapi /home/ragapi

# Switch to non-root user
USER ragapi

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import requests; requests.get('http://localhost:8000/health', timeout=5)"

# Environment variables with defaults
ENV PYTHONUNBUFFERED=1
ENV RAG_PIPELINE_WORKERS=2
ENV RAG_PIPELINE_MAX_FILE_SIZE=10485760

# Run the application
CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8000"] 
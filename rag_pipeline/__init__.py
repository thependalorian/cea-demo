"""
RAG Pipeline for Pendo Climate Economy Assistant
This module handles document processing, embedding generation, and storage
for knowledge resources, job listings, and education programs.
"""
from .document_processor import DocumentProcessor
from .pdf_processor import PDFProcessor
from .website_processor import WebsiteProcessor
from .pipeline_manager import RAGPipelineManager

__version__ = "1.0.0" 
variable "project_id" {
  description = "Google Cloud Project ID"
  type        = string
}

variable "region" {
  description = "Google Cloud Region"
  type        = string
  default     = "us-central1"
}

variable "frontend_domain" {
  description = "Domain name for the frontend application"
  type        = string
}

################  Agent API Configuration  ################

variable "agent_api_min_instances" {
  description = "Minimum number of Agent API instances"
  type        = number
  default     = 0
}

variable "agent_api_max_instances" {
  description = "Maximum number of Agent API instances"
  type        = number
  default     = 10
}

variable "agent_api_cpu_limit" {
  description = "CPU limit for Agent API containers"
  type        = string
  default     = "2"
}

variable "agent_api_memory_limit" {
  description = "Memory limit for Agent API containers"
  type        = string
  default     = "4Gi"
}

variable "agent_api_cpu_request" {
  description = "CPU request for Agent API containers"
  type        = string
  default     = "1"
}

variable "agent_api_memory_request" {
  description = "Memory request for Agent API containers"
  type        = string
  default     = "2Gi"
}

variable "agent_env" {
  description = "Environment variables for Agent API service"
  type        = map(string)
  default     = {}
}

################  RAG Pipeline API Configuration  ################

variable "rag_api_min_instances" {
  description = "Minimum number of RAG Pipeline API instances"
  type        = number
  default     = 0
}

variable "rag_api_max_instances" {
  description = "Maximum number of RAG Pipeline API instances"
  type        = number
  default     = 5
}

variable "rag_api_cpu_limit" {
  description = "CPU limit for RAG Pipeline API containers"
  type        = string
  default     = "2"
}

variable "rag_api_memory_limit" {
  description = "Memory limit for RAG Pipeline API containers"
  type        = string
  default     = "4Gi"
}

variable "rag_api_cpu_request" {
  description = "CPU request for RAG Pipeline API containers"
  type        = string
  default     = "1"
}

variable "rag_api_memory_request" {
  description = "Memory request for RAG Pipeline API containers"
  type        = string
  default     = "2Gi"
}

variable "rag_env" {
  description = "Environment variables for RAG Pipeline API service"
  type        = map(string)
  default     = {}
}

################  Cost Optimization  ################

variable "enable_monitoring" {
  description = "Enable monitoring and alerting"
  type        = bool
  default     = true
}

variable "storage_lifecycle_age" {
  description = "Age in days for storage lifecycle management"
  type        = number
  default     = 30
}

variable "document_retention_days" {
  description = "Days to retain processed documents"
  type        = number
  default     = 1
} 
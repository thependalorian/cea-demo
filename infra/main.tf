provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

################  Artifact Registry for Container Images  ################
resource "google_artifact_registry_repository" "pendo_cea" {
  location      = var.region
  repository_id = "pendo-cea-containers"
  format        = "DOCKER"
  description   = "Container registry for Pendo Climate Economy Assistant"
}

################  Frontend Static Site with CDN  ################
resource "google_storage_bucket" "frontend" {
  name                        = var.frontend_domain
  location                    = "US"
  uniform_bucket_level_access = true
  
  # Enable public access for static site
  public_access_prevention = "inherited"
  
  website {
    main_page_suffix = "index.html"
    not_found_page   = "index.html"
  }

  # Lifecycle management for cost optimization
  lifecycle_rule {
    condition {
      age = 30
    }
    action {
      type = "Delete"
    }
  }
}

# Public access for static site
resource "google_storage_bucket_iam_member" "public_access" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}

# Get project data for service account
data "google_project" "project" {}

# Load balancer service account access
resource "google_storage_bucket_iam_member" "backend_bucket_access" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.objectViewer"
  member = "serviceAccount:service-${data.google_project.project.number}@compute-system.iam.gserviceaccount.com"
}

resource "google_storage_bucket_iam_member" "backend_bucket_legacy" {
  bucket = google_storage_bucket.frontend.name
  role   = "roles/storage.legacyBucketReader"
  member = "serviceAccount:service-${data.google_project.project.number}@compute-system.iam.gserviceaccount.com"
}

# SSL certificate for frontend
resource "google_compute_managed_ssl_certificate" "frontend_ssl" {
  name    = "pendo-cea-frontend-ssl"
  managed { 
    domains = [var.frontend_domain] 
  }
}

# Backend bucket with CDN for frontend
resource "google_compute_backend_bucket" "frontend" {
  name        = "pendo-cea-frontend-bucket"
  bucket_name = google_storage_bucket.frontend.name
  enable_cdn  = true
  
  cdn_policy {
    cache_mode        = "CACHE_ALL_STATIC"
    default_ttl       = 3600
    max_ttl           = 86400
    client_ttl        = 3600
    negative_caching  = true
    
    cache_key_policy {
      include_host           = true
      include_protocol       = true
      include_query_string   = false
    }
  }
}

# URL map for frontend
resource "google_compute_url_map" "frontend" {
  name            = "pendo-cea-frontend-lb"
  default_service = google_compute_backend_bucket.frontend.self_link
}

# HTTPS proxy for frontend
resource "google_compute_target_https_proxy" "frontend" {
  name             = "pendo-cea-frontend-https-proxy"
  url_map          = google_compute_url_map.frontend.self_link
  ssl_certificates = [google_compute_managed_ssl_certificate.frontend_ssl.self_link]
}

# Global forwarding rule for HTTPS
resource "google_compute_global_forwarding_rule" "frontend" {
  name       = "pendo-cea-frontend-https"
  target     = google_compute_target_https_proxy.frontend.self_link
  port_range = "443"
}

# HTTP to HTTPS redirect
resource "google_compute_url_map" "https_redirect" {
  name = "pendo-cea-https-redirect"
  default_url_redirect {
    https_redirect = true
    strip_query    = false
  }
}

resource "google_compute_target_http_proxy" "https_redirect" {
  name    = "pendo-cea-http-proxy"
  url_map = google_compute_url_map.https_redirect.self_link
}

resource "google_compute_global_forwarding_rule" "https_redirect" {
  name       = "pendo-cea-http-redirect"
  target     = google_compute_target_http_proxy.https_redirect.self_link
  port_range = "80"
}

################  Cloud Run Services  ################

# Agent API Service
resource "google_cloud_run_v2_service" "agent_api" {
  name     = "pendo-cea-agent-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = var.agent_api_min_instances
      max_instance_count = var.agent_api_max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.pendo_cea.repository_id}/backend_agent_api:latest"
      
      ports {
        container_port = 8001
      }

      resources {
        limits = {
          cpu    = var.agent_api_cpu_limit
          memory = var.agent_api_memory_limit
        }
        requests = {
          cpu    = var.agent_api_cpu_request
          memory = var.agent_api_memory_request
        }
      }

      dynamic "env" {
        for_each = var.agent_env
        content {
          name  = env.key
          value = env.value
        }
      }

      # Health check configuration
      startup_probe {
        http_get {
          path = "/health"
          port = 8001
        }
        initial_delay_seconds = 40
        timeout_seconds       = 10
        period_seconds        = 30
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/health"
          port = 8001
        }
        initial_delay_seconds = 30
        timeout_seconds       = 10
        period_seconds        = 30
        failure_threshold     = 3
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

# RAG Pipeline API Service
resource "google_cloud_run_v2_service" "rag_pipeline_api" {
  name     = "pendo-cea-rag-pipeline-api"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      min_instance_count = var.rag_api_min_instances
      max_instance_count = var.rag_api_max_instances
    }

    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.pendo_cea.repository_id}/rag_pipeline:latest"
      
      ports {
        container_port = 8000
      }

      resources {
        limits = {
          cpu    = var.rag_api_cpu_limit
          memory = var.rag_api_memory_limit
        }
        requests = {
          cpu    = var.rag_api_cpu_request
          memory = var.rag_api_memory_request
        }
      }

      dynamic "env" {
        for_each = var.rag_env
        content {
          name  = env.key
          value = env.value
        }
      }

      # Health check configuration
      startup_probe {
        http_get {
          path = "/health"
          port = 8000
        }
        initial_delay_seconds = 40
        timeout_seconds       = 10
        period_seconds        = 30
        failure_threshold     = 3
      }

      liveness_probe {
        http_get {
          path = "/health"
          port = 8000
        }
        initial_delay_seconds = 30
        timeout_seconds       = 10
        period_seconds        = 30
        failure_threshold     = 3
      }
    }

    # Temporary storage for file processing
    volumes {
      name = "temp-storage"
      empty_dir {
        medium     = "MEMORY"
        size_limit = "1Gi"
      }
    }
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }
}

################  IAM Policies for Public Access  ################

# Allow public access to Agent API
resource "google_cloud_run_v2_service_iam_policy" "agent_api_public" {
  name     = google_cloud_run_v2_service.agent_api.name
  location = var.region
  
  policy_data = jsonencode({
    bindings = [
      {
        role    = "roles/run.invoker"
        members = ["allUsers"]
      }
    ]
  })
}

# Allow public access to RAG Pipeline API
resource "google_cloud_run_v2_service_iam_policy" "rag_pipeline_api_public" {
  name     = google_cloud_run_v2_service.rag_pipeline_api.name
  location = var.region
  
  policy_data = jsonencode({
    bindings = [
      {
        role    = "roles/run.invoker"
        members = ["allUsers"]
      }
    ]
  })
}

################  Cloud Storage for Document Processing  ################

# Bucket for temporary document processing
resource "google_storage_bucket" "document_processing" {
  name                        = "${var.project_id}-pendo-cea-documents"
  location                    = var.region
  uniform_bucket_level_access = true
  
  # Auto-delete files after 1 day
  lifecycle_rule {
    condition {
      age = 1
    }
    action {
      type = "Delete"
    }
  }

  # CORS configuration for file uploads
  cors {
    origin          = ["https://${var.frontend_domain}"]
    method          = ["GET", "POST", "PUT", "DELETE"]
    response_header = ["*"]
    max_age_seconds = 3600
  }
}

# Service account for document processing
resource "google_service_account" "document_processor" {
  account_id   = "pendo-cea-doc-processor"
  display_name = "Pendo CEA Document Processor"
  description  = "Service account for document processing operations"
}

# Grant document processor access to storage
resource "google_storage_bucket_iam_member" "document_processor_access" {
  bucket = google_storage_bucket.document_processing.name
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${google_service_account.document_processor.email}"
}

################  Monitoring and Alerting  ################

# Uptime check for Agent API
resource "google_monitoring_uptime_check_config" "agent_api_uptime" {
  display_name = "Pendo CEA Agent API Uptime"
  timeout      = "10s"
  period       = "300s"

  http_check {
    path         = "/health"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = google_cloud_run_v2_service.agent_api.uri
    }
  }
}

# Uptime check for RAG Pipeline API
resource "google_monitoring_uptime_check_config" "rag_pipeline_api_uptime" {
  display_name = "Pendo CEA RAG Pipeline API Uptime"
  timeout      = "10s"
  period       = "300s"

  http_check {
    path         = "/health"
    port         = "443"
    use_ssl      = true
    validate_ssl = true
  }

  monitored_resource {
    type = "uptime_url"
    labels = {
      project_id = var.project_id
      host       = google_cloud_run_v2_service.rag_pipeline_api.uri
    }
  }
} 
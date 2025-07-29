/**
 * =================================================================
 * Climate Economy Assistant - Database Types
 * =================================================================
 * 
 * Comprehensive TypeScript types for all Supabase database tables,
 * views, functions, and enums. Auto-generated from the live database
 * schema using MCP Supabase tools.
 * 
 * @generated This file was auto-generated from Supabase schema
 * @created 2025-01-27
 * @updated 2025-01-27
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_permissions: {
        Row: {
          admin_id: string | null
          created_at: string | null
          granted_by: string | null
          id: string
          permission_level: string
          resource_type: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission_level: string
          resource_type: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          granted_by?: string | null
          id?: string
          permission_level?: string
          resource_type?: string
        }
        Relationships: []
      }
      admin_profiles: {
        Row: {
          can_manage_content: boolean
          can_manage_partners: boolean
          can_manage_system: boolean
          can_manage_users: boolean
          can_view_analytics: boolean
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          permissions: Json
          profile_completed: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          can_manage_content?: boolean
          can_manage_partners?: boolean
          can_manage_system?: boolean
          can_manage_users?: boolean
          can_view_analytics?: boolean
          created_at?: string | null
          email: string
          full_name?: string | null
          id?: string
          permissions?: Json
          profile_completed?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          can_manage_content?: boolean
          can_manage_partners?: boolean
          can_manage_system?: boolean
          can_manage_users?: boolean
          can_view_analytics?: boolean
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          permissions?: Json
          profile_completed?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      consolidated_profiles: {
        Row: {
          admin_capabilities: Json | null
          admin_level: string | null
          admin_notes: string | null
          career_goals: string | null
          climate_focus: string[] | null
          climate_interests: Json | null
          created_at: string | null
          current_title: string | null
          department: string | null
          description: string | null
          desired_roles: Json | null
          email: string
          emergency_contact: Json | null
          employee_count: number | null
          experience_level: string | null
          founded_year: number | null
          full_name: string | null
          headquarters: string | null
          hiring_actively: boolean | null
          id: string
          interests: string[] | null
          last_admin_action: string | null
          last_login: string | null
          mission_statement: string | null
          organization_features: Json | null
          organization_name: string | null
          organization_size: string | null
          organization_type: string | null
          partnership_level: string | null
          permissions: Json | null
          phone: string | null
          preferred_locations: Json | null
          profile_completed: boolean | null
          profile_type: Database["public"]["Enums"]["profile_type"]
          remote_work_preference: string | null
          resume_url: string | null
          salary_range_max: number | null
          salary_range_min: number | null
          skills: string[] | null
          social_links: Json | null
          stripe_customer_id: string | null
          subscription_id: string | null
          subscription_status: string | null
          subscription_tier: string | null
          total_admin_actions: number | null
          updated_at: string | null
          verified: boolean | null
          website: string | null
        }
        Insert: {
          admin_capabilities?: Json | null
          admin_level?: string | null
          admin_notes?: string | null
          career_goals?: string | null
          climate_focus?: string[] | null
          climate_interests?: Json | null
          created_at?: string | null
          current_title?: string | null
          department?: string | null
          description?: string | null
          desired_roles?: Json | null
          email: string
          emergency_contact?: Json | null
          employee_count?: number | null
          experience_level?: string | null
          founded_year?: number | null
          full_name?: string | null
          headquarters?: string | null
          hiring_actively?: boolean | null
          id: string
          interests?: string[] | null
          last_admin_action?: string | null
          last_login?: string | null
          mission_statement?: string | null
          organization_features?: Json | null
          organization_name?: string | null
          organization_size?: string | null
          organization_type?: string | null
          partnership_level?: string | null
          permissions?: Json | null
          phone?: string | null
          preferred_locations?: Json | null
          profile_completed?: boolean | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          remote_work_preference?: string | null
          resume_url?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          skills?: string[] | null
          social_links?: Json | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          total_admin_actions?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Update: {
          admin_capabilities?: Json | null
          admin_level?: string | null
          admin_notes?: string | null
          career_goals?: string | null
          climate_focus?: string[] | null
          climate_interests?: Json | null
          created_at?: string | null
          current_title?: string | null
          department?: string | null
          description?: string | null
          desired_roles?: Json | null
          email?: string
          emergency_contact?: Json | null
          employee_count?: number | null
          experience_level?: string | null
          founded_year?: number | null
          full_name?: string | null
          headquarters?: string | null
          hiring_actively?: boolean | null
          id?: string
          interests?: string[] | null
          last_admin_action?: string | null
          last_login?: string | null
          mission_statement?: string | null
          organization_features?: Json | null
          organization_name?: string | null
          organization_size?: string | null
          organization_type?: string | null
          partnership_level?: string | null
          permissions?: Json | null
          phone?: string | null
          preferred_locations?: Json | null
          profile_completed?: boolean | null
          profile_type?: Database["public"]["Enums"]["profile_type"]
          remote_work_preference?: string | null
          resume_url?: string | null
          salary_range_max?: number | null
          salary_range_min?: number | null
          skills?: string[] | null
          social_links?: Json | null
          stripe_customer_id?: string | null
          subscription_id?: string | null
          subscription_status?: string | null
          subscription_tier?: string | null
          total_admin_actions?: number | null
          updated_at?: string | null
          verified?: boolean | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "consolidated_profiles_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          agent: string | null
          context: Json | null
          conversation_type: string | null
          created_at: string
          description: string | null
          ended_at: string | null
          id: string
          initial_query: string | null
          is_archived: boolean | null
          last_activity: string
          last_message_at: string | null
          message_count: number | null
          metadata: Json | null
          session_id: string
          session_metadata: Json | null
          status: string | null
          thread_id: string | null
          title: string | null
          total_tokens_used: number | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          agent?: string | null
          context?: Json | null
          conversation_type?: string | null
          created_at: string
          description?: string | null
          ended_at?: string | null
          id: string
          initial_query?: string | null
          is_archived?: boolean | null
          last_activity: string
          last_message_at?: string | null
          message_count?: number | null
          metadata?: Json | null
          session_id: string
          session_metadata?: Json | null
          status?: string | null
          thread_id?: string | null
          title?: string | null
          total_tokens_used?: number | null
          updated_at: string
          user_id?: string | null
        }
        Update: {
          agent?: string | null
          context?: Json | null
          conversation_type?: string | null
          created_at?: string
          description?: string | null
          ended_at?: string | null
          id?: string
          initial_query?: string | null
          is_archived?: boolean | null
          last_activity?: string
          last_message_at?: string | null
          message_count?: number | null
          metadata?: Json | null
          session_id?: string
          session_metadata?: Json | null
          status?: string | null
          thread_id?: string | null
          title?: string | null
          total_tokens_used?: number | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "consolidated_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      conversation_messages: {
        Row: {
          content: string
          content_type: string | null
          conversation_id: string
          created_at: string
          embedding: string | null
          error_message: string | null
          id: string
          metadata: Json | null
          processed: boolean | null
          role: string
          specialist_type: string | null
          updated_at: string | null
        }
        Insert: {
          content: string
          content_type?: string | null
          conversation_id: string
          created_at: string
          embedding?: string | null
          error_message?: string | null
          id: string
          metadata?: Json | null
          processed?: boolean | null
          role: string
          specialist_type?: string | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          content_type?: string | null
          conversation_id?: string
          created_at?: string
          embedding?: string | null
          error_message?: string | null
          id?: string
          metadata?: Json | null
          processed?: boolean | null
          role?: string
          specialist_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "conversation_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      job_listings: {
        Row: {
          application_email: string | null
          application_url: string | null
          benefits: string | null
          climate_focus: string[] | null
          created_at: string | null
          description: string
          employment_type: string | null
          experience_level: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          location: string | null
          partner_id: string
          payment_status: string | null
          requirements: string | null
          responsibilities: string | null
          salary_range: string | null
          skills_required: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          application_email?: string | null
          application_url?: string | null
          benefits?: string | null
          climate_focus?: string[] | null
          created_at?: string | null
          description: string
          employment_type?: string | null
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          partner_id: string
          payment_status?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          skills_required?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          application_email?: string | null
          application_url?: string | null
          benefits?: string | null
          climate_focus?: string[] | null
          created_at?: string | null
          description?: string
          employment_type?: string | null
          experience_level?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          location?: string | null
          partner_id?: string
          payment_status?: string | null
          requirements?: string | null
          responsibilities?: string | null
          salary_range?: string | null
          skills_required?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      partner_profiles: {
        Row: {
          created_at: string | null
          email: string
          id: string
          industry: string | null
          organization_name: string | null
          organization_size: string | null
          organization_website: string | null
          profile_completed: boolean
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          industry?: string | null
          organization_name?: string | null
          organization_size?: string | null
          organization_website?: string | null
          profile_completed?: boolean
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          industry?: string | null
          organization_name?: string | null
          organization_size?: string | null
          organization_website?: string | null
          profile_completed?: boolean
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      resumes: {
        Row: {
          career_level: string | null
          certifications: Json | null
          chunk_count: number | null
          chunks: string[] | null
          climate_relevance_score: number | null
          contact_info: Json | null
          content: string | null
          content_embedding: string | null
          content_type: string | null
          created_at: string
          education_level: string | null
          embedding: string | null
          experience_years: number | null
          file_name: string
          file_path: string | null
          file_size: number | null
          github_url: string | null
          id: string
          industries: Json | null
          industry_background: string[] | null
          job_categories: Json | null
          job_titles: Json | null
          linkedin_url: string | null
          personal_website: string | null
          preferred_locations: Json | null
          processed: boolean | null
          processed_at: string | null
          processing_error: string | null
          processing_metadata: Json | null
          processing_status: string | null
          skills_extracted: Json | null
          summary: string | null
          updated_at: string
          user_id: string
          work_experience: Json | null
        }
        Insert: {
          career_level?: string | null
          certifications?: Json | null
          chunk_count?: number | null
          chunks?: string[] | null
          climate_relevance_score?: number | null
          contact_info?: Json | null
          content?: string | null
          content_embedding?: string | null
          content_type?: string | null
          created_at?: string
          education_level?: string | null
          embedding?: string | null
          experience_years?: number | null
          file_name: string
          file_path?: string | null
          file_size?: number | null
          github_url?: string | null
          id?: string
          industries?: Json | null
          industry_background?: string[] | null
          job_categories?: Json | null
          job_titles?: Json | null
          linkedin_url?: string | null
          personal_website?: string | null
          preferred_locations?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          processing_metadata?: Json | null
          processing_status?: string | null
          skills_extracted?: Json | null
          summary?: string | null
          updated_at?: string
          user_id: string
          work_experience?: Json | null
        }
        Update: {
          career_level?: string | null
          certifications?: Json | null
          chunk_count?: number | null
          chunks?: string[] | null
          climate_relevance_score?: number | null
          contact_info?: Json | null
          content?: string | null
          content_embedding?: string | null
          content_type?: string | null
          created_at?: string
          education_level?: string | null
          embedding?: string | null
          experience_years?: number | null
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          github_url?: string | null
          id?: string
          industries?: Json | null
          industry_background?: string[] | null
          job_categories?: Json | null
          job_titles?: Json | null
          linkedin_url?: string | null
          personal_website?: string | null
          preferred_locations?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          processing_error?: string | null
          processing_metadata?: Json | null
          processing_status?: string | null
          skills_extracted?: Json | null
          summary?: string | null
          updated_at?: string
          user_id?: string
          work_experience?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "resumes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "consolidated_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          billing_interval: string | null
          cancel_at: string | null
          canceled_at: string | null
          created_at: string | null
          currency: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          metadata: Json | null
          plan_id: string
          price_in_cents: number
          status: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          tier: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string | null
          user_id: string
          user_type: string
        }
        Insert: {
          billing_interval?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_id: string
          price_in_cents: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id: string
          user_type: string
        }
        Update: {
          billing_interval?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          created_at?: string | null
          currency?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string
          price_in_cents?: number
          status?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          tier?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string | null
          user_id?: string
          user_type?: string
        }
        Relationships: []
      },
      skills_mapping: {
        Row: {
          id: string
          skill_name: string
          category: string
          background_type: string
          climate_relevance: number
          keywords: string[]
          mapped_roles: string[]
          created_at: string
          updated_at: string
          african_relevance: number | null
          regional_frameworks: string[] | null
          african_industries: string[] | null
          local_context_notes: string | null
          cross_border_applicability: string | null
        }
        Insert: {
          id?: string
          skill_name: string
          category: string
          background_type: string
          climate_relevance: number
          keywords?: string[]
          mapped_roles?: string[]
          created_at?: string
          updated_at?: string
          african_relevance?: number | null
          regional_frameworks?: string[] | null
          african_industries?: string[] | null
          local_context_notes?: string | null
          cross_border_applicability?: string | null
        }
        Update: {
          id?: string
          skill_name?: string
          category?: string
          background_type?: string
          climate_relevance?: number
          keywords?: string[]
          mapped_roles?: string[]
          created_at?: string
          updated_at?: string
          african_relevance?: number | null
          regional_frameworks?: string[] | null
          african_industries?: string[] | null
          local_context_notes?: string | null
          cross_border_applicability?: string | null
        }
        Relationships: []
      },
      user_activities: {
        Row: {
          id: string
          user_id: string
          activity_type: string
          details: unknown
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          activity_type: string
          details?: unknown
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          activity_type?: string
          details?: unknown
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_claims: {
        Args: { user_id: string }
        Returns: Json
      }
      get_user_role: {
        Args: { user_id: string }
        Returns: string
      }
      get_user_type: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never> | { user_id: string }
        Returns: boolean
      }
      is_job_seeker: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_partner: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      profile_type: "job_seeker" | "partner" | "admin" | "general"
      user_role: "user" | "partner" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Simplified type utilities that work with our Database schema
export type Tables<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"]
export type TablesInsert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"]
export type TablesUpdate<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"]
export type Enums<T extends keyof Database["public"]["Enums"]> = Database["public"]["Enums"][T]

// =================================================================
// CONVENIENCE TYPE EXPORTS
// =================================================================

// Core Profile Types
export type ConsolidatedProfile = Tables<"consolidated_profiles">
export type ConsolidatedProfileInsert = TablesInsert<"consolidated_profiles">
export type ConsolidatedProfileUpdate = TablesUpdate<"consolidated_profiles">

// Authentication & Users
export type UserProfile = ConsolidatedProfile
export type ProfileType = Enums<"profile_type">
export type UserRole = Enums<"user_role">

// Chat & Conversations
export type Conversation = Tables<"conversations">
export type ConversationInsert = TablesInsert<"conversations">
export type ConversationMessage = Tables<"conversation_messages">
export type ConversationMessageInsert = TablesInsert<"conversation_messages">

// Job Listings & Partners
export type JobListing = Tables<"job_listings">
export type JobListingInsert = TablesInsert<"job_listings">
export type PartnerProfile = Tables<"partner_profiles">
export type PartnerProfileInsert = TablesInsert<"partner_profiles">

// Resumes & Skills
export type Resume = Tables<"resumes">
export type ResumeInsert = TablesInsert<"resumes">

// Subscriptions
export type Subscription = Tables<"subscriptions">
export type SubscriptionInsert = TablesInsert<"subscriptions">

// =================================================================
// MASSACHUSETTS-SPECIFIC TYPES
// =================================================================

export interface MassachusettsLocation {
  city: string
  county: string
  region: "Greater Boston" | "Central MA" | "Western MA" | "Cape Cod & Islands" | "Northeast MA" | "Southeast MA"
  public_transit_access: boolean
  clean_energy_hubs: string[]
}

export interface ClimateSkills {
  category: "Solar" | "Wind" | "Energy Storage" | "EV Infrastructure" | "Green Building" | "Policy" | "Finance"
  skill_name: string
  proficiency_level: "Beginner" | "Intermediate" | "Advanced" | "Expert"
  years_experience?: number
  certifications?: string[]
}

export interface VeteranProfile {
  branch: "Army" | "Navy" | "Air Force" | "Marines" | "Coast Guard" | "Space Force"
  mos_code?: string
  mos_title?: string
  service_years: number
  security_clearance?: "Confidential" | "Secret" | "Top Secret"
  veteran_preference: boolean
  disability_rating?: number
}

// =================================================================
// API RESPONSE TYPES
// =================================================================

export interface ApiResponse<T = any> {
  data?: T
  error?: {
    message: string
    code?: string
    details?: unknown
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// =================================================================
// FORM TYPES
// =================================================================

export interface ProfileFormData {
  profile_type: ProfileType
  full_name: string
  email: string
  phone?: string
  organization_name?: string
  current_title?: string
  experience_level?: string
  skills?: string[]
  climate_focus?: string[]
  preferred_locations?: MassachusettsLocation[]
  remote_work_preference?: "On-site" | "Hybrid" | "Remote" | "No preference"
  salary_range_min?: number
  salary_range_max?: number
  career_goals?: string
  veteran_info?: VeteranProfile
}

export interface JobListingFormData {
  title: string
  description: string
  responsibilities?: string
  requirements?: string
  skills_required?: string[]
  climate_focus?: string[]
  location?: string
  employment_type?: "Full-time" | "Part-time" | "Contract" | "Internship"
  experience_level?: "Entry Level" | "Mid Level" | "Senior Level" | "Executive"
  salary_range?: string
  benefits?: string
  application_url?: string
  application_email?: string
  expires_at?: string
}

// =================================================================
// SEARCH & FILTERING TYPES
// =================================================================

export interface SearchFilters {
  profile_type?: ProfileType[]
  climate_focus?: string[]
  experience_level?: string[]
  location?: string[]
  skills?: string[]
  employment_type?: string[]
  salary_range?: {
    min?: number
    max?: number
  }
  veteran_preference?: boolean
  remote_work?: boolean
}

export interface SearchResult<T> {
  item: T
  score: number
  highlights?: string[]
  explanation?: string
}

// =================================================================
// ANALYTICS TYPES
// =================================================================

export interface ConversationAnalytics {
  total_conversations: number
  average_session_duration: number
  popular_topics: string[]
  user_satisfaction: number
  agent_performance: {
    agent_name: string
    response_time: number
    accuracy_rating: number
  }[]
}

export interface JobMatchResult {
  job: JobListing
  match_score: number
  matching_skills: string[]
  skill_gaps: string[]
  recommendations: string[]
}

// =================================================================
// ERROR TYPES
// =================================================================

export interface DatabaseError {
  code: string
  message: string
  details?: unknown
  hint?: string
}

export interface ValidationError {
  field: string
  message: string
  code: string
} 
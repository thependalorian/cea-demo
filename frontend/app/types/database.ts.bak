/**
 * Supabase Database Types - ACT Climate Economy Assistant
 * 
 * This file contains TypeScript type definitions for the Supabase database schema,
 * carefully aligned with backend Pydantic models for type consistency across
 * the entire application stack.
 * 
 * The types are organized in the same structure as the backend models and
 * follow the same naming conventions for seamless integration.
 * 
 * @version 1.0
 * @lastUpdated 2023-09-21
 */

// Enums aligned with Pydantic models
export enum ProfileType {
  JOB_SEEKER = "job_seeker",
  PARTNER = "partner",
  ADMIN = "admin",
  GENERAL = "general"
}

export enum ConversationStatus {
  ACTIVE = "active",
  PAUSED = "paused",
  COMPLETED = "completed",
  ARCHIVED = "archived"
}

export enum ConversationType {
  GENERAL = "general",
  CAREER_GUIDANCE = "career_guidance",
  JOB_SEARCH = "job_search",
  SKILL_ASSESSMENT = "skill_assessment",
  PARTNER_INQUIRY = "partner_inquiry",
  ADMIN_SUPPORT = "admin_support",
  CONTEXT_STORAGE = "context_storage",
  MEMORY_SESSION = "memory_session",
  AI_INTERACTION = "ai_interaction"
}

export enum MessageRole {
  HUMAN = "human",
  AI = "ai",
  SYSTEM = "system",
  TOOL = "tool",
  USER = "user",
  ASSISTANT = "assistant"
}

export enum FeedbackType {
  HELPFUL = "helpful",
  NOT_HELPFUL = "not_helpful",
  CORRECTION = "correction",
  FLAG = "flag",
  THUMBS_UP = "thumbs_up",
  THUMBS_DOWN = "thumbs_down",
  RATING = "rating"
}

export enum SubscriptionTier {
  FREE = "free",
  PRO = "pro",
  EARLY_ACCESS = "early_access",
  REGULAR = "regular"
}

export enum SubscriptionStatus {
  ACTIVE = "active",
  TRIALING = "trialing",
  PAST_DUE = "past_due",
  CANCELED = "canceled",
  INCOMPLETE = "incomplete",
  INCOMPLETE_EXPIRED = "incomplete_expired"
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

/**
 * TypeScript interfaces for front-end use that mirror the backend Pydantic models
 */
export interface AuthUser {
  id: string
  email?: string
  phone?: string
  role?: string
  app_metadata?: Json
  user_metadata?: Json
  created_at?: string
  updated_at?: string
  last_sign_in_at?: string
  is_anonymous: boolean
  is_sso_user: boolean
  banned_until?: string
  deleted_at?: string
}

export interface ConsolidatedProfile {
  id: string
  email: string
  full_name?: string
  phone?: string
  profile_type: ProfileType
  created_at?: string
  updated_at?: string
  profile_completed?: boolean
  last_login?: string
  current_title?: string
  experience_level?: string
  climate_interests: Json
  desired_roles: Json[]
  resume_url?: string
  skills?: string[]
  interests?: string[]
  salary_range_min?: number
  salary_range_max?: number
  career_goals?: string
  preferred_locations: Json
  remote_work_preference?: string
  
  // Partner specific fields
  organization_name?: string
  organization_type?: string
  website?: string
  partnership_level?: string
  verified?: boolean
  description?: string
  social_links: Json
  organization_features: Json
  organization_size?: string
  headquarters?: string
  mission_statement?: string
  employee_count?: number
  founded_year?: number
  hiring_actively?: boolean
  climate_focus?: string[]
  
  // Admin specific fields
  admin_level?: string
  permissions: Json
  department?: string
  admin_notes?: string
  emergency_contact: Json
  last_admin_action?: string
  total_admin_actions?: number
  admin_capabilities: Json
  
  // Subscription fields
  subscription_tier?: SubscriptionTier
  subscription_status?: SubscriptionStatus
  subscription_id?: string
  stripe_customer_id?: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          email: string | null
          profile_type: ProfileType | null
          bio: string | null
          status: string | null
          location: string | null
          availability: string | null
          skills: string[] | null
          experience_level: string | null
          preferences: Json | null
          avatar_url: string | null
          current_title: string | null
          remote_work_preference: string | null
          climate_interests: Json | null
          desired_roles: Json[] | null
          profile_completed: boolean | null
          last_login: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          profile_type?: ProfileType | null
          bio?: string | null
          status?: string | null
          location?: string | null
          availability?: string | null
          skills?: string[] | null
          experience_level?: string | null
          preferences?: Json | null
          avatar_url?: string | null
          current_title?: string | null
          remote_work_preference?: string | null
          climate_interests?: Json | null
          desired_roles?: Json[] | null
          profile_completed?: boolean | null
          last_login?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          profile_type?: ProfileType | null
          bio?: string | null
          status?: string | null
          location?: string | null
          availability?: string | null
          skills?: string[] | null
          experience_level?: string | null
          preferences?: Json | null
          avatar_url?: string | null
          current_title?: string | null
          remote_work_preference?: string | null
          climate_interests?: Json | null
          desired_roles?: Json[] | null
          profile_completed?: boolean | null
          last_login?: string | null
        }
      }
      conversations: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          title: string | null
          summary: string | null
          status: ConversationStatus
          metadata: Json | null
          conversation_type: ConversationType | null
          thread_id: string | null
          context: Json | null
          message_count: number | null
          total_tokens_used: number | null
          last_activity: string | null
          initial_query: string | null
          ended_at: string | null
          session_metadata: Json | null
          agent: string | null
          session_id: string | null
          is_archived: boolean | null
          last_message_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          title?: string | null
          summary?: string | null
          status?: ConversationStatus
          metadata?: Json | null
          conversation_type?: ConversationType | null
          thread_id?: string | null
          context?: Json | null
          message_count?: number | null
          total_tokens_used?: number | null
          last_activity?: string | null
          initial_query?: string | null
          ended_at?: string | null
          session_metadata?: Json | null
          agent?: string | null
          session_id?: string | null
          is_archived?: boolean | null
          last_message_at?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          title?: string | null
          summary?: string | null
          status?: ConversationStatus
          metadata?: Json | null
          conversation_type?: ConversationType | null
          thread_id?: string | null
          context?: Json | null
          message_count?: number | null
          total_tokens_used?: number | null
          last_activity?: string | null
          initial_query?: string | null
          ended_at?: string | null
          session_metadata?: Json | null
          agent?: string | null
          session_id?: string | null
          is_archived?: boolean | null
          last_message_at?: string | null
        }
      }
      messages: {
        Row: {
          id: string
          created_at: string
          conversation_id: string
          role: MessageRole
          content: string
          metadata: Json | null
          message_data: string | null
          data: Json | null
          updated_at: string | null
          tokens_used: number | null
          model_used: string | null
          response_time_ms: number | null
          context: Json | null
          thread_id: string | null
          content_type: string | null
          processed: boolean | null
          specialist_type: string | null
          error_message: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          conversation_id: string
          role: MessageRole
          content: string
          metadata?: Json | null
          message_data?: string | null
          data?: Json | null
          updated_at?: string | null
          tokens_used?: number | null
          model_used?: string | null
          response_time_ms?: number | null
          context?: Json | null
          thread_id?: string | null
          content_type?: string | null
          processed?: boolean | null
          specialist_type?: string | null
          error_message?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          conversation_id?: string
          role?: MessageRole
          content?: string
          metadata?: Json | null
          message_data?: string | null
          data?: Json | null
          updated_at?: string | null
          tokens_used?: number | null
          model_used?: string | null
          response_time_ms?: number | null
          context?: Json | null
          thread_id?: string | null
          content_type?: string | null
          processed?: boolean | null
          specialist_type?: string | null
          error_message?: string | null
        }
      },
      message_feedback: {
        Row: {
          id: string
          conversation_id: string
          message_id: string
          user_id: string
          feedback_type: FeedbackType
          rating: number | null
          comment: string | null
          correction: string | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          message_id: string
          user_id: string
          feedback_type: FeedbackType
          rating?: number | null
          comment?: string | null
          correction?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          message_id?: string
          user_id?: string
          feedback_type?: FeedbackType
          rating?: number | null
          comment?: string | null
          correction?: string | null
          created_at?: string
        }
      },
      resumes: {
        Row: {
          id: string
          user_id: string
          file_name: string
          file_path: string | null
          file_size: number | null
          content_type: string | null
          processed: boolean | null
          content: string | null
          created_at: string
          updated_at: string
          chunks: string[] | null
          linkedin_url: string | null
          github_url: string | null
          personal_website: string | null
          skills_extracted: Json[] | null
          experience_years: number | null
          education_level: string | null
          industry_background: string[] | null
          climate_relevance_score: number | null
          processing_status: string | null
          processing_error: string | null
          processing_metadata: Json | null
          certifications: Json[] | null
          work_experience: Json[] | null
          summary: string | null
          chunk_count: number | null
          processed_at: string | null
          job_titles: Json[] | null
          contact_info: Json | null
          industries: Json[] | null
          job_categories: Json[] | null
          career_level: string | null
          preferred_locations: Json[] | null
        }
        Insert: {
          id?: string
          user_id: string
          file_name: string
          file_path?: string | null
          file_size?: number | null
          content_type?: string | null
          processed?: boolean | null
          content?: string | null
          created_at?: string
          updated_at?: string
          chunks?: string[] | null
          linkedin_url?: string | null
          github_url?: string | null
          personal_website?: string | null
          skills_extracted?: Json[] | null
          experience_years?: number | null
          education_level?: string | null
          industry_background?: string[] | null
          climate_relevance_score?: number | null
          processing_status?: string | null
          processing_error?: string | null
          processing_metadata?: Json | null
          certifications?: Json[] | null
          work_experience?: Json[] | null
          summary?: string | null
          chunk_count?: number | null
          processed_at?: string | null
          job_titles?: Json[] | null
          contact_info?: Json | null
          industries?: Json[] | null
          job_categories?: Json[] | null
          career_level?: string | null
          preferred_locations?: Json[] | null
        }
        Update: {
          id?: string
          user_id?: string
          file_name?: string
          file_path?: string | null
          file_size?: number | null
          content_type?: string | null
          processed?: boolean | null
          content?: string | null
          created_at?: string
          updated_at?: string
          chunks?: string[] | null
          linkedin_url?: string | null
          github_url?: string | null
          personal_website?: string | null
          skills_extracted?: Json[] | null
          experience_years?: number | null
          education_level?: string | null
          industry_background?: string[] | null
          climate_relevance_score?: number | null
          processing_status?: string | null
          processing_error?: string | null
          processing_metadata?: Json | null
          certifications?: Json[] | null
          work_experience?: Json[] | null
          summary?: string | null
          chunk_count?: number | null
          processed_at?: string | null
          job_titles?: Json[] | null
          contact_info?: Json | null
          industries?: Json[] | null
          job_categories?: Json[] | null
          career_level?: string | null
          preferred_locations?: Json[] | null
        }
      },
      agents: {
        Row: {
          id: string
          name: string
          agent_id: string
          description: string | null
          team: string
          specializations: string[] | null
          intelligence_level: number | null
          capabilities: string[] | null
          tools_available: string[] | null
          status: string | null
          avatar_url: string | null
          response_time_avg: number | null
          satisfaction_rating: number | null
          total_conversations: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          agent_id: string
          description?: string | null
          team: string
          specializations?: string[] | null
          intelligence_level?: number | null
          capabilities?: string[] | null
          tools_available?: string[] | null
          status?: string | null
          avatar_url?: string | null
          response_time_avg?: number | null
          satisfaction_rating?: number | null
          total_conversations?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          agent_id?: string
          description?: string | null
          team?: string
          specializations?: string[] | null
          intelligence_level?: number | null
          capabilities?: string[] | null
          tools_available?: string[] | null
          status?: string | null
          avatar_url?: string | null
          response_time_avg?: number | null
          satisfaction_rating?: number | null
          total_conversations?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
      },
      job_listings: {
        Row: {
          id: string
          partner_id: string
          title: string
          description: string
          requirements: string | null
          responsibilities: string | null
          location: string | null
          employment_type: string | null
          experience_level: string | null
          salary_range: string | null
          climate_focus: string[] | null
          skills_required: string[] | null
          benefits: string | null
          application_url: string | null
          application_email: string | null
          is_active: boolean | null
          expires_at: string | null
          created_at: string | null
          updated_at: string | null
          payment_status: string | null
        }
        Insert: {
          id?: string
          partner_id: string
          title: string
          description: string
          requirements?: string | null
          responsibilities?: string | null
          location?: string | null
          employment_type?: string | null
          experience_level?: string | null
          salary_range?: string | null
          climate_focus?: string[] | null
          skills_required?: string[] | null
          benefits?: string | null
          application_url?: string | null
          application_email?: string | null
          is_active?: boolean | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          payment_status?: string | null
        }
        Update: {
          id?: string
          partner_id?: string
          title?: string
          description?: string
          requirements?: string | null
          responsibilities?: string | null
          location?: string | null
          employment_type?: string | null
          experience_level?: string | null
          salary_range?: string | null
          climate_focus?: string[] | null
          skills_required?: string[] | null
          benefits?: string | null
          application_url?: string | null
          application_email?: string | null
          is_active?: boolean | null
          expires_at?: string | null
          created_at?: string | null
          updated_at?: string | null
          payment_status?: string | null
        }
      },
      subscriptions: {
        Row: {
          id: string
          user_id: string
          stripe_subscription_id: string | null
          stripe_customer_id: string | null
          plan_id: string
          status: string
          current_period_start: string | null
          current_period_end: string | null
          cancel_at: string | null
          canceled_at: string | null
          trial_start: string | null
          trial_end: string | null
          user_type: string
          tier: SubscriptionTier
          billing_interval: string | null
          price_in_cents: number
          currency: string
          metadata: Json | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          plan_id: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          user_type: string
          tier: SubscriptionTier
          billing_interval?: string | null
          price_in_cents: number
          currency?: string
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          stripe_subscription_id?: string | null
          stripe_customer_id?: string | null
          plan_id?: string
          status?: string
          current_period_start?: string | null
          current_period_end?: string | null
          cancel_at?: string | null
          canceled_at?: string | null
          trial_start?: string | null
          trial_end?: string | null
          user_type?: string
          tier?: SubscriptionTier
          billing_interval?: string | null
          price_in_cents?: number
          currency?: string
          metadata?: Json | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
  }
}

/**
 * Utility type for creating typed request/response parameters for API endpoints
 */
export type ApiRequest<T> = {
  data: T;
  metadata?: Record<string, any>;
};

/**
 * Utility type for creating typed responses from API endpoints
 */
export type ApiResponse<T> = {
  data: T;
  metadata?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
};
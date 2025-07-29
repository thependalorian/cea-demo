/**
 * =================================================================
 * Climate Economy Assistant - Supabase Client Configuration
 * =================================================================
 * 
 * Central Supabase client setup with authentication, real-time subscriptions,
 * and comprehensive type safety using our complete database schema.
 * 
 * Features:
 * - Full TypeScript integration with 45+ database tables
 * - Authentication state management
 * - Real-time subscriptions for chat and notifications
 * - Vector embeddings for semantic search
 * - Massachusetts-specific clean energy job platform functionality
 * 
 * @created 2025-01-27
 * @updated 2025-01-27
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './database.types'

// =================================================================
// ENVIRONMENT CONFIGURATION
// =================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zugdojmdktxalqflxbbh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1Z2Rvam1ka3R4YWxxZmx4YmJoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU5MzU4NSwiZXhwIjoyMDY0MTY5NTg1fQ.-tp3_RUU1FF1TEw2wAGwr3phBSCiElPGQqAiorZJHFc'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Using fallback values.')
  console.error('Supabase URL:', supabaseUrl ? 'Set' : 'Missing')
  console.error('Supabase Key:', supabaseAnonKey ? 'Set' : 'Missing')
}

// =================================================================
// SUPABASE CLIENT CONFIGURATION
// =================================================================

/**
 * Main Supabase client for client-side usage
 * Use this in components and client-side logic
 */
export const supabase = createSupabaseClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'X-Client-Info': 'climate-economy-assistant@1.0.0'
    }
  }
})

/**
 * Browser client for client components (Next.js 13+ App Router)
 * Recommended for client components with SSR support
 */
export function createClientSupabase() {
  return createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)
}

/**
 * Note: Server-side Supabase functionality has been moved to './supabase-server.ts'
 * to avoid client/server import conflicts. Use createServerSupabase() from that file
 * in API routes and server components.
 */


// Re-export createClient for backward compatibility
export { createBrowserClient as createClient } from '@supabase/ssr'



// =================================================================
// AUTHENTICATION HELPERS
// =================================================================

/**
 * Get the current user session
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  return user
}

/**
 * Get the current user's profile from consolidated_profiles
 */
export async function getCurrentUserProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('consolidated_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error) {
    console.error('Error getting user profile:', error)
    return null
  }

  return profile
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error)
    throw error
  }
}

// =================================================================
// MASSACHUSETTS WORKFORCE HELPERS
// =================================================================

/**
 * Get Massachusetts-specific climate jobs
 */
export async function getMassachusettsClimateJobs(filters: {
  climate_focus?: string[]
  location?: string
  experience_level?: string
  limit?: number
}) {
  let query = supabase
    .from('job_listings')
    .select(`
      *,
      partner_profiles!inner(organization_name, organization_website)
    `)
    .eq('is_active', true)

  if (filters.climate_focus?.length) {
    query = query.overlaps('climate_focus', filters.climate_focus)
  }

  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }

  if (filters.experience_level) {
    query = query.eq('experience_level', filters.experience_level)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .limit(filters.limit || 20)

  if (error) {
    console.error('Error fetching Massachusetts climate jobs:', error)
    throw error
  }

  return data
}

/**
 * Search for veteran-friendly positions
 */
export async function getVeteranFriendlyJobs() {
  const { data, error } = await supabase
    .from('job_listings')
    .select('*')
    .eq('is_active', true)
    .or('title.ilike.%veteran%,description.ilike.%veteran%,requirements.ilike.%veteran%')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    console.error('Error fetching veteran-friendly jobs:', error)
    throw error
  }

  return data
}

// =================================================================
// REAL-TIME SUBSCRIPTIONS
// =================================================================

/**
 * Subscribe to conversation messages for real-time chat
 */
export function subscribeToConversationMessages(
  conversationId: string,
  callback: (message: unknown) => void
) {
  return supabase
    .channel(`conversation:${conversationId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'conversation_messages',
        filter: `conversation_id=eq.${conversationId}`
      },
      callback
    )
    .subscribe()
}

/**
 * Subscribe to job listing updates for partners
 */
export function subscribeToJobListings(
  partnerId: string,
  callback: (job: unknown) => void
) {
  return supabase
    .channel(`partner:${partnerId}:jobs`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'job_listings',
        filter: `partner_id=eq.${partnerId}`
      },
      callback
    )
    .subscribe()
}

// =================================================================
// EXPORTS
// =================================================================

// Default export for convenience
export default supabase

// Re-export types for convenience
export type { Database } from './database.types'
export type {
  ConsolidatedProfile,
  Conversation,
  ConversationMessage,
  JobListing,
  ProfileType,
  UserRole
} from './database.types' 
/**
 * =================================================================
 * Climate Economy Assistant - Server-side Supabase Configuration
 * =================================================================
 * 
 * Server-side Supabase client setup for use in API routes and server components.
 * This file handles cookies and session management on the server side.
 */

import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from './database.types'

// =================================================================
// ENVIRONMENT CONFIGURATION
// =================================================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.'
  )
}

// =================================================================
// SERVER-SIDE SUPABASE CLIENT
// =================================================================

/**
 * Server client for server components and API routes
 * Handles cookies and session management on the server
 */
export function createServerSupabase() {
  const cookieStore = cookies()
  
  return createSSRServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: unknown) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: unknown) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
}

/**
 * Create route handler client for API routes
 * Use this in your API route handlers
 */
export function createRouteHandlerClient() {
  const cookieStore = cookies()
  
  return createSSRServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: unknown) {
        cookieStore.set({ name, value, ...options })
      },
      remove(name: string, options: unknown) {
        cookieStore.delete({ name, ...options })
      },
    },
  })
} 
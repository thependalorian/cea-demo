/**
 * Enhanced OAuth Callback Handler
 * Handles OAuth tokens from URL fragments and search parameters
 * Uses singleton client to avoid multiple instances
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'
import { SupabaseClient } from '@supabase/supabase-js';

interface SessionData {
  flow: string;
  start_time: string;
  auth_method: string;
  browser_info: string;
  events: { event: string; timestamp: string; time_ms: number; data?: unknown }[];
  supabase_url?: string;
  localStorage_available?: boolean;
  error?: string;
  error_stack?: string;
}

export default function AuthCallback() {
  const router = useRouter()
  const [status, setStatus] = useState('Processing authentication...')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleAuthCallback = async () => {
      const startTime = new Date().getTime()
      const sessionData: SessionData = {
        flow: 'oauth_callback',
        start_time: new Date().toISOString(),
        auth_method: 'pkce',
        browser_info: navigator.userAgent,
        events: []
      }
      
      const logEvent = (event: string, data?: unknown) => {
        console.log(`[Auth] ${event}`, data)
        sessionData.events.push({
          event,
          timestamp: new Date().toISOString(),
          time_ms: new Date().getTime() - startTime,
          data
        })
      }

      try {
        logEvent('Auth callback page loaded')
        
        const supabase = createClient();
        sessionData.supabase_url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'unknown'
        
        // Check local storage
        logEvent('Checking localStorage availability')
        try {
          const testKey = 'supabase_auth_test'
          localStorage.setItem(testKey, 'test')
          const testValue = localStorage.getItem(testKey)
          localStorage.removeItem(testKey)
          sessionData.localStorage_available = testValue === 'test'
          logEvent('localStorage check result', { available: sessionData.localStorage_available })
          
          // List all keys in localStorage related to Supabase
          const supabaseKeys = Object.keys(localStorage).filter(key => key.includes('supabase'))
          logEvent('Supabase localStorage keys', { keys: supabaseKeys })
        } catch (e: unknown) {
          logEvent('localStorage error', { error: (e as Error).message })
          sessionData.localStorage_available = false
        }
        
        // First, try to handle the auth callback normally
        logEvent('Getting initial session')
        const { data, error: authError } = await supabase.auth.getSession();
        
        if (authError) {
          logEvent('Auth session error', { error: authError.message })
          throw authError;
        }

        // If we have a session, great!
        if (data?.session?.user) {
          logEvent('Initial session found', { 
            user_id: data.session.user.id,
            email: data.session.user.email,
            expiresAt: data.session.expires_at
          })
          
          // Log session to workflow_sessions table
          await logSessionToSupabase(supabase, data.session.user.id, sessionData)
          
          await handleUserRedirect(data.session.user.id);
          return;
        }

        logEvent('No initial session found, checking URL for tokens')
        
        const url = new URL(window.location.href);
        const hashParams = new URLSearchParams(url.hash.substring(1));
        const searchParams = new URLSearchParams(url.search);
        
        // Get tokens from URL
        const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || searchParams.get('refresh_token');
        const tokenType = hashParams.get('type') || searchParams.get('type');
        
        logEvent('URL token check', { 
          hasAccessToken: !!accessToken, 
          hasRefreshToken: !!refreshToken, 
          tokenType,
          url: window.location.href.split('?')[0] // Log URL path without query for privacy
        });

        if (accessToken && refreshToken) {
          setStatus('Setting session...');
          logEvent('Setting session with tokens')
          
          const { data: sessionDataResponse, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            logEvent('Session setting error', { error: sessionError.message })
            throw sessionError;
          }

          if (sessionDataResponse?.user) {
            logEvent('Session set successfully', { 
              user_id: sessionDataResponse.user.id,
              email: sessionDataResponse.user.email
            })
            
            // Log session to workflow_sessions table
            await logSessionToSupabase(supabase, sessionDataResponse.user.id, sessionData)
            
            await handleUserRedirect(sessionDataResponse.user.id);
          } else {
            logEvent('No user data after setting session')
            throw new Error('No user data after setting session');
          }
        } else {
          // Check for authorization code (PKCE flow)
          const code = searchParams.get('code');
          if (code) {
            setStatus('Exchanging authorization code...');
            logEvent('Found authorization code, exchanging for session')
            
            const { data: codeData, error: codeError } = await supabase.auth.exchangeCodeForSession(code);
            logEvent('Code exchange completed', { 
              success: !codeError, 
              hasUser: !!codeData?.user,
              error: codeError?.message
            })
            
            if (codeError) {
              logEvent('Code exchange error', { error: codeError.message })
              throw codeError;
            }

            if (codeData?.user) {
              logEvent('Code exchange successful', { 
                user_id: codeData.user.id,
                email: codeData.user.email
              })
              
              // Verify session was stored
              const { data: verifyData } = await supabase.auth.getSession()
              logEvent('Session verification after code exchange', {
                sessionFound: !!verifyData?.session,
                userId: verifyData?.session?.user?.id
              })
              
              // Add delay to allow session persistence
              await new Promise(resolve => setTimeout(resolve, 500))
              
              // Try to get session again
              const { data: finalCheck } = await supabase.auth.getSession()
              logEvent('Final session check', {
                sessionFound: !!finalCheck?.session,
                userId: finalCheck?.session?.user?.id
              })
              
              // Log session to workflow_sessions table
              await logSessionToSupabase(supabase, codeData.user.id, sessionData)
              
              await handleUserRedirect(codeData.user.id);
            } else {
              logEvent('No user data after code exchange')
              throw new Error('No user data after code exchange');
            }
          } else {
            logEvent('No authentication tokens or code found in URL')
            throw new Error('No authentication tokens or code found in URL');
          }
        }

      } catch (error: unknown) {
        logEvent('Auth callback error', { message: (error as Error).message, stack: (error as Error).stack })
        console.error('Auth callback error:', error);
        setError((error as Error).message || 'Authentication failed');
        setStatus('Authentication failed');
        
        // Try to log the failed session
        try {
          sessionData.error = (error as Error).message
          sessionData.error_stack = (error as Error).stack
          const supabase = createClient()
          const { data } = await supabase.auth.getSession()
          if (data?.session?.user) {
            await logSessionToSupabase(supabase, data.session.user.id, sessionData)
          } else {
            // Log without user ID
            await logSessionToSupabase(supabase, null, sessionData)
          }
        } catch (logError) {
          console.error('Failed to log error to workflow_sessions', logError)
        }
        
        // Redirect to login with error after 3 seconds
        setTimeout(() => {
          router.push('/auth/login?error=callback_failed');
        }, 3000);
      }
    };

    const logSessionToSupabase = async (supabase: SupabaseClient, userId: string | null, sessionData: SessionData) => {
      try {
        console.log('Logging session to workflow_sessions', { userId })
        const { data, error } = await supabase
          .from('workflow_sessions')
          .insert({
            user_id: userId || '00000000-0000-0000-0000-000000000000', // Use placeholder UUID if no user
            workflow_type: 'authentication',
            status: userId ? 'success' : 'error',
            data: sessionData as Record<string, unknown>,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
        
        if (error) {
          console.error('Error logging session to workflow_sessions', error)
        } else {
          console.log('Session logged successfully', { sessionId: data?.[0]?.id })
        }
      } catch (e) {
        console.error('Exception logging session to workflow_sessions', e)
      }
    }

    const handleUserRedirect = async (userId: string) => {
      try {
        setStatus('Checking user profile...');
        
        const supabase = createClient();
        
        // Check user profile
        const { data: profile, error: profileError } = await supabase
          .from('consolidated_profiles')
          .select('profile_completed, profile_type')
          .eq('id', userId)
          .single();

        console.log('User profile:', { profile, profileError });

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // If no profile or incomplete profile, go to setup
        if (!profile || !profile.profile_completed) {
          console.log('Redirecting to profile setup');
          setStatus('Setting up profile...');
          router.push('/profile/setup');
          return;
        }

        // Redirect based on profile type
        console.log('Redirecting based on profile type:', profile.profile_type);
        setStatus('Redirecting to dashboard...');
        
        switch (profile.profile_type) {
          case 'partner':
            router.push('/partner/dashboard');
            break;
          case 'admin':
            router.push('/admin');
            break;
          default:
            router.push('/dashboard');
        }
      } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Error checking user profile:', errorMessage);
        // If profile check fails, just go to dashboard
        console.log('Profile check failed, redirecting to dashboard');
        router.push('/dashboard');
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Authentication Failed
            </h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="bg-spring-green text-white px-4 py-2 rounded hover:bg-spring-green/90"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="loading loading-spinner loading-lg mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Sign In
        </h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}
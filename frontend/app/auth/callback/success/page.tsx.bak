/**
 * OAuth Success Handler - Simplified
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase, clearOldSessions } from '@/lib/supabaseClient'

export default function AuthSuccessPage() {
  const router = useRouter()
  const [status, setStatus] = useState('starting')

  useEffect(() => {
    const handleAuthSuccess = async () => {
      // Initialize session tracking
      const startTime = new Date().getTime();
      const sessionData = {
        flow: 'oauth_success_callback',
        start_time: new Date().toISOString(),
        browser_info: navigator.userAgent,
        events: [],
        localStorage_keys: [],
        success: false
      };
      
      // Helper function to log events with timestamps
      const logEvent = (event, details = {}) => {
        console.log(`[Auth Success] ${event}`, details);
        sessionData.events.push({
          event,
          timestamp: new Date().toISOString(),
          elapsed_ms: new Date().getTime() - startTime,
          ...details
        });
      };
      
      try {
        // Log initial state and check localStorage
        logEvent('Starting auth success flow');
        
        try {
          const allKeys = Object.keys(localStorage);
          const supabaseKeys = allKeys.filter(k => k.includes('supabase'));
          sessionData.localStorage_keys = supabaseKeys;
          logEvent('LocalStorage keys found', { count: supabaseKeys.length, keys: supabaseKeys });
        } catch (e) {
          logEvent('LocalStorage access error', { error: e.message });
        }
        
        // Clear old sessions from different projects first
        clearOldSessions()
        setStatus('cleared_old_sessions')
        logEvent('Cleared old sessions');

        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        
        if (!code) {
          logEvent('No authorization code found', { search: window.location.search.substring(0, 20) });
          console.error('No authorization code found')
          router.push('/auth/login?error=no_code')
          return
        }

        setStatus('exchanging_code')
        logEvent('Exchanging code for session', { codeLength: code.length });
        
        // Exchange code for session
        const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (exchangeError) {
          logEvent('Code exchange failed', { error: exchangeError.message, code: exchangeError.code });
          console.error('Code exchange failed:', exchangeError)
          router.push(`/auth/login?error=code_exchange_failed`)
          
          // Log failed session
          await logSessionToSupabase(null, {
            ...sessionData,
            error: exchangeError.message,
            error_code: exchangeError.code
          });
          
          return
        }

        logEvent('Code exchange successful', {
          hasUser: !!data?.user,
          userId: data?.user?.id,
          email: data?.user?.email ? `${data.user.email.substring(0,2)}...` : null // Log only first 2 chars for privacy
        });
        console.log('Code exchange successful')
        setStatus('waiting_for_session')
        
        // Wait a bit for session to be properly stored
        await new Promise(resolve => setTimeout(resolve, 1000))
        logEvent('Waited for session persistence');
        
        // Check session multiple times with retries
        let session = null
        let attempts = 0
        const maxAttempts = 5
        
        while (!session && attempts < maxAttempts) {
          const { data: { session: currentSession } } = await supabase.auth.getSession()
          session = currentSession
          
          if (!session) {
            attempts++
            logEvent(`Session check attempt ${attempts}`, { 
              success: false, 
              remaining: maxAttempts - attempts 
            });
            console.log(`Session check attempt ${attempts}/${maxAttempts}`)
            setStatus(`session_retry_${attempts}`)
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }

        if (!session) {
          logEvent('No session found after multiple attempts');
          console.error('No session found after multiple attempts')
          router.push('/auth/login?error=no_session')
          
          // Log failed session
          await logSessionToSupabase(null, {
            ...sessionData,
            error: 'No session found after multiple attempts',
            attempts
          });
          
          return
        }

        // Success! We have a session
        sessionData.success = true;
        logEvent('Session established', { 
          userId: session.user.id,
          email: `${session.user.email.substring(0,2)}...`, // Log only first 2 chars for privacy
          expiresIn: session.expires_in
        });
        console.log('Session established:', session.user.email)
        setStatus('checking_profile')
        
        // Log successful auth to workflow_sessions
        await logSessionToSupabase(session.user.id, sessionData);
        
        // Check for user profile
        const { data: profile, error: profileError } = await supabase
          .from('consolidated_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        logEvent('Profile check', { 
          found: !!profile,
          type: profile?.profile_type,
          error: profileError?.message
        });

        // Determine redirect path
        let redirectPath = '/dashboard'
        
        if (profile) {
          // If profile_type is 'general', they need to set up their specific type
          if (profile.profile_type === 'general') {
            redirectPath = '/profile/setup'
          } else if (profile.profile_type === 'partner') {
            redirectPath = '/partner/dashboard'
          } else if (profile.profile_type === 'admin') {
            redirectPath = '/admin'
          } else if (profile.profile_type === 'job_seeker') {
            redirectPath = '/dashboard'
          }
        } else {
          redirectPath = '/profile/setup'
        }

        logEvent('Redirecting', { path: redirectPath });
        console.log('Redirecting to:', redirectPath)
        setStatus(`redirecting_to_${redirectPath.replace('/', '_')}`)
        
        // Use window.location.href for reliable redirect
        window.location.href = redirectPath

      } catch (error) {
        logEvent('Auth success error', { 
          message: error.message,
          stack: error.stack?.substring(0, 200) // Truncate stack for privacy
        });
        console.error('Unexpected error during auth success:', error)
        setStatus('error')
        
        // Log error to workflow_sessions
        try {
          const { data: { session } } = await supabase.auth.getSession();
          await logSessionToSupabase(session?.user?.id, {
            ...sessionData,
            error: error.message,
            error_stack: error.stack
          });
        } catch (e) {
          console.error('Failed to log session error', e);
        }
        
        router.push('/auth/login?error=unexpected_error')
      }
    }
    
    const logSessionToSupabase = async (userId, sessionData) => {
      try {
        console.log('Logging session to workflow_sessions', { userId: userId ? 'exists' : 'missing' })
        
        const { error } = await supabase
          .from('workflow_sessions')
          .insert({
            user_id: userId || '00000000-0000-0000-0000-000000000000', // Use placeholder UUID if no user
            workflow_type: 'authentication_success',
            status: userId && sessionData.success ? 'success' : 'error',
            data: sessionData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (error) {
          console.error('Error logging session to workflow_sessions', error)
        } else {
          console.log('Session logged successfully to workflow_sessions')
        }
      } catch (e) {
        console.error('Exception logging session to workflow_sessions', e)
      }
    }

    handleAuthSuccess()
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h1>
          <p className="text-gray-600 mb-6">Completing authentication...</p>
          <p className="text-sm text-gray-500 capitalize">
            Status: {status.replace(/_/g, ' ')}
          </p>
          {status.includes('retry') && (
            <p className="text-xs text-blue-600 mt-2">
              Ensuring session is properly saved...
            </p>
          )}
        </div>
      </div>
    </div>
  )
} 
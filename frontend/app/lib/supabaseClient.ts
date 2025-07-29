'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database';

// Create a Supabase client for use in client components
export const supabase = createClientComponentClient<Database>();

// Debug session information
export const debugSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    return data.session;
  } catch (e) {
    console.error('Error in debugSession:', e);
    return null;
  }
};

// Clear old sessions from localStorage to prevent storage issues
export const clearOldSessions = () => {
  try {
    if (typeof window === 'undefined') return;
    
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('supabase.auth.token') || key.startsWith('supabase.auth.refreshToken'))) {
        keys.push(key);
      }
    }
    
    // Keep only the most recent session
    if (keys.length > 2) {
      // Sort by timestamp (assuming format contains timestamp)
      keys.sort().reverse();
      
      // Remove all but the most recent pair
      keys.slice(2).forEach(key => {
        localStorage.removeItem(key);
      });
      
      console.log(`Cleared ${keys.length - 2} old Supabase sessions`);
    }
  } catch (e) {
    console.error('Error clearing old sessions:', e);
  }
}; 
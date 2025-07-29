/**
 * ClientAuthProvider - Authentication State Management
 * 
 * Purpose: Manages user authentication state, role detection, and Supabase integration
 * Location: /app/components/ClientAuthProvider.tsx
 * Used by: Main layout.tsx to wrap the entire app with auth context
 * 
 * Features:
 * - Supabase authentication integration
 * - Role-based user type detection (job_seeker, partner, admin)
 * - Authentication state persistence
 * - Loading states and error handling
 * - Massachusetts-focused user onboarding
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for our authentication system
export interface User {
  id: string;
  email: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
    role?: 'job_seeker' | 'partner' | 'admin';
  };
  app_metadata?: {
    role?: 'job_seeker' | 'partner' | 'admin';
  };
}

export interface Profile {
  id: string;
  full_name: string;
  role: 'job_seeker' | 'partner' | 'admin';
  location?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: unknown }>;
  signUp: (email: string, password: string, role: 'job_seeker' | 'partner') => Promise<{ error: unknown; data: unknown }>;
  signInWithGoogle: () => Promise<{ error: unknown }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: unknown }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface ClientAuthProviderProps {
  children: React.ReactNode;
}

export default function ClientAuthProvider({ children }: ClientAuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock authentication functions (will be replaced with actual Supabase)
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Supabase authentication
      console.log('Mock sign in:', { email, password });
      
      // Mock user data for development
      const mockUser: User = {
        id: 'mock-user-id',
        email,
        user_metadata: {
          full_name: 'Massachusetts User',
          role: 'job_seeker'
        }
      };
      
      const mockProfile: Profile = {
        id: 'mock-profile-id',
        full_name: 'Massachusetts User',
        role: 'job_seeker',
        location: 'Massachusetts, USA',
        bio: 'Exploring clean energy opportunities in Massachusetts',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(mockUser);
      setProfile(mockProfile);
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: 'job_seeker' | 'partner') => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Supabase authentication
      console.log('Mock sign up:', { email, password, role });
      
      // Mock successful signup
      const mockUser: User = {
        id: 'mock-new-user-id',
        email,
        user_metadata: {
          full_name: 'New Massachusetts User',
          role
        }
      };
      
      const mockProfile: Profile = {
        id: 'mock-new-profile-id',
        full_name: 'New Massachusetts User',
        role,
        location: 'Massachusetts, USA',
        bio: role === 'partner' 
          ? 'Massachusetts clean energy employer looking for talent'
          : 'Seeking clean energy career opportunities in Massachusetts',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(mockUser);
      setProfile(mockProfile);
      
      return { error: null, data: { user: mockUser } };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error, data: null };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Supabase Google OAuth
      console.log('Mock Google sign in');
      
      // Mock Google OAuth user
      const mockUser: User = {
        id: 'mock-google-user-id',
        email: 'user@gmail.com',
        user_metadata: {
          full_name: 'Google User',
          avatar_url: 'https://via.placeholder.com/150',
          role: 'job_seeker'
        }
      };
      
      const mockProfile: Profile = {
        id: 'mock-google-profile-id',
        full_name: 'Google User',
        role: 'job_seeker',
        location: 'Massachusetts, USA',
        bio: 'Clean energy enthusiast in Massachusetts',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setUser(mockUser);
      setProfile(mockProfile);
      
      return { error: null };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with actual Supabase sign out
      console.log('Mock sign out');
      
      setUser(null);
      setProfile(null);
      
      // Clear any stored tokens/sessions
      if (typeof window !== 'undefined') {
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (!profile) {
        throw new Error('No profile to update');
      }
      
      // TODO: Replace with actual Supabase profile update
      console.log('Mock profile update:', updates);
      
      const updatedProfile: Profile = {
        ...profile,
        ...updates,
        updated_at: new Date().toISOString()
      };
      
      setProfile(updatedProfile);
      
      return { error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { error };
    }
  };

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        
        // TODO: Replace with actual Supabase session restoration
        console.log('Initializing auth state...');
        
        // Check for existing session
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem('supabase.auth.token');
          if (storedToken) {
            // Mock restored session
            const mockUser: User = {
              id: 'restored-user-id',
              email: 'restored@example.com',
              user_metadata: {
                full_name: 'Restored User',
                role: 'job_seeker'
              }
            };
            
            const mockProfile: Profile = {
              id: 'restored-profile-id',
              full_name: 'Restored User',
              role: 'job_seeker',
              location: 'Massachusetts, USA',
              bio: 'Massachusetts clean energy professional',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            };

            setUser(mockUser);
            setProfile(mockProfile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Context value
  const value: AuthContextType = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a ClientAuthProvider');
  }
  return context;
};

// Export the context for direct usage if needed
export { AuthContext }; 
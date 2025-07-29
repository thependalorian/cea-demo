// Job Seeker Signup Page
// Location: app/auth/signup/job-seeker/page.tsx
// This page allows job seekers to sign up and creates their profile in Supabase.

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function JobSeekerSignup() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    // Add more fields as needed
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const { fetchProfile } = useAuth() // Use the useAuth hook to refresh profile after signup

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    // Validate form inputs
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Please fill in all required fields')
      return
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }
    
    setIsLoading(true)
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: { data: { full_name: formData.fullName, user_type: 'job_seeker' } }
      })
      
      if (signUpError) throw signUpError
      if (!data.user) throw new Error('User not created')
      
      // Call API to create job seeker profile
      const res = await fetch('/api/create-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          role: 'job_seeker',
          profileData: { full_name: formData.fullName, email: formData.email }
        })
      })
      
      if (!res.ok) throw new Error('Failed to create profile')
      
      // --- FIX: Refresh profile state after signup so navigation/dashboard is correct ---
      await fetchProfile(data.user.id)
      router.push('/profile?welcome=true')
    } catch (err: unknown) {
      setError((err as Error).message || 'Signup failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Sign Up as Job Seeker</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="alert alert-error">{error}</div>}
            <input name="fullName" type="text" className="input input-bordered w-full" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required />
            <input name="email" type="email" className="input input-bordered w-full" placeholder="Email" value={formData.email} onChange={handleInputChange} required />
            <input name="password" type="password" className="input input-bordered w-full" placeholder="Password" value={formData.password} onChange={handleInputChange} required />
            <input name="confirmPassword" type="password" className="input input-bordered w-full" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleInputChange} required />
            <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>{isLoading ? 'Signing up...' : 'Sign Up'}</button>
          </form>
        </div>
      </div>
    </div>
  )
} 
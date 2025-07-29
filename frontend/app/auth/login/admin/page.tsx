// Admin OTP Login Page
// Location: app/auth/login/admin/page.tsx
// Only allows @joinact.org emails. Uses Supabase OTP (magic link) for login.

'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter()

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!email.endsWith('@joinact.org')) {
      setError('Only @joinact.org emails are allowed.')
      return
    }
    setIsLoading(true)
    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({ email })
      if (signInError) throw signInError
      setMessage('Check your email for a login link.')
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to send OTP')
    } finally {
      setIsLoading(false)
    }
  }

  // On successful login, create admin profile if not exists
  // This should be handled in a useEffect in a layout or dashboard page after login

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-center">Admin Login</h2>
          <form onSubmit={handleSendOTP} className="space-y-4">
            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <input
              name="email"
              type="email"
              className="input input-bordered w-full"
              placeholder="admin@joinact.org"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <button className="btn btn-primary w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Sending...' : 'Send Login Link'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
} 
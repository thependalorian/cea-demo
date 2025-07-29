'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/types/database'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient<Database>()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw error
      }

      setMessage('Password reset email sent. Please check your inbox.')
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset email';
      console.error('Reset password error:', errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{message}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-spring-green focus:border-spring-green focus:z-10 sm:text-sm"
              placeholder="Email address"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-spring-green hover:bg-spring-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-spring-green disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending reset link...' : 'Send reset link'}
            </button>
          </div>

          <div className="text-sm text-center">
            <Link href="/auth/login" className="font-medium text-spring-green hover:text-spring-green/90">
              Back to login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
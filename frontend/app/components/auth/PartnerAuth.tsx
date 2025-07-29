'use client'

import React from 'react'
import { useAuth } from '@/hooks/useAuth'

interface PartnerAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function PartnerAuth({ children }: PartnerAuthProps) {
  const { user, isAuthenticated } = useAuth()

  // In demo mode, always allow access
  if (!isAuthenticated && !user) {
    // For demo purposes, allow access without authentication
    return <>{children}</>
  }

  // If authenticated, check if user has partner permissions
  // For now, we'll assume all authenticated users can access partner features
  return <>{children}</>
} 
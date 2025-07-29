'use client'

import React from 'react'


interface AdminAuthProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AdminAuth({ children }: AdminAuthProps) {

  // In demo mode, always allow access to admin features
  return <>{children}</>
} 
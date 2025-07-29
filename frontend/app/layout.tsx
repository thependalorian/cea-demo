// This layout ensures that only protected routes are wrapped in AuthLayout.
// The home page ("/"), login, signup, forgot/reset password, and other public pages are NOT wrapped in AuthLayout.
// This allows the home page and auth pages to remain public, while protecting dashboard, profile, and other private routes.
import React from 'react'
import { Inter, Open_Sans } from 'next/font/google'
import './globals.css'
import ClientLayout from '@/components/layouts/ClientLayout'
import { AccessibilityProvider } from '@/components/AccessibilityProvider'
import AccessibilityMenu from '@/components/AccessibilityMenu'
import ClientAuthProvider from '@/components/ClientAuthProvider'
// We import logEnvironmentStatus but don't call it here since this is a server component
// It will be used in a client component that runs on startup
import { logEnvironmentStatus } from '@/lib/env'

// Log environment status on server during build (will not run in client)
if (typeof window === 'undefined') {
  // Only log in development or when explicitly enabled
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEBUG_ENV === 'true') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('@/lib/env').logEnvironmentStatus();
    } catch (e) {
      console.error('Failed to validate environment variables on server:', e);
    }
  }
}

// Load fonts
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

// Use Open Sans as a replacement for Helvetica Neue
const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-helvetica-neue',
  display: 'swap'
})

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://cea.georgenekwaya.com'),
  title: {
    default: 'Climate Economy Assistant - AI-Powered Clean Energy Careers',
    template: '%s | Climate Economy Assistant'
  },
  description: 'Connect with clean energy opportunities through AI-powered career guidance. Perfect for veterans and job seekers entering the climate economy.',
  keywords: 'clean energy careers, climate jobs, AI career guidance, veterans, job matching, resume analysis',
  authors: [{ name: 'Climate Economy Assistant Team' }],
  creator: 'Climate Economy Assistant',
  publisher: 'Alliance for Climate Transition',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://cea.georgenekwaya.com',
    siteName: 'Climate Economy Assistant',
    title: 'Climate Economy Assistant - AI-Powered Clean Energy Careers',
    description: 'Connect with clean energy opportunities through AI-powered career guidance.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Climate Economy Assistant',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Climate Economy Assistant - AI-Powered Clean Energy Careers',
    description: 'Connect with clean energy opportunities through AI-powered career guidance.',
    images: ['/og-image.jpg'],
    creator: '@ClimateEconAI',
  },
  verification: {
    google: 'your-google-verification-code',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" data-theme="act-light" className="scroll-smooth">
      <head>
        <link rel="canonical" href="https://cea.georgenekwaya.com" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#B2DE26" />
      </head>
      <body className={`${inter.variable} ${openSans.variable} font-body antialiased`}>
        <ClientAuthProvider>
          <AccessibilityProvider>
            <a href="#main-content" className="skip-link">
              Skip to main content
            </a>
            <ClientLayout>
              <main id="main-content">
                {children}
              </main>
            </ClientLayout>
            <AccessibilityMenu />
          </AccessibilityProvider>
        </ClientAuthProvider>
      </body>
    </html>
  )
} 
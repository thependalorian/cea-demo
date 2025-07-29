/**
 * ClientLayout - Main Application Layout
 * 
 * Purpose: Primary layout wrapper with navigation, role-based theming, and ACT branding
 * Location: /app/components/layouts/ClientLayout.tsx
 * Used by: Main layout.tsx as the app wrapper
 * 
 * Features:
 * - ACT (Alliance for Climate Transition) brand identity
 * - Role-based navigation (job seeker, partner, admin)
 * - Massachusetts-focused clean energy messaging
 * - Responsive design with mobile hamburger menu
 * - Accessibility features and skip links
 * - Environment validation
 */

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import EnvValidator from '@/components/EnvValidator';
import DemoModeBanner from '@/components/DemoModeBanner';
import { useAuth } from '../../hooks/useAuth';

interface ClientLayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: string;
  description?: string;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Connect to authentication context - using the actual useAuth hook
  const { isAuthenticated, profileType } = useAuth();
  // Using type assertion to fix TypeScript errors with switch statements
  const userRole = profileType as ('job_seeker' | 'partner' | 'admin' | null);

  // Role-based navigation configurations
  const getNavigationItems = (): NavigationItem[] => {
    if (!isAuthenticated) {
      return [
        { name: 'Home', href: '/', icon: '', description: 'Massachusetts climate economy hub' },
        { name: 'About', href: '/about', icon: '', description: 'Alliance for Climate Transition' },
        { name: 'Features', href: '/features', icon: '', description: 'AI-powered career tools' },
        { name: 'Pricing', href: '/pricing', icon: '', description: 'Massachusetts workforce pricing' },
        { name: 'Help', href: '/help', icon: '', description: 'Support and documentation' },
        { name: 'Terms', href: '/terms', icon: '', description: 'Terms of service' },
        { name: 'Privacy', href: '/privacy', icon: '', description: 'Privacy policy' },
        // Core functionality - all accessible in demo mode
        { name: 'Chat', href: '/chat', icon: '', description: 'AI Career Assistant with OpenAI API' },
        { name: 'Jobs', href: '/jobs', icon: '', description: 'Massachusetts clean energy opportunities' },
        { name: 'Resources', href: '/resources', icon: '', description: 'Training and career guides' },
        { name: 'Booking', href: '/booking', icon: '', description: 'Schedule career guidance' },
        { name: 'Partners', href: '/partners', icon: '', description: 'Partner organizations' },
        // Demo access navigation - ALL pages accessible
        { name: 'User Dashboard', href: '/dashboard', icon: '', description: 'Job Seeker Dashboard Demo' },
        { name: 'User Analytics', href: '/dashboard/analytics', icon: '', description: 'Job Seeker Analytics Demo' },
        { name: 'User Profile', href: '/profile', icon: '', description: 'User Profile Demo' },
        { name: 'User Settings', href: '/settings', icon: '', description: 'User Settings Demo' },
        { name: 'Partner Dashboard', href: '/partner/dashboard', icon: '', description: 'Employer Dashboard Demo' },
        { name: 'Partner Jobs', href: '/partner/jobs', icon: '', description: 'Partner Job Management Demo' },
        { name: 'Partner Candidates', href: '/partner/candidates', icon: '', description: 'Candidate Management Demo' },
        { name: 'Partner Analytics', href: '/partner/analytics', icon: '', description: 'Partner Analytics Demo' },
        { name: 'Partner Profile', href: '/partner/profile', icon: '', description: 'Partner Profile Demo' },
        { name: 'Admin Dashboard', href: '/admin', icon: '', description: 'Admin Dashboard Demo' },
        { name: 'Admin Users', href: '/admin/users', icon: '', description: 'User Management Demo' },
        { name: 'Admin Content', href: '/admin/content', icon: '', description: 'Content Moderation Demo' },
        { name: 'Admin Analytics', href: '/admin/analytics', icon: '', description: 'System Analytics Demo' },
        { name: 'Admin Resources', href: '/admin/resources', icon: '', description: 'Resource Management Demo' },
        { name: 'Admin Jobs', href: '/admin/jobs', icon: '', description: 'Job Management Demo' },
        { name: 'Admin Partners', href: '/admin/partners', icon: '', description: 'Partner Management Demo' },
        { name: 'Admin Profile', href: '/admin/profile', icon: '', description: 'Admin Profile Demo' },
        { name: 'Admin Settings', href: '/admin/settings', icon: '', description: 'Admin Settings Demo' },
        // Resource pages - all accessible
        { name: 'Training', href: '/resources/training', icon: '', description: 'Training programs' },
        { name: 'Career Guides', href: '/resources/career-guides', icon: '', description: 'Career guidance' },
        { name: 'Events', href: '/resources/events', icon: '', description: 'Upcoming events' },
        { name: 'Job Data', href: '/resources/job-data', icon: '', description: 'Job market data' },
        { name: 'Veterans', href: '/resources/veterans', icon: '', description: 'Veteran resources' },
        { name: 'Reports', href: '/resources/reports', icon: '', description: 'Industry reports' },
        // Auth pages - all accessible in demo mode
        { name: 'Login', href: '/auth/login', icon: '', description: 'User login' },
        { name: 'Admin Login', href: '/auth/login/admin', icon: '', description: 'Admin login' },
        { name: 'Signup', href: '/auth/signup', icon: '', description: 'User registration' },
        { name: 'Job Seeker Signup', href: '/auth/signup/job-seeker', icon: '', description: 'Job seeker registration' },
        { name: 'Partner Signup', href: '/auth/signup/partner', icon: '', description: 'Partner registration' },
        { name: 'Signout', href: '/auth/signout', icon: '', description: 'Sign out' },
      ];
    }

    const baseItems: NavigationItem[] = [
      { name: 'Dashboard', href: '/dashboard', icon: '', description: 'Your main dashboard' },
      { name: 'Chat', href: '/chat', icon: '', description: 'AI Career Assistant' },
      { name: 'Jobs', href: '/jobs', icon: '', description: 'Browse opportunities' },
      { name: 'Resources', href: '/resources', icon: '', description: 'Training resources' },
      { name: 'Booking', href: '/booking', icon: '', description: 'Schedule career guidance' },
      { name: 'Settings', href: '/settings', icon: '', description: 'Account settings' },
    ];

    // Using type guard to fix TypeScript error
    if (userRole === 'partner') {
      return [
        ...baseItems,
        { name: 'Partner Dashboard', href: '/partner/dashboard', icon: '', description: 'Employer dashboard' },
        { name: 'Job Listings', href: '/partner/jobs', icon: '', description: 'Manage job postings' },
        { name: 'Candidates', href: '/partner/candidates', icon: '', description: 'Browse candidates' },
        { name: 'Analytics', href: '/partner/analytics', icon: '', description: 'Hiring analytics' },
        { name: 'Profile', href: '/partner/profile', icon: '', description: 'Company profile' },
        // Additional partner pages
        { name: 'Training', href: '/resources/training', icon: '', description: 'Training programs' },
        { name: 'Career Guides', href: '/resources/career-guides', icon: '', description: 'Career guidance' },
        { name: 'Events', href: '/resources/events', icon: '', description: 'Upcoming events' },
        { name: 'Job Data', href: '/resources/job-data', icon: '', description: 'Job market data' },
        { name: 'Veterans', href: '/resources/veterans', icon: '', description: 'Veteran resources' },
        { name: 'Reports', href: '/resources/reports', icon: '', description: 'Industry reports' },
      ];
    }
    
    if (userRole === 'admin') {
      return [
        ...baseItems,
        { name: 'Admin Panel', href: '/admin', icon: '', description: 'Admin dashboard' },
        { name: 'Users', href: '/admin/users', icon: '', description: 'User management' },
        { name: 'Content', href: '/admin/content', icon: '', description: 'Content moderation' },
        { name: 'Analytics', href: '/admin/analytics', icon: '', description: 'System analytics' },
        { name: 'Resources', href: '/admin/resources', icon: '', description: 'Resource management' },
        { name: 'Jobs', href: '/admin/jobs', icon: '', description: 'Job management' },
        { name: 'Partners', href: '/admin/partners', icon: '', description: 'Partner management' },
        { name: 'Profile', href: '/admin/profile', icon: '', description: 'Admin profile' },
        { name: 'Settings', href: '/admin/settings', icon: '', description: 'Admin settings' },
        // Additional admin pages
        { name: 'Training', href: '/resources/training', icon: '', description: 'Training programs' },
        { name: 'Career Guides', href: '/resources/career-guides', icon: '', description: 'Career guidance' },
        { name: 'Events', href: '/resources/events', icon: '', description: 'Upcoming events' },
        { name: 'Job Data', href: '/resources/job-data', icon: '', description: 'Job market data' },
        { name: 'Veterans', href: '/resources/veterans', icon: '', description: 'Veteran resources' },
        { name: 'Reports', href: '/resources/reports', icon: '', description: 'Industry reports' },
      ];
    }
    
    // Default case (job_seeker)
    return [
      ...baseItems,
      { name: 'Profile', href: '/profile', icon: '', description: 'Your profile' },
      { name: 'Analytics', href: '/dashboard/analytics', icon: '', description: 'Your analytics' },
      // Additional job seeker pages
      { name: 'Training', href: '/resources/training', icon: '', description: 'Training programs' },
      { name: 'Career Guides', href: '/resources/career-guides', icon: '', description: 'Career guidance' },
      { name: 'Events', href: '/resources/events', icon: '', description: 'Upcoming events' },
      { name: 'Job Data', href: '/resources/job-data', icon: '', description: 'Job market data' },
      { name: 'Veterans', href: '/resources/veterans', icon: '', description: 'Veteran resources' },
      { name: 'Reports', href: '/resources/reports', icon: '', description: 'Industry reports' },
    ];
  };

  // Get theme class based on user role
  const getThemeClass = (): string => {
    if (userRole === 'partner') {
      return 'act-theme-partner';
    }
    if (userRole === 'admin') {
      return 'act-theme-admin';
    }
    return 'act-theme-jobseeker';
  };

  const navigationItems = getNavigationItems();
  const currentTheme = getThemeClass();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className={`min-h-screen bg-base-100 ${currentTheme}`}>
      {/* Environment validation - invisible component */}
      <EnvValidator />
      
      {/* Demo Mode Banner */}
      <DemoModeBanner />
      
      {/* Main Navigation Header */}
      <header className="navbar bg-base-100 shadow-lg border-b border-base-300 sticky top-0 z-50">
        <div className="navbar-start">
          {/* Mobile menu button */}
          <div className="dropdown lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-ghost btn-square"
              aria-label="Open navigation menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>

          {/* ACT Logo and Branding */}
          <Link href="/" className="btn btn-ghost normal-case text-xl font-bold">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-spring-green to-moss-green rounded-lg flex items-center justify-center animate-gentle-pulse">
                <span className="text-midnight-forest font-bold text-sm">ACT</span>
              </div>
              <div className="hidden sm:block">
                <div className="text-midnight-forest font-title">Climate Economy</div>
                <div className="text-xs text-moss-green -mt-1">Massachusetts Assistant</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-2">
            {navigationItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`btn btn-ghost btn-sm normal-case ${
                    pathname === item.href 
                      ? 'bg-spring-green/20 text-midnight-forest border-spring-green/30' 
                      : 'hover:bg-moss-green/10'
                  }`}
                  title={item.description}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* User Actions */}
        <div className="navbar-end gap-2">
          {isAuthenticated ? (
            <>
              {/* Settings/Profile Dropdown */}
              <div className="dropdown dropdown-end">
                <button className="btn btn-ghost btn-circle avatar">
                  <div className="w-8 rounded-full bg-spring-green/20 flex items-center justify-center">
                    <span className="text-midnight-forest font-bold text-sm">
                      {userRole === 'partner' ? 'P' : userRole === 'admin' ? 'A' : 'U'}
                    </span>
                  </div>
                </button>
                <ul className="mt-3 z-[1] p-2 shadow-lg menu dropdown-content bg-base-100 rounded-box w-52 border border-base-300">
                  <li><Link href="/profile">Profile</Link></li>
                  <li><Link href="/settings">Settings</Link></li>
                  <li><hr className="my-2" /></li>
                  <li><button className="text-error">Sign Out</button></li>
                </ul>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="btn btn-ghost btn-sm normal-case text-moss-green hover:bg-moss-green/10"
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-primary btn-sm normal-case shadow-button hover:shadow-hover"
              >
                Join ACT
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed top-16 left-0 right-0 bg-base-100 border-b border-base-300 z-50 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <ul className="menu p-4 gap-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 p-3 rounded-lg ${
                      pathname === item.href 
                        ? 'bg-spring-green/20 text-midnight-forest border border-spring-green/30' 
                        : 'hover:bg-moss-green/10'
                    }`}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      {item.description && (
                        <div className="text-xs text-base-content/60">{item.description}</div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-base-300 text-base-content">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <div className="w-6 h-6 bg-gradient-to-br from-spring-green to-moss-green rounded mr-2"></div>
                Climate Economy Assistant
              </h3>
              <p className="text-sm text-base-content/70 mb-4">
                AI-powered career guidance for Massachusetts' growing clean energy sector.
              </p>
                             <div className="text-xs text-base-content/60">
                 <p className="mb-1"><strong>Demo Mode Active</strong></p>
                 <p>Explore all features without registration</p>
               </div>
            </div>

            {/* Demo Navigation */}
            <div>
              <h4 className="font-semibold mb-4">Try Different Perspectives</h4>
              <ul className="space-y-2 text-sm">
                                 <li>
                   <Link href="/dashboard" className="text-blue-600 hover:underline flex items-center">
                     Job Seeker Dashboard
                   </Link>
                 </li>
                 <li>
                   <Link href="/partner/dashboard" className="text-blue-600 hover:underline flex items-center">
                     Partner Dashboard
                   </Link>
                 </li>
                 <li>
                   <Link href="/admin" className="text-blue-600 hover:underline flex items-center">
                     Admin Dashboard
                   </Link>
                 </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-semibold mb-4">Explore Features</h4>
              <ul className="space-y-2 text-sm">
                                 <li>
                   <Link href="/chat" className="text-base-content/70 hover:text-base-content flex items-center">
                     AI Chat Assistant
                   </Link>
                 </li>
                 <li>
                   <Link href="/jobs" className="text-base-content/70 hover:text-base-content flex items-center">
                     Job Opportunities
                   </Link>
                 </li>
                 <li>
                   <Link href="/resources" className="text-base-content/70 hover:text-base-content flex items-center">
                     Career Resources
                   </Link>
                 </li>
                 <li>
                   <Link href="/booking" className="text-base-content/70 hover:text-base-content flex items-center">
                     Book Consultation
                   </Link>
                 </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-semibold mb-4">Need Help?</h4>
                             <div className="text-sm space-y-2">
                 <p className="text-base-content/70">
                   <strong>Chat requires OpenAI API key</strong>
                 </p>
                <p className="text-xs text-base-content/60">
                  Get your API key from{' '}
                  <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    OpenAI Platform
                  </a>
                </p>
                <div className="mt-4">
                  <Link href="/about" className="text-base-content/70 hover:text-base-content">
                    About this Demo
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-base-content/10 mt-8 pt-8 text-center">
            <p className="text-sm text-base-content/60">
              © 2024 Alliance for Climate Transition • Massachusetts Climate Economy Assistant Demo
            </p>
            <p className="text-xs text-base-content/50 mt-1">
              Built with Next.js • Powered by OpenAI • Demo Mode Active
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
} 
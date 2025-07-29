'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function DemoModeBanner() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-gradient-to-r from-spring-green/20 via-moss-green/20 to-emerald/20 border-b border-spring-green/30">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-spring-green rounded-full flex items-center justify-center">
                <span className="text-midnight-forest font-bold text-sm">CEA</span>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-midnight-forest">
                Climate Economy Assistant - Demo Mode
              </h3>
              <p className="text-xs text-moss-green">
                Explore all features without authentication. Chat requires your OpenAI API key.
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-midnight-forest hover:text-moss-green underline"
            >
              {isExpanded ? 'Hide Guide' : 'Show Navigation Guide'}
            </button>
          </div>
        </div>
        
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-spring-green/20">
            <div className="grid md:grid-cols-4 gap-4 text-xs">
              {/* Core Features */}
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-midnight-forest">Core Features</h4>
                </div>
                <p className="text-moss-green mb-2">
                  Essential platform functionality for all users.
                </p>
                <div className="space-y-1">
                  <Link href="/chat" className="block text-blue-600 hover:underline">
                    • AI Chat Assistant
                  </Link>
                  <Link href="/jobs" className="block text-blue-600 hover:underline">
                    • Job Opportunities
                  </Link>
                  <Link href="/resources" className="block text-blue-600 hover:underline">
                    • Resources Hub
                  </Link>
                  <Link href="/booking" className="block text-blue-600 hover:underline">
                    • Career Consultation
                  </Link>
                  <Link href="/partners" className="block text-blue-600 hover:underline">
                    • Partner Organizations
                  </Link>
                </div>
              </div>

              {/* Job Seeker Demo */}
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-midnight-forest">Job Seeker Demo</h4>
                </div>
                <p className="text-moss-green mb-2">
                  Experience the complete job seeker journey.
                </p>
                <div className="space-y-1">
                  <Link href="/dashboard" className="block text-blue-600 hover:underline">
                    • Personal Dashboard
                  </Link>
                  <Link href="/dashboard/analytics" className="block text-blue-600 hover:underline">
                    • User Analytics
                  </Link>
                  <Link href="/profile" className="block text-blue-600 hover:underline">
                    • Profile Management
                  </Link>
                  <Link href="/profile/setup" className="block text-blue-600 hover:underline">
                    • Profile Setup
                  </Link>
                  <Link href="/profile/resume" className="block text-blue-600 hover:underline">
                    • Resume Management
                  </Link>
                  <Link href="/settings" className="block text-blue-600 hover:underline">
                    • User Settings
                  </Link>
                </div>
              </div>
              
              {/* Partner Demo */}
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-midnight-forest">Partner Demo</h4>
                </div>
                <p className="text-moss-green mb-2">
                  Complete employer and partner experience.
                </p>
                <div className="space-y-1">
                  <Link href="/partner/dashboard" className="block text-blue-600 hover:underline">
                    • Partner Dashboard
                  </Link>
                  <Link href="/partner/jobs" className="block text-blue-600 hover:underline">
                    • Job Management
                  </Link>
                  <Link href="/partner/candidates" className="block text-blue-600 hover:underline">
                    • Candidate Pipeline
                  </Link>
                  <Link href="/partner/analytics" className="block text-blue-600 hover:underline">
                    • Hiring Analytics
                  </Link>
                  <Link href="/partner/profile" className="block text-blue-600 hover:underline">
                    • Partner Profile
                  </Link>
                </div>
              </div>
              
              {/* Admin Demo */}
              <div className="bg-white/50 rounded-lg p-3">
                <div className="flex items-center space-x-2 mb-2">
                  <h4 className="font-semibold text-midnight-forest">Admin Demo</h4>
                </div>
                <p className="text-moss-green mb-2">
                  Complete platform administration experience.
                </p>
                <div className="space-y-1">
                  <Link href="/admin" className="block text-blue-600 hover:underline">
                    • Admin Dashboard
                  </Link>
                  <Link href="/admin/users" className="block text-blue-600 hover:underline">
                    • User Management
                  </Link>
                  <Link href="/admin/content" className="block text-blue-600 hover:underline">
                    • Content Moderation
                  </Link>
                  <Link href="/admin/analytics" className="block text-blue-600 hover:underline">
                    • System Analytics
                  </Link>
                  <Link href="/admin/resources" className="block text-blue-600 hover:underline">
                    • Resource Management
                  </Link>
                  <Link href="/admin/jobs" className="block text-blue-600 hover:underline">
                    • Job Management
                  </Link>
                  <Link href="/admin/partners" className="block text-blue-600 hover:underline">
                    • Partner Management
                  </Link>
                  <Link href="/admin/profile" className="block text-blue-600 hover:underline">
                    • Admin Profile
                  </Link>
                  <Link href="/admin/settings" className="block text-blue-600 hover:underline">
                    • Admin Settings
                  </Link>
                </div>
              </div>
            </div>

            {/* Additional Pages */}
            <div className="mt-4 pt-3 border-t border-spring-green/20">
              <div className="grid md:grid-cols-3 gap-4 text-xs">
                {/* Resource Pages */}
                <div className="bg-white/50 rounded-lg p-3">
                  <h4 className="font-semibold text-midnight-forest mb-2">Resource Pages</h4>
                  <div className="space-y-1">
                    <Link href="/resources/training" className="block text-blue-600 hover:underline">
                      • Training Programs
                    </Link>
                    <Link href="/resources/career-guides" className="block text-blue-600 hover:underline">
                      • Career Guides
                    </Link>
                    <Link href="/resources/events" className="block text-blue-600 hover:underline">
                      • Events
                    </Link>
                    <Link href="/resources/job-data" className="block text-blue-600 hover:underline">
                      • Job Market Data
                    </Link>
                    <Link href="/resources/veterans" className="block text-blue-600 hover:underline">
                      • Veteran Resources
                    </Link>
                    <Link href="/resources/reports" className="block text-blue-600 hover:underline">
                      • Industry Reports
                    </Link>
                  </div>
                </div>

                {/* Auth Pages */}
                <div className="bg-white/50 rounded-lg p-3">
                  <h4 className="font-semibold text-midnight-forest mb-2">Auth Pages</h4>
                  <div className="space-y-1">
                    <Link href="/auth/login" className="block text-blue-600 hover:underline">
                      • User Login
                    </Link>
                    <Link href="/auth/login/admin" className="block text-blue-600 hover:underline">
                      • Admin Login
                    </Link>
                    <Link href="/auth/signup" className="block text-blue-600 hover:underline">
                      • User Signup
                    </Link>
                    <Link href="/auth/signup/job-seeker" className="block text-blue-600 hover:underline">
                      • Job Seeker Signup
                    </Link>
                    <Link href="/auth/signup/partner" className="block text-blue-600 hover:underline">
                      • Partner Signup
                    </Link>
                    <Link href="/auth/signout" className="block text-blue-600 hover:underline">
                      • Sign Out
                    </Link>
                  </div>
                </div>

                {/* Info Pages */}
                <div className="bg-white/50 rounded-lg p-3">
                  <h4 className="font-semibold text-midnight-forest mb-2">Info Pages</h4>
                  <div className="space-y-1">
                    <Link href="/about" className="block text-blue-600 hover:underline">
                      • About ACT
                    </Link>
                    <Link href="/features" className="block text-blue-600 hover:underline">
                      • Features
                    </Link>
                    <Link href="/pricing" className="block text-blue-600 hover:underline">
                      • Pricing
                    </Link>
                    <Link href="/help" className="block text-blue-600 hover:underline">
                      • Help
                    </Link>
                    <Link href="/terms" className="block text-blue-600 hover:underline">
                      • Terms
                    </Link>
                    <Link href="/privacy" className="block text-blue-600 hover:underline">
                      • Privacy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Key Features */}
            <div className="mt-4 pt-3 border-t border-spring-green/20">
              <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Chat with AI Assistant (requires OpenAI API key)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Browse all Massachusetts clean energy resources</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Explore ALL features without registration</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Test ALL user role interfaces (Job Seeker, Partner, Admin)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Access ALL dashboards and analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>View ALL authentication flows</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600">•</span>
                  <span>Explore ALL resource pages and guides</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 
import React from 'react'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Massachusetts Clean Energy Resources - Climate Economy Assistant',
  description: 'Access comprehensive Massachusetts clean energy resources, training programs, career guides, and local events to advance your career in the Commonwealth\'s growing climate economy.',
  keywords: 'Massachusetts clean energy resources, MassCEC programs, clean energy training, Massachusetts climate economy, clean energy careers'
};

export default function ResourcesPage() {
  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-midnight-forest mb-6">
            Massachusetts Clean Energy <span className="text-spring-green">Resources</span>
          </h1>
          <p className="text-xl text-moss-green mb-8">
            Expert guidance and tools to help you succeed in the Commonwealth's growing climate economy with 42,000+ new jobs by 2030
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#training" className="bg-moss-green text-white hover:bg-midnight-forest py-3 px-6 rounded-md transition-colors">
              Training Programs
            </Link>
            <Link href="#guides" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors">
              Career Guides
            </Link>
            <Link href="#events" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors">
              Local Events
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Resources */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Featured Massachusetts Resources</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* MassCEC Clean Energy Report */}
            <div className="bg-sand-gray rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-spring-green/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-spring-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full mb-2">Industry Report</div>
                <h3 className="text-xl font-bold text-midnight-forest mb-2">2024 Massachusetts Clean Energy Job Market Report</h3>
                <p className="text-moss-green mb-4">
                  Comprehensive analysis of hiring trends, salary data, and growth projections across Massachusetts' clean energy sectors. Includes detailed breakdowns for Greater Boston, Western MA, South Coast, and other regions, with offshore wind showing 128% growth by 2030.
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-moss-green/70">Updated: March 2024</span>
                  <Link href="/resources/reports/massachusetts-job-market" className="inline-flex items-center text-spring-green hover:underline">
                    Read Report
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>

            {/* Massachusetts Skills Guide */}
            <div className="bg-sand-gray rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-moss-green/20 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-moss-green/10 text-moss-green text-sm rounded-full mb-2">Skills Guide</div>
                <h3 className="text-xl font-bold text-midnight-forest mb-2">Top 10 In-Demand Massachusetts Clean Energy Skills</h3>
                <p className="text-moss-green mb-4">
                  Essential skills Massachusetts employers are looking for in 2024, with local training resources to develop each skill. Based on interviews with 175+ Massachusetts clean energy employers and MassCEC workforce data.
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-moss-green/70">15 min read</span>
                  <Link href="/resources/skills/massachusetts-top-skills" className="inline-flex items-center text-spring-green hover:underline">
                    Learn More
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massachusetts Training Programs */}
      <section id="training" className="py-16 bg-sand-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-4">MassCEC Training Programs</h2>
          <p className="text-center text-moss-green max-w-3xl mx-auto mb-12">
            State-approved training programs to help you build the skills needed for Massachusetts' clean energy workforce
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Training Program 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-midnight-forest mb-3">Offshore Wind Technician Training</h3>
              <p className="text-moss-green mb-4">
                MassCEC-funded program at Massachusetts Maritime Academy. Earn GWO certification for offshore wind careers with starting salaries of $65K-$85K. Part of Massachusetts' commitment to 5,600 MW offshore wind development.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1 border border-spring-green/30 text-moss-green text-sm rounded-full">New Bedford</div>
                <div className="px-3 py-1 border border-spring-green/30 text-moss-green text-sm rounded-full">8 weeks</div>
                <div className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">Scholarships Available</div>
              </div>
              <Link href="/resources/training/offshore-wind-technician" className="inline-block w-full text-center bg-moss-green text-white hover:bg-midnight-forest py-2 px-4 rounded-md transition-colors">
                Program Details
              </Link>
            </div>

            {/* Training Program 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-midnight-forest mb-3">Clean Energy Certificate Program</h3>
              <p className="text-moss-green mb-4">
                Greenfield Community College's comprehensive program covering solar, energy efficiency, and grid modernization. Designed specifically for Western Massachusetts' growing clean energy sector with 86% job placement rate.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1 border border-spring-green/30 text-moss-green text-sm rounded-full">Greenfield</div>
                <div className="px-3 py-1 border border-spring-green/30 text-moss-green text-sm rounded-full">16 weeks</div>
                <div className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">College Credit</div>
              </div>
              <Link href="/resources/training/clean-energy-certificate" className="inline-block w-full text-center bg-moss-green text-white hover:bg-midnight-forest py-2 px-4 rounded-md transition-colors">
                Program Details
              </Link>
            </div>

            {/* Training Program 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-midnight-forest mb-3">Building Decarbonization Training</h3>
              <p className="text-moss-green mb-4">
                Specialized training for contractors on heat pump installation and building electrification techniques. Aligned with Massachusetts' goal of 1 million electrified homes by 2030 and Mass Save incentive programs.
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                <div className="px-3 py-1 border border-spring-green/30 text-moss-green text-sm rounded-full">Multiple Locations</div>
                <div className="px-3 py-1 border border-spring-green/30 text-moss-green text-sm rounded-full">4 weeks</div>
                <div className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">Mass Save Partner</div>
              </div>
              <Link href="/resources/training/building-decarbonization" className="inline-block w-full text-center bg-moss-green text-white hover:bg-midnight-forest py-2 px-4 rounded-md transition-colors">
                Program Details
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/resources/training/massachusetts" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors inline-flex items-center">
              View All Massachusetts Training Programs
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Massachusetts Career Guides */}
      <section id="guides" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-4">Massachusetts Career Resources</h2>
          <p className="text-center text-moss-green max-w-3xl mx-auto mb-12">
            Expert guides to help you navigate the Commonwealth's clean energy economy
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Guide 1 */}
            <div className="bg-sand-gray rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-spring-green/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-spring-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg text-center text-midnight-forest mb-3">Massachusetts Clean Energy Incentives Guide</h3>
              <p className="text-center text-moss-green mb-4">
                Comprehensive overview of state incentives, rebates, and tax credits for clean energy careers. Includes MassCEC, DOER, and Mass Save programs.
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/resources/guides/massachusetts-incentives" className="inline-flex items-center text-spring-green hover:underline">
                  Read Guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Guide 2 */}
            <div className="bg-sand-gray rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg text-center text-midnight-forest mb-3">Massachusetts Certification Directory</h3>
              <p className="text-center text-moss-green mb-4">
                Complete guide to Massachusetts-recognized clean energy certifications and credentials, with local training providers and costs.
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/resources/guides/massachusetts-certifications" className="inline-flex items-center text-spring-green hover:underline">
                  Read Guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Guide 3 */}
            <div className="bg-sand-gray rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-spring-green/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-spring-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg text-center text-midnight-forest mb-3">Massachusetts Climate Policy Timeline</h3>
              <p className="text-center text-moss-green mb-4">
                Key Massachusetts climate policies and their impact on clean energy job growth through 2030, including the Clean Energy and Climate Plan.
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/resources/guides/massachusetts-policy-timeline" className="inline-flex items-center text-spring-green hover:underline">
                  Read Guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Guide 4 */}
            <div className="bg-sand-gray rounded-lg shadow-md p-6">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <h3 className="font-bold text-lg text-center text-midnight-forest mb-3">Career Transition Guide for Massachusetts Workers</h3>
              <p className="text-center text-moss-green mb-4">
                Step-by-step guide for transitioning from traditional industries to clean energy in Massachusetts, with success stories and salary data.
              </p>
              <div className="flex justify-center mt-4">
                <Link href="/resources/guides/massachusetts-career-transition" className="inline-flex items-center text-spring-green hover:underline">
                  Read Guide
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massachusetts Events */}
      <section id="events" className="py-16 bg-sand-gray">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-4">Massachusetts Clean Energy Events</h2>
          <p className="text-center text-moss-green max-w-3xl mx-auto mb-12">
            Networking opportunities and industry events across the Commonwealth
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Event 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">Networking</div>
                <div className="bg-sand-gray px-3 py-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-moss-green">APR</div>
                  <div className="text-2xl font-bold text-midnight-forest">15</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Massachusetts Clean Energy Networking Night</h3>
              <p className="text-moss-green mb-2">
                Connect with leading Massachusetts clean energy employers and professionals. Hosted by ACT and MassCEC with 25+ employers attending.
              </p>
              <p className="text-sm font-medium text-moss-green/80 mb-4">
                Greentown Labs, Somerville • 6:00 PM - 8:30 PM
              </p>
              <Link href="/resources/events/networking-night" className="inline-block w-full text-center bg-moss-green text-white hover:bg-midnight-forest py-2 px-4 rounded-md transition-colors">
                Register
              </Link>
            </div>

            {/* Event 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-moss-green/10 text-moss-green text-sm rounded-full">Conference</div>
                <div className="bg-sand-gray px-3 py-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-moss-green">MAY</div>
                  <div className="text-2xl font-bold text-midnight-forest">3-4</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Massachusetts Offshore Wind Conference</h3>
              <p className="text-moss-green mb-2">
                Annual gathering of Massachusetts' offshore wind industry with job fair featuring Vineyard Wind, Mayflower Wind, and other leading developers.
              </p>
              <p className="text-sm font-medium text-moss-green/80 mb-4">
                New Bedford Marine Commerce Terminal • 9:00 AM - 5:00 PM
              </p>
              <Link href="/resources/events/offshore-wind-conference" className="inline-block w-full text-center bg-moss-green text-white hover:bg-midnight-forest py-2 px-4 rounded-md transition-colors">
                Register
              </Link>
            </div>

            {/* Event 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">Workshop</div>
                <div className="bg-sand-gray px-3 py-2 rounded-lg text-center">
                  <div className="text-lg font-bold text-moss-green">MAY</div>
                  <div className="text-2xl font-bold text-midnight-forest">18</div>
                </div>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Clean Energy Resume Workshop</h3>
              <p className="text-moss-green mb-2">
                Free resume review and career coaching with Massachusetts clean energy employers. Sponsored by MassCEC and Worcester Clean Tech Incubator.
              </p>
              <p className="text-sm font-medium text-moss-green/80 mb-4">
                Worcester CleanTech Incubator • 10:00 AM - 2:00 PM
              </p>
              <Link href="/resources/events/resume-workshop" className="inline-block w-full text-center bg-moss-green text-white hover:bg-midnight-forest py-2 px-4 rounded-md transition-colors">
                Register
              </Link>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/resources/events/massachusetts" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors inline-flex items-center">
              View All Massachusetts Events
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-midnight-forest mb-6">
            Ready to Join Massachusetts' Clean Energy Workforce?
          </h2>
          <p className="text-xl text-moss-green mb-8">
            Create your profile to get personalized Massachusetts clean energy resources and job matches. Access 42,000+ new clean energy jobs by 2030.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-moss-green text-white hover:bg-midnight-forest py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center">
              Create Your Profile
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/chat" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center">
              Chat with an Advisor
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Massachusetts Impact Stats */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Massachusetts Clean Energy Impact</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-spring-green mb-2">42K+</div>
              <p className="text-moss-green">New clean energy jobs by 2030</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-spring-green mb-2">$78.5K</div>
              <p className="text-moss-green">Average clean energy salary</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-spring-green mb-2">250+</div>
              <p className="text-moss-green">Massachusetts employer partners</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-spring-green mb-2">45</div>
              <p className="text-moss-green">Educational institution partners</p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Link href="/about" className="text-spring-green hover:underline inline-flex items-center">
              Learn more about the Alliance for Climate Transition
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Help Center - Massachusetts Climate Economy Assistant',
  description: 'Find answers to common questions about using the Climate Economy Assistant for your Massachusetts clean energy career advancement.',
  keywords: 'Massachusetts clean energy help, climate economy support, MassCEC resources, clean energy career help, ACT platform support, FAQ'
}

export default function Help() {
  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-midnight-forest mb-6">Massachusetts Climate Economy Help Center</h1>
          <p className="text-xl text-moss-green mb-8">
            Find answers to common questions about advancing your clean energy career in Massachusetts
          </p>
          <div className="max-w-md mx-auto">
            <input 
              type="text" 
              placeholder="Search for Massachusetts clean energy resources..." 
              className="w-full px-4 py-3 rounded-lg border border-sand-gray focus:outline-none focus:ring-2 focus:ring-spring-green"
            />
          </div>
        </div>
      </section>

      {/* Quick Help Categories */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-midnight-forest text-center mb-12">Massachusetts Clean Energy Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-sand-gray rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Getting Started</h3>
              <p className="text-moss-green mb-4">Learn how to navigate the Massachusetts Climate Economy Assistant platform</p>
              <div className="mt-auto">
                <Link href="/help/getting-started" className="inline-flex items-center text-spring-green hover:underline">
                  View Guides
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-sand-gray rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Massachusetts Programs</h3>
              <p className="text-moss-green mb-4">Access MassCEC programs, funding opportunities, and state resources</p>
              <div className="mt-auto">
                <Link href="/help/massachusetts-programs" className="inline-flex items-center text-spring-green hover:underline">
                  Explore Programs
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-sand-gray rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">AI Career Assistant</h3>
              <p className="text-moss-green mb-4">Get the most from our Massachusetts-specific clean energy career AI</p>
              <div className="mt-auto">
                <Link href="/help/ai-assistant" className="inline-flex items-center text-spring-green hover:underline">
                  Learn More
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Massachusetts Resources Section */}
      <section className="py-16 bg-sand-gray">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-midnight-forest text-center mb-12">Massachusetts Clean Energy Resources</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-midnight-forest mb-4">State Programs & Incentives</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">MassCEC Clean Energy Internship Program</span>
                    <p className="text-moss-green text-sm">Paid internships with Massachusetts clean energy employers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Mass Save Energy Efficiency Programs</span>
                    <p className="text-moss-green text-sm">Training and career opportunities in energy efficiency</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Massachusetts Clean Energy Center</span>
                    <p className="text-moss-green text-sm">Workforce development programs and funding opportunities</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Offshore Wind Workforce Training</span>
                    <p className="text-moss-green text-sm">Specialized training for Massachusetts' growing offshore wind industry</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <Link href="/resources/massachusetts-programs" className="text-spring-green hover:underline inline-flex items-center">
                  View All Massachusetts Programs
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-midnight-forest mb-4">Educational Pathways</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Massachusetts Community Colleges</span>
                    <p className="text-moss-green text-sm">Clean energy certificate and degree programs across the state</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Technical Training Centers</span>
                    <p className="text-moss-green text-sm">Hands-on training for solar, wind, and energy efficiency careers</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Professional Certifications</span>
                    <p className="text-moss-green text-sm">Industry-recognized credentials for Massachusetts clean energy jobs</p>
                  </div>
                </li>
                <li className="flex items-start">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                  <div>
                    <span className="font-medium text-midnight-forest">Apprenticeship Programs</span>
                    <p className="text-moss-green text-sm">Earn while you learn in Massachusetts clean energy trades</p>
                  </div>
                </li>
              </ul>
              <div className="mt-4">
                <Link href="/resources/training" className="text-spring-green hover:underline inline-flex items-center">
                  Explore Educational Options
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-midnight-forest mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-moss-green">
              Common questions about the Massachusetts Climate Economy Assistant
            </p>
          </div>

          <div className="space-y-4">
            <div className="border border-sand-gray rounded-lg overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-sand-gray/30 hover:bg-sand-gray/50">
                  <span className="text-lg font-medium text-midnight-forest">How do I get started with the Massachusetts Climate Economy Assistant?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 border-t border-sand-gray">
                  <p className="text-moss-green">
                    Simply create a free account, complete your profile with your Massachusetts location and preferences, 
                    and start exploring. Upload your resume for personalized Massachusetts clean energy job matches and career guidance. 
                    Our AI assistant is specifically trained on Massachusetts clean energy careers and opportunities.
                  </p>
                </div>
              </details>
            </div>

            <div className="border border-sand-gray rounded-lg overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-sand-gray/30 hover:bg-sand-gray/50">
                  <span className="text-lg font-medium text-midnight-forest">What Massachusetts-specific resources are available?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 border-t border-sand-gray">
                  <p className="text-moss-green">
                    Our platform provides access to Massachusetts-specific clean energy job listings, training programs, 
                    MassCEC funding opportunities, local networking events, and regional career pathways. We partner with 
                    Massachusetts employers, educational institutions, and community organizations to provide the most 
                    comprehensive clean energy career resources in the Commonwealth.
                  </p>
                </div>
              </details>
            </div>

            <div className="border border-sand-gray rounded-lg overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-sand-gray/30 hover:bg-sand-gray/50">
                  <span className="text-lg font-medium text-midnight-forest">How accurate is the Massachusetts job matching?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 border-t border-sand-gray">
                  <p className="text-moss-green">
                    Our AI achieves over 90% match accuracy by analyzing your skills, experience, and preferences against 
                    real Massachusetts clean energy job requirements. We maintain direct relationships with Massachusetts 
                    employers to ensure our job matches reflect current hiring needs and regional opportunities across the Commonwealth.
                  </p>
                </div>
              </details>
            </div>

            <div className="border border-sand-gray rounded-lg overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-sand-gray/30 hover:bg-sand-gray/50">
                  <span className="text-lg font-medium text-midnight-forest">Do I need an OpenAI API key to use the AI assistant?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 border-t border-sand-gray">
                  <p className="text-moss-green">
                    In the demo version, you'll need to provide your own OpenAI API key to access the AI assistant features. 
                    This allows you to test the Massachusetts-specific career guidance capabilities. In the full production 
                    version, API keys are managed by the platform and you won't need to provide your own.
                  </p>
                </div>
              </details>
            </div>

            <div className="border border-sand-gray rounded-lg overflow-hidden">
              <details className="group">
                <summary className="flex justify-between items-center p-4 cursor-pointer bg-sand-gray/30 hover:bg-sand-gray/50">
                  <span className="text-lg font-medium text-midnight-forest">What if I need help that's not covered here?</span>
                  <span className="transition group-open:rotate-180">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="p-4 border-t border-sand-gray">
                  <p className="text-moss-green">
                    Contact our Massachusetts-based support team through the chat widget, email us at 
                    support@climateeconomyassistant.com, or use our contact form. We're familiar with the 
                    Massachusetts clean energy landscape and typically respond within 24 hours to help with 
                    your specific needs.
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Support */}
      <section className="py-20 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-midnight-forest mb-4">Still Need Help?</h2>
          <p className="text-xl text-moss-green mb-8">
            Our Massachusetts-based support team is here to help you navigate the clean energy economy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-moss-green hover:bg-midnight-forest text-white py-3 px-6 rounded-md transition-colors">
              Contact Support
            </Link>
            <Link href="/auth/signup" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </section>
      
      {/* Additional Resources */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-midnight-forest text-center mb-8">Additional Massachusetts Resources</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <a href="https://www.masscec.com" target="_blank" rel="noopener noreferrer" className="p-4 hover:bg-sand-gray/30 rounded-lg transition-colors">
              <div className="w-16 h-16 mx-auto bg-spring-green/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-moss-green font-bold">MassCEC</span>
              </div>
              <p className="text-sm text-moss-green">Massachusetts Clean Energy Center</p>
            </a>
            
            <a href="https://www.mass.gov/orgs/massachusetts-department-of-energy-resources" target="_blank" rel="noopener noreferrer" className="p-4 hover:bg-sand-gray/30 rounded-lg transition-colors">
              <div className="w-16 h-16 mx-auto bg-spring-green/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-moss-green font-bold">DOER</span>
              </div>
              <p className="text-sm text-moss-green">Department of Energy Resources</p>
            </a>
            
            <a href="https://www.masssave.com" target="_blank" rel="noopener noreferrer" className="p-4 hover:bg-sand-gray/30 rounded-lg transition-colors">
              <div className="w-16 h-16 mx-auto bg-spring-green/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-moss-green font-bold">Save</span>
              </div>
              <p className="text-sm text-moss-green">Mass Save Energy Programs</p>
            </a>
            
            <a href="https://www.mass.gov/orgs/massachusetts-clean-energy-and-climate-plan-for-2050" target="_blank" rel="noopener noreferrer" className="p-4 hover:bg-sand-gray/30 rounded-lg transition-colors">
              <div className="w-16 h-16 mx-auto bg-spring-green/10 rounded-full flex items-center justify-center mb-3">
                <span className="text-moss-green font-bold">2050</span>
              </div>
              <p className="text-sm text-moss-green">MA Climate Plan for 2050</p>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
} 
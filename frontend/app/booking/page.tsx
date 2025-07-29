import dynamic from 'next/dynamic';
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book a Massachusetts Clean Energy Career Consultation',
  description: 'Schedule a personalized consultation with Massachusetts clean energy career experts and advisors.',
  keywords: 'clean energy career consultation, Massachusetts energy jobs, career guidance, MassCEC booking'
};

const BookingForm = dynamic(() => import('@/components/BookingForm'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 text-base text-gray-400">Loading booking form...</div>
});

export default function BookingPage() {
  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-midnight-forest mb-4">
            Massachusetts Clean Energy Career Consultations
          </h1>
          <p className="text-xl text-moss-green max-w-3xl mx-auto mb-6">
            Connect with industry experts for personalized guidance on Massachusetts' clean energy career opportunities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#booking-form" className="btn bg-moss-green text-white hover:bg-midnight-forest">
              Book a Consultation
            </Link>
            <Link href="#experts" className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white">
              Meet Our Advisors
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Consultation Services</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-sand-gray p-6 rounded-lg">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Career Transition Planning</h3>
              <p className="text-moss-green mb-4">
                Personalized guidance for professionals transitioning to Massachusetts' clean energy sector from other industries.
              </p>
              <ul className="text-sm text-moss-green space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Skills gap analysis</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Training recommendations</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>MassCEC program eligibility</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-sand-gray p-6 rounded-lg">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Job Search Strategy</h3>
              <p className="text-moss-green mb-4">
                Expert guidance on finding and securing positions in Massachusetts' growing clean energy economy.
              </p>
              <ul className="text-sm text-moss-green space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Resume optimization</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Interview preparation</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Employer connections</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-sand-gray p-6 rounded-lg">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Training & Certification</h3>
              <p className="text-moss-green mb-4">
                Navigate Massachusetts' clean energy training programs, certifications, and funding opportunities.
              </p>
              <ul className="text-sm text-moss-green space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Program selection guidance</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Scholarship opportunities</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span>Return-on-investment analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Advisors Section */}
      <section id="experts" className="py-12 bg-sand-gray">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Meet Our Massachusetts Clean Energy Advisors</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-24 h-24 bg-spring-green/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-moss-green">SJ</span>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest text-center mb-2">Sarah Johnson</h3>
              <p className="text-moss-green text-center text-sm mb-2">MassCEC Career Advisor</p>
              <p className="text-moss-green text-center text-sm mb-4">
                10+ years experience in Massachusetts renewable energy workforce development
              </p>
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-spring-green/10 text-moss-green text-xs rounded-full">Solar & Storage</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-24 h-24 bg-spring-green/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-moss-green">MC</span>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest text-center mb-2">Michael Chen</h3>
              <p className="text-moss-green text-center text-sm mb-2">Clean Energy Pathways Program</p>
              <p className="text-moss-green text-center text-sm mb-4">
                Former hiring manager at leading Massachusetts energy efficiency companies
              </p>
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-spring-green/10 text-moss-green text-xs rounded-full">Energy Efficiency</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-24 h-24 bg-spring-green/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl font-bold text-moss-green">AR</span>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest text-center mb-2">Aisha Rodriguez</h3>
              <p className="text-moss-green text-center text-sm mb-2">ACT Workforce Development</p>
              <p className="text-moss-green text-center text-sm mb-4">
                Specialist in offshore wind career pathways and Massachusetts coastal communities
              </p>
              <div className="flex justify-center">
                <span className="px-3 py-1 bg-spring-green/10 text-moss-green text-xs rounded-full">Offshore Wind</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Success Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-sand-gray p-6 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-spring-green mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-moss-green italic mb-4">
                "The career consultation was transformative. My advisor helped me identify transferable skills from my manufacturing background and connected me with MassCEC's training program. I'm now working as a solar installer making 30% more than my previous job."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-spring-green/20 rounded-full flex items-center justify-center">
                  <span className="font-bold text-moss-green">JD</span>
                </div>
                <div className="ml-3">
                  <p className="font-bold text-midnight-forest">James Davis</p>
                  <p className="text-sm text-moss-green">Solar Installer, Boston</p>
                </div>
              </div>
            </div>
            
            <div className="bg-sand-gray p-6 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-spring-green mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              <p className="text-moss-green italic mb-4">
                "After 15 years in traditional energy, I was hesitant to make the switch. My advisor walked me through Massachusetts' offshore wind industry growth and helped me leverage my experience. Within two months, I landed a position at Vineyard Wind."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-spring-green/20 rounded-full flex items-center justify-center">
                  <span className="font-bold text-moss-green">LT</span>
                </div>
                <div className="ml-3">
                  <p className="font-bold text-midnight-forest">Lisa Thompson</p>
                  <p className="text-sm text-moss-green">Operations Manager, New Bedford</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Section */}
      <section id="booking-form" className="py-16 bg-sand-gray">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-6">Schedule Your Consultation</h2>
          <p className="text-center text-moss-green max-w-3xl mx-auto mb-12">
            Book a free 30-minute consultation with one of our Massachusetts clean energy career experts
          </p>
          
          <BookingForm className="max-w-2xl mx-auto" />
          
          <div className="mt-8 text-center">
            <p className="text-sm text-moss-green">
              Need immediate assistance? Contact us at <a href="mailto:careers@climateeconomyassistant.com" className="text-spring-green hover:underline">careers@climateeconomyassistant.com</a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 
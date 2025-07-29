import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Massachusetts Clean Energy Partners - Climate Economy Assistant",
  description: "Connect with leading Massachusetts clean energy employers, educational institutions, and community organizations driving the Commonwealth's climate economy.",
  keywords: "Massachusetts clean energy partners, climate economy partners, clean energy employers, MassCEC partners, ACT network"
};

export default function PartnersPage() {
  // In a real implementation, this data would come from a database
  const partnerStats = {
    totalPartners: 250,
    employerPartners: 175,
    educationalPartners: 45,
    communityPartners: 30,
    jobsPosted: 312,
    trainingPrograms: 28
  };

  const featuredPartners = [
    {
      id: 1,
      name: "Massachusetts Clean Energy Center",
      type: "Government Agency",
      logo: "/masscec-logo.png",
      description: "State economic development agency dedicated to accelerating the growth of the clean energy sector across the Commonwealth.",
      url: "https://www.masscec.com"
    },
    {
      id: 2,
      name: "Vineyard Wind",
      type: "Employer Partner",
      logo: "/vineyard-wind-logo.png",
      description: "Leading offshore wind developer building the first utility-scale offshore wind energy project in the United States.",
      url: "https://www.vineyardwind.com"
    },
    {
      id: 3,
      name: "Greenfield Community College",
      type: "Educational Partner",
      logo: "/gcc-logo.png",
      description: "Offers comprehensive clean energy certificate programs and workforce training for Western Massachusetts.",
      url: "https://www.gcc.mass.edu"
    }
  ];

  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl font-bold text-midnight-forest mb-4">
                Massachusetts Clean Energy Partner Network
              </h1>
              <p className="text-xl text-moss-green mb-6">
                Join a powerful ecosystem of employers, educational institutions, and community organizations driving Massachusetts' climate economy forward
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="#employer-partners" className="btn bg-moss-green text-white hover:bg-midnight-forest">
                  Find Employer Partners
                </Link>
                <Link href="#become-partner" className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white">
                  Become a Partner
                </Link>
              </div>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-midnight-forest mb-6">Massachusetts Partner Network</h2>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <p className="text-4xl font-bold text-spring-green">{partnerStats.totalPartners}</p>
                  <p className="text-sm text-moss-green">Total Partners</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-spring-green">{partnerStats.employerPartners}</p>
                  <p className="text-sm text-moss-green">Employer Partners</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-spring-green">{partnerStats.jobsPosted}</p>
                  <p className="text-sm text-moss-green">Clean Energy Jobs</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-spring-green">{partnerStats.trainingPrograms}</p>
                  <p className="text-sm text-moss-green">Training Programs</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Featured Massachusetts Partners</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {featuredPartners.map(partner => (
              <div key={partner.id} className="bg-sand-gray rounded-lg p-6 shadow-md">
                <div className="h-16 mb-4 flex items-center justify-center">
                  <div className="bg-spring-green/20 px-4 py-2 rounded">
                    <h3 className="text-xl font-bold text-midnight-forest">{partner.name}</h3>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">
                    {partner.type}
                  </span>
                </div>
                <p className="text-moss-green mb-4">
                  {partner.description}
                </p>
                <a 
                  href={partner.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-spring-green hover:underline flex items-center"
                >
                  Visit Website
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Types */}
      <section id="employer-partners" className="py-16 bg-sand-gray">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Massachusetts Partner Categories</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Employer Partners */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Employer Partners</h3>
              <p className="text-moss-green mb-4">
                Massachusetts clean energy companies seeking talent, offering jobs, and supporting workforce development.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Post clean energy job openings</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Access pre-screened candidates</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Participate in hiring events</span>
                </li>
              </ul>
              <Link href="/partner/signup" className="text-spring-green hover:underline flex items-center">
                Become an Employer Partner
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Educational Partners */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Educational Partners</h3>
              <p className="text-moss-green mb-4">
                Massachusetts colleges, universities, and training providers offering clean energy education programs.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">List training programs</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Connect with employer needs</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Access MassCEC funding</span>
                </li>
              </ul>
              <Link href="/partner/education" className="text-spring-green hover:underline flex items-center">
                Become an Educational Partner
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            
            {/* Community Partners */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-midnight-forest mb-2">Community Partners</h3>
              <p className="text-moss-green mb-4">
                Massachusetts community organizations, nonprofits, and advocacy groups supporting clean energy workforce development.
              </p>
              <ul className="mb-6 space-y-2">
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Promote clean energy careers</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Access community resources</span>
                </li>
                <li className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
                  <span className="text-sm text-moss-green">Support underserved communities</span>
                </li>
              </ul>
              <Link href="/partner/community" className="text-spring-green hover:underline flex items-center">
                Become a Community Partner
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Benefits */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-midnight-forest mb-12">Massachusetts Partner Benefits</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-midnight-forest mb-4">For Employers</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-moss-green">Talent Pipeline Access</h4>
                    <p className="text-sm text-moss-green">Connect with qualified candidates specifically interested in Massachusetts clean energy careers.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-moss-green">MassCEC Incentives</h4>
                    <p className="text-sm text-moss-green">Access to Massachusetts Clean Energy Center internship subsidies and hiring incentives.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-moss-green">Industry Visibility</h4>
                    <p className="text-sm text-moss-green">Showcase your company as a leader in Massachusetts' clean energy economy.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-midnight-forest mb-4">For Educational Institutions</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-moss-green">Curriculum Alignment</h4>
                    <p className="text-sm text-moss-green">Ensure your programs align with actual Massachusetts clean energy industry needs.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-moss-green">Student Placement</h4>
                    <p className="text-sm text-moss-green">Improve graduate outcomes with direct connections to Massachusetts employers.</p>
                  </div>
                </li>
                <li className="flex">
                  <div className="mr-4 mt-1">
                    <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-moss-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-moss-green">Program Promotion</h4>
                    <p className="text-sm text-moss-green">Market your clean energy training programs to motivated Massachusetts job seekers.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Become a Partner */}
      <section id="become-partner" className="py-16 bg-gradient-to-br from-spring-green-50 to-moss-green-50/30 animate-gentle-breathe">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-midnight-forest mb-6">
            Join the Massachusetts Clean Energy Partner Network
          </h2>
          <p className="text-xl text-moss-green mb-8">
            Together, we can accelerate Massachusetts' transition to a clean energy economy while creating quality jobs and economic opportunity across the Commonwealth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/partner/signup" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-lg">
              Apply to Become a Partner
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link href="/contact" className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white btn-lg">
              Contact Partnership Team
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
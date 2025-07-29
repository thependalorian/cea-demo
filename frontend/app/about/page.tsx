import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Climate Economy Assistant - Massachusetts Clean Energy Careers',
  description: 'Learn about the Climate Economy Assistant (CEA) and our mission to accelerate Massachusetts\' clean energy transition by connecting local talent with high-growth opportunities across the Commonwealth.',
  keywords: 'Massachusetts clean energy, climate economy, clean energy careers, Alliance for Climate Transition, MassCEC'
};

export default function About() {
  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-midnight-forest mb-6">
            About the
            <span className="text-spring-green"> Climate Economy Assistant</span>
          </h1>
          <p className="text-xl text-moss-green mb-8">
            We're on a mission to accelerate Massachusetts' clean energy transition by connecting local talent 
            with high-growth opportunities across the Commonwealth's thriving climate economy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#mission" className="bg-moss-green text-white hover:bg-midnight-forest py-3 px-6 rounded-md transition-colors">
              Our Mission
            </Link>
            <Link href="#team" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors">
              Meet Our Team
            </Link>
            <Link href="#partners" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors">
              Our Partners
            </Link>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section id="mission" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-midnight-forest mb-6">Our Massachusetts Mission</h2>
              <p className="text-lg text-moss-green mb-6">
                Massachusetts is leading the nation's clean energy transition, with ambitious climate goals 
                and a rapidly growing green workforce. However, many qualified candidates across the Commonwealth 
                struggle to connect with these opportunities due to information gaps and lack of guidance.
              </p>
              <p className="text-lg text-moss-green mb-6">
                The Climate Economy Assistant (CEA) is designed specifically for Massachusetts, bridging the gap 
                between local talent and the state's 111,800+ clean energy jobs. We're committed to supporting 
                the 38% workforce growth needed by 2030 through AI-powered career guidance tailored to the 
                unique needs of Massachusetts residents and employers.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                  <div className="text-3xl font-bold text-spring-green mb-1">111,800+</div>
                  <div className="text-moss-green">MA Clean Energy Jobs</div>
                </div>
                <div className="text-center p-4 bg-moss-green/10 rounded-lg">
                  <div className="text-3xl font-bold text-spring-green mb-1">38%</div>
                  <div className="text-moss-green">Workforce Growth by 2030</div>
                </div>
              </div>
            </div>
            <div className="bg-sand-gray rounded-2xl p-8 shadow-md">
              <h3 className="text-2xl font-bold text-midnight-forest mb-6">Our Values</h3>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-spring-green rounded-full flex items-center justify-center mt-1 shrink-0">
                    {/* Check SVG */}
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-midnight-forest text-lg">Local Equity & Inclusion</h4>
                    <p className="text-moss-green">Ensuring all Massachusetts residents have access to clean energy opportunities, with special focus on environmental justice communities in Gateway Cities like Lawrence, New Bedford, and Springfield.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-moss-green rounded-full flex items-center justify-center mt-1 shrink-0">
                    {/* Check SVG */}
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-midnight-forest text-lg">Massachusetts Innovation</h4>
                    <p className="text-moss-green">Leveraging cutting-edge AI to solve Massachusetts' workforce challenges, building on the Commonwealth's legacy as a hub for technology innovation and clean energy leadership.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-spring-green rounded-full flex items-center justify-center mt-1 shrink-0">
                    {/* Check SVG */}
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-bold text-midnight-forest text-lg">Commonwealth Impact</h4>
                    <p className="text-moss-green">Measuring success by Massachusetts careers transformed and climate goals achieved, supporting the state's commitment to net zero emissions by 2050 and 45% reduction by 2030.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-sand-gray">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-forest mb-4">Our Massachusetts Team</h2>
            <p className="text-xl text-moss-green">Meet the people building the future of Massachusetts clean energy careers</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 pt-6 flex justify-center">
                <div className="w-28 h-28 rounded-full bg-spring-green/20 flex items-center justify-center text-2xl font-bold text-spring-green">
                  GN
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-midnight-forest mb-1">George Nekwaya</h3>
                <p className="text-spring-green font-medium mb-3">Project Manager & Founder</p>
                <p className="text-moss-green mb-4">
                  Civil Engineer with MBA in Data Analytics. Leading DEIJ and Workforce Development 
                  initiatives at The Alliance for Climate Transition in Massachusetts, working closely with MassCEC on the Commonwealth's clean energy workforce expansion.
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="w-8 h-8 border border-moss-green rounded-full flex items-center justify-center text-moss-green hover:bg-moss-green hover:text-white transition-colors" aria-label="LinkedIn">
                    {/* LinkedIn SVG */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 border border-moss-green rounded-full flex items-center justify-center text-moss-green hover:bg-moss-green hover:text-white transition-colors" aria-label="Twitter">
                    {/* Twitter SVG */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 pt-6 flex justify-center">
                <div className="w-28 h-28 rounded-full bg-moss-green/20 flex items-center justify-center text-2xl font-bold text-moss-green">
                  BR
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-midnight-forest mb-1">Barry Reaves</h3>
                <p className="text-spring-green font-medium mb-3">VP of Massachusetts Workforce Development</p>
                <p className="text-moss-green mb-4">
                  Strategic leader in Massachusetts clean energy workforce development with extensive experience 
                  in employer engagement across Boston, Worcester, and Springfield regions. Former director at MassCEC's workforce programs.
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="w-8 h-8 border border-moss-green rounded-full flex items-center justify-center text-moss-green hover:bg-moss-green hover:text-white transition-colors" aria-label="LinkedIn">
                    {/* LinkedIn SVG */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 border border-moss-green rounded-full flex items-center justify-center text-moss-green hover:bg-moss-green hover:text-white transition-colors" aria-label="Twitter">
                    {/* Twitter SVG */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Team Member 3 */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="px-6 pt-6 flex justify-center">
                <div className="w-28 h-28 rounded-full bg-spring-green/20 flex items-center justify-center text-2xl font-bold text-spring-green">
                  NP
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-midnight-forest mb-1">Natasha Perz</h3>
                <p className="text-spring-green font-medium mb-3">VP of Massachusetts Communications</p>
                <p className="text-moss-green mb-4">
                  Communications strategist focused on making Massachusetts clean energy careers accessible 
                  through partnerships with local workforce boards and educational institutions across the Commonwealth's diverse regions.
                </p>
                <div className="flex justify-center gap-3 mt-4">
                  <a href="#" className="w-8 h-8 border border-moss-green rounded-full flex items-center justify-center text-moss-green hover:bg-moss-green hover:text-white transition-colors" aria-label="LinkedIn">
                    {/* LinkedIn SVG */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                  <a href="#" className="w-8 h-8 border border-moss-green rounded-full flex items-center justify-center text-moss-green hover:bg-moss-green hover:text-white transition-colors" aria-label="Twitter">
                    {/* Twitter SVG */}
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-midnight-forest mb-4">Our Massachusetts Partners</h2>
            <p className="text-xl text-moss-green">Working with leading Massachusetts organizations to accelerate the clean energy transition</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-sand-gray rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-spring-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-spring-green text-2xl font-bold">M</span>
              </div>
              <h3 className="text-2xl font-bold text-spring-green mb-2">MassCEC</h3>
              <p className="text-moss-green">Massachusetts Clean Energy Center - State agency dedicated to accelerating clean energy growth</p>
            </div>
            <div className="bg-sand-gray rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-moss-green text-2xl font-bold">A</span>
              </div>
              <h3 className="text-2xl font-bold text-moss-green mb-2">ACT</h3>
              <p className="text-moss-green">Alliance for Climate Transition - Coalition of Massachusetts climate organizations</p>
            </div>
            <div className="bg-sand-gray rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-spring-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-spring-green text-2xl font-bold">N</span>
              </div>
              <h3 className="text-2xl font-bold text-spring-green mb-2">NECEC</h3>
              <p className="text-moss-green">Northeast Clean Energy Council - Regional clean energy business association</p>
            </div>
            <div className="bg-sand-gray rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-moss-green text-2xl font-bold">G</span>
              </div>
              <h3 className="text-2xl font-bold text-moss-green mb-2">Greentown Labs</h3>
              <p className="text-moss-green">North America's largest climate tech startup incubator, based in Somerville, MA</p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-moss-green mb-6">Plus 45+ educational institutions and 250+ employers across Massachusetts</p>
            <Link href="/resources" className="inline-flex items-center text-spring-green hover:underline">
              View all Massachusetts resources
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Massachusetts Climate Economy History Section */}
      <section className="py-20 bg-sand-gray">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-midnight-forest mb-4">Massachusetts Climate Economy</h2>
            <p className="text-xl text-moss-green">A leader in clean energy innovation</p>
          </div>

          <div className="max-w-none">
            <p className="text-lg text-moss-green leading-relaxed mb-6">
              Massachusetts has established itself as a national leader in clean energy policy and innovation. The Commonwealth's journey began with the Green Communities Act of 2008, which set ambitious renewable energy targets and established the framework for today's thriving clean energy ecosystem.
            </p>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-midnight-forest mb-3">Key Massachusetts Climate Policies</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-spring-green rounded-full flex items-center justify-center mt-1 shrink-0"></div>
                  <p className="text-moss-green"><span className="font-medium">2008:</span> Green Communities Act establishes renewable energy framework</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-moss-green rounded-full flex items-center justify-center mt-1 shrink-0"></div>
                  <p className="text-moss-green"><span className="font-medium">2016:</span> Energy Diversity Act creates nation-leading offshore wind commitment</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-spring-green rounded-full flex items-center justify-center mt-1 shrink-0"></div>
                  <p className="text-moss-green"><span className="font-medium">2021:</span> Climate Act establishes net zero emissions by 2050 target</p>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 bg-moss-green rounded-full flex items-center justify-center mt-1 shrink-0"></div>
                  <p className="text-moss-green"><span className="font-medium">2022:</span> Massachusetts Clean Energy and Climate Plan for 2025/2030</p>
                </li>
              </ul>
            </div>
            
            <p className="text-lg text-moss-green leading-relaxed mb-6">
              Today, Massachusetts' clean energy sector employs over 111,800 workers across the state, from the Berkshires to Cape Cod. The Massachusetts Clean Energy Center (MassCEC) projects that the workforce will need to grow by 38% by 2030 to meet the state's climate goals, creating thousands of new job opportunities in solar, offshore wind, energy efficiency, and clean transportation.
            </p>
            <p className="text-lg text-moss-green leading-relaxed mb-6">
              The Climate Economy Assistant (CEA) was born from the recognition that Massachusetts needs innovative workforce development solutions to meet this growing demand. By leveraging AI technology and deep local expertise, CEA connects Massachusetts residents with the skills, training, and employers they need to thrive in the Commonwealth's clean energy future.
            </p>
            <p className="text-lg text-moss-green leading-relaxed">
              Our mission aligns with Massachusetts' commitment to ensuring that the benefits of the clean energy transition are shared equitably across all communities, with special focus on environmental justice populations and regions transitioning from fossil fuel economies.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-midnight-forest mb-4">Get in Touch</h2>
          <p className="text-xl text-moss-green mb-8">
            Have questions about CEA or want to partner with us? We'd love to hear from you.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-sand-gray rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-spring-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Mail SVG */}
                <svg className="w-8 h-8 text-spring-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-bold text-midnight-forest mb-2">Email Us</h3>
              <p className="text-moss-green">hello@climateeconomyassistant.com</p>
            </div>
            
            <div className="bg-sand-gray rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-moss-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Location SVG */}
                <svg className="w-8 h-8 text-moss-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-midnight-forest mb-2">Visit Us</h3>
              <p className="text-moss-green">444 Somerville Ave<br />Somerville, MA 02143</p>
            </div>
            
            <div className="bg-sand-gray rounded-lg p-6 text-center">
              <div className="w-16 h-16 bg-spring-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Chat SVG */}
                <svg className="w-8 h-8 text-spring-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-bold text-midnight-forest mb-2">Chat With Us</h3>
              <p className="text-moss-green">Available 9 AM - 5 PM EST</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="bg-moss-green text-white hover:bg-midnight-forest py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center">
              Contact Us
            </Link>
            <Link href="/auth/signup" className="border border-moss-green text-moss-green hover:bg-moss-green hover:text-white py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center">
              Join CEA Today
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-midnight-forest mb-6">
            Ready to Start Your Massachusetts Clean Energy Career?
          </h2>
          <p className="text-xl text-moss-green mb-8">
            Join thousands of professionals who've launched successful careers in the Massachusetts climate economy with CEA. Access 42,000+ new clean energy jobs by 2030.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup" className="bg-moss-green text-white hover:bg-midnight-forest py-3 px-6 rounded-md transition-colors inline-flex items-center justify-center">
              Get Started Today
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
    </div>
  )
} 
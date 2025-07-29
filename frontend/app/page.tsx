"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container } from '@/components/ui/container'
import { Section } from '@/components/ui/section'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { 
  ArrowRight, Briefcase, GraduationCap, 
  BarChart3, Users, ChevronRight
} from 'lucide-react'

// Define the missing CredentialEvaluationShowcase component
const CredentialEvaluationShowcase = () => {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <Badge className="px-4 py-2 bg-spring-green text-midnight-forest font-medium">
          International Credential Evaluation
        </Badge>
        <h3 className="text-3xl font-bold text-midnight-forest">Global Talent for Massachusetts' Clean Energy Future</h3>
        <p className="text-moss-green">
          Massachusetts' clean energy sector welcomes international expertise. Our AI evaluates your international credentials and experience, helping employers understand your qualifications for Massachusetts clean energy roles.
        </p>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-sand-gray text-moss-green">Credential Mapping</Badge>
          <Badge className="bg-sand-gray text-moss-green">Skills Translation</Badge>
          <Badge className="bg-sand-gray text-moss-green">US Equivalency</Badge>
        </div>
      </div>
      <div>
        <Card className="shadow-lg p-6 border border-sand-gray bg-white">
          <div className="space-y-4">
            <h3 className="text-xl font-medium text-midnight-forest">Credential Evaluation</h3>
            <div className="bg-sand-gray rounded-lg p-4">
              <h4 className="font-medium mb-2 text-midnight-forest">Original Credential</h4>
              <p className="text-sm text-moss-green">Bachelor of Engineering, Electrical Engineering</p>
              <p className="text-sm text-moss-green">University of Namibia, Namibia</p>
            </div>
            <div className="bg-spring-green rounded-lg p-4">
              <h4 className="font-medium mb-2 text-midnight-forest">US Equivalent</h4>
              <p className="text-sm text-moss-green">Bachelor of Science in Electrical Engineering</p>
              <p className="text-sm text-moss-green">Accredited US University</p>
            </div>
            <div className="bg-spring-green/20 rounded-lg p-4">
              <h4 className="font-medium mb-2 text-midnight-forest">Massachusetts Relevance</h4>
              <p className="text-sm text-moss-green">Qualifies for positions in solar installation, grid modernization, and energy efficiency projects across Massachusetts.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Climate Economy Assistant",
    "description": "AI-powered career guidance for clean energy and climate jobs",
    "url": "https://cea.georgenekwaya.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://cea.georgenekwaya.com/jobs?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Alliance for Climate Transition",
      "url": "https://cea.georgenekwaya.com"
    }
  };

  return (
    <div className="min-h-screen bg-sand-gray">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Hero Section - Enhanced Massachusetts Climate Economy Focus */}
      <Section className="relative overflow-hidden min-h-[90vh] flex items-center" role="banner">
        <div className="absolute inset-0 bg-gradient-to-r from-spring-green to-sand-gray">
          {/* Background pattern overlay */}
          <div className="absolute inset-0 bg-[url('/images/ma-pattern-overlay.svg')] opacity-10"></div>
        </div>
        <Container className="relative py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Enhanced Value Proposition */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-spring-green rounded-full text-midnight-forest font-medium text-sm">
                  Powering Massachusetts' Clean Energy Workforce
                </div>
                <h1 className="text-5xl font-bold leading-tight text-midnight-forest">
                  Bridging the Gap to 
                  <span className="text-moss-green"> 42,000+ New Clean Energy Jobs</span> by 2030
                </h1>
                <p className="text-xl text-moss-green leading-relaxed">
                  The Climate Economy Assistant (CEA) connects talent with opportunity through AI-powered career guidance, workforce development, and employer partnerships—creating a sustainable future for Massachusetts.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-moss-green hover:bg-midnight-forest text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                    View Impact Metrics
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/chat" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full sm:w-auto border-moss-green text-moss-green hover:bg-moss-green hover:text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                    Experience AI Assistant
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-4 text-moss-green">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Avatar 
                      key={i} 
                      className="w-8 h-8 border-2 border-sand-gray"
                      initials={String.fromCharCode(64 + i)}
                      fallback={
                        <div className={`w-full h-full bg-[#${i % 2 === 0 ? 'B2DE26' : '394816'}] flex items-center justify-center text-white text-xs font-medium`}>
                          {String.fromCharCode(64 + i)}
                        </div>
                      }
                    />
                  ))}
                </div>
                <p className="text-sm">
                  <span className="font-bold">3,500+</span> Massachusetts professionals connected to clean energy careers
                </p>
              </div>
            </div>
            
            {/* Right Column - Feature Showcase */}
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-20 h-20 bg-spring-green opacity-20 rounded-full blur-2xl"></div>
              <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-spring-green opacity-20 rounded-full blur-2xl"></div>
              
              <Card className="bg-white border border-sand-gray shadow-xl rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-midnight-forest">Climate Economy AI Assistant</h3>
                    <Badge className="bg-spring-green text-midnight-forest">Industry-Specific AI</Badge>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div className="bg-sand-gray p-4 rounded-lg">
                      <p className="text-moss-green">What clean energy jobs in Massachusetts match my background in electrical engineering?</p>
                    </div>
                    
                    <div className="bg-spring-green p-4 rounded-lg">
                      <p className="text-moss-green">Based on your electrical engineering background, here are top Massachusetts matches with projected growth rates:</p>
                      <ul className="mt-2 space-y-2">
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-moss-green"></div>
                          <span>Solar PV System Designer (+174% by 2030)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-moss-green"></div>
                          <span>Grid Modernization Engineer (+86% by 2030)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-moss-green"></div>
                          <span>Energy Storage Systems Engineer (+128% by 2030)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <Link href="/chat">
                    <Button className="w-full bg-moss-green hover:bg-midnight-forest text-white">
                      Start Career Conversation
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>

      {/* Key Features Section */}
      <Section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 bg-spring-green text-midnight-forest font-medium mb-4">
              Strategic Impact Areas
            </Badge>
            <h2 className="text-4xl font-bold text-midnight-forest mb-4">Accelerating Massachusetts' Climate Economy</h2>
            <p className="text-xl text-moss-green max-w-3xl mx-auto">
              The Climate Economy Assistant delivers measurable impact across four key areas, supporting Massachusetts' goal of net-zero emissions by 2050 while creating equitable economic opportunities.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Workforce Development */}
            <Card className="bg-white border border-sand-gray shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-moss-green" />
                </div>
                <h3 className="text-xl font-bold text-midnight-forest mb-2">Workforce Development</h3>
                <p className="text-moss-green mb-4">
                  Preparing 10,000+ Massachusetts residents for clean energy careers through AI-powered skills assessment, training recommendations, and career pathing.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-moss-green">38% workforce growth by 2030</span>
                  <Link href="/features#workforce" className="text-spring-green hover:text-moss-green">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </Card>

            {/* Employer Solutions */}
            <Card className="bg-white border border-sand-gray shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-moss-green" />
                </div>
                <h3 className="text-xl font-bold text-midnight-forest mb-2">Employer Solutions</h3>
                <p className="text-moss-green mb-4">
                  Connecting Massachusetts clean energy employers with qualified talent through AI matching, reducing hiring time by 35% and improving retention rates.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-moss-green">250+ employer partners</span>
                  <Link href="/features#employers" className="text-spring-green hover:text-moss-green">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </Card>

            {/* Education Pathways */}
            <Card className="bg-white border border-sand-gray shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-moss-green" />
                </div>
                <h3 className="text-xl font-bold text-midnight-forest mb-2">Education Pathways</h3>
                <p className="text-moss-green mb-4">
                  Partnering with Massachusetts educational institutions to create targeted training programs aligned with industry needs and regional clean energy goals.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-moss-green">45 training partnerships</span>
                  <Link href="/features#education" className="text-spring-green hover:text-moss-green">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </Card>

            {/* Economic Impact */}
            <Card className="bg-white border border-sand-gray shadow-lg hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="w-12 h-12 bg-spring-green/20 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-moss-green" />
                </div>
                <h3 className="text-xl font-bold text-midnight-forest mb-2">Economic Impact</h3>
                <p className="text-moss-green mb-4">
                  Driving $1.2B in economic growth across Massachusetts through workforce development, job creation, and support for clean energy innovation.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-moss-green">111,800+ jobs supported</span>
                  <Link href="/features#impact" className="text-spring-green hover:text-moss-green">
                    <ChevronRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Credential Evaluation Section */}
      <Section className="py-20 bg-sand-gray">
        <Container>
          <CredentialEvaluationShowcase />
        </Container>
      </Section>

      {/* Massachusetts Impact Section - New section with concrete metrics */}
      <Section className="py-20 bg-white">
        <Container>
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 bg-spring-green text-midnight-forest font-medium mb-4">
              Measurable Impact
            </Badge>
            <h2 className="text-4xl font-bold text-midnight-forest mb-4">Transforming Massachusetts' Clean Energy Landscape</h2>
            <p className="text-xl text-moss-green max-w-3xl mx-auto">
              Our platform delivers concrete results for Massachusetts' climate economy, supporting the Commonwealth's ambitious clean energy and climate goals.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-spring-green/10 border border-spring-green/30 p-8 rounded-xl text-center">
              <h3 className="text-5xl font-bold text-midnight-forest mb-2">86%</h3>
              <p className="text-moss-green font-medium">Job placement rate for program participants</p>
            </Card>
            
            <Card className="bg-spring-green/10 border border-spring-green/30 p-8 rounded-xl text-center">
              <h3 className="text-5xl font-bold text-midnight-forest mb-2">$78.5K</h3>
              <p className="text-moss-green font-medium">Average salary of placed candidates</p>
            </Card>
            
            <Card className="bg-spring-green/10 border border-spring-green/30 p-8 rounded-xl text-center">
              <h3 className="text-5xl font-bold text-midnight-forest mb-2">42%</h3>
              <p className="text-moss-green font-medium">Increase in diverse workforce representation</p>
            </Card>
            
            <Card className="bg-spring-green/10 border border-spring-green/30 p-8 rounded-xl text-center">
              <h3 className="text-5xl font-bold text-midnight-forest mb-2">3,500+</h3>
              <p className="text-moss-green font-medium">Massachusetts residents served to date</p>
            </Card>
            
            <Card className="bg-spring-green/10 border border-spring-green/30 p-8 rounded-xl text-center">
              <h3 className="text-5xl font-bold text-midnight-forest mb-2">250+</h3>
              <p className="text-moss-green font-medium">Massachusetts employer partners</p>
            </Card>
            
            <Card className="bg-spring-green/10 border border-spring-green/30 p-8 rounded-xl text-center">
              <h3 className="text-5xl font-bold text-midnight-forest mb-2">45</h3>
              <p className="text-moss-green font-medium">Educational institution partnerships</p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Testimonials Section */}
      <Section className="py-20 bg-sand-gray">
        <Container>
          <div className="text-center mb-16">
            <Badge className="px-4 py-2 bg-spring-green text-midnight-forest font-medium mb-4">
              Success Stories
            </Badge>
            <h2 className="text-4xl font-bold text-midnight-forest mb-4">Voices from Massachusetts' Clean Energy Sector</h2>
            <p className="text-xl text-moss-green max-w-3xl mx-auto">
              Hear from job seekers, employers, and partners who are building Massachusetts' climate economy future.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Testimonial 1 - Job Seeker */}
            <Card className="bg-white border border-sand-gray shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Avatar 
                  className="w-12 h-12 border-2 border-spring-green"
                  initials="JD"
                  fallback={
                    <div className="w-full h-full bg-moss-green flex items-center justify-center text-white text-sm font-medium">
                      JD
                    </div>
                  }
                />
                <div className="ml-4">
                  <h4 className="font-bold text-midnight-forest">Jennifer Davis</h4>
                  <p className="text-sm text-moss-green">Solar Installation Technician</p>
                </div>
              </div>
              <p className="text-moss-green italic">
                "CEA helped me transition from construction to solar installation, increasing my income by 35%. The AI guidance identified my transferable skills and connected me with MassCEC-approved training that employers recognized."
              </p>
            </Card>

            {/* Testimonial 2 - Employer */}
            <Card className="bg-white border border-sand-gray shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Avatar 
                  className="w-12 h-12 border-2 border-spring-green"
                  initials="MS"
                  fallback={
                    <div className="w-full h-full bg-moss-green flex items-center justify-center text-white text-sm font-medium">
                      MS
                    </div>
                  }
                />
                <div className="ml-4">
                  <h4 className="font-bold text-midnight-forest">Michael Stevens</h4>
                  <p className="text-sm text-moss-green">HR Director, Massachusetts Solar Solutions</p>
                </div>
              </div>
              <p className="text-moss-green italic">
                "CEA has transformed our hiring process. We've reduced time-to-hire by 40% while increasing candidate quality. The platform's understanding of Massachusetts' clean energy landscape is unmatched."
              </p>
            </Card>

            {/* Testimonial 3 - Partner */}
            <Card className="bg-white border border-sand-gray shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Avatar 
                  className="w-12 h-12 border-2 border-spring-green"
                  initials="LW"
                  fallback={
                    <div className="w-full h-full bg-moss-green flex items-center justify-center text-white text-sm font-medium">
                      LW
                    </div>
                  }
                />
                <div className="ml-4">
                  <h4 className="font-bold text-midnight-forest">Dr. Lisa Wong</h4>
                  <p className="text-sm text-moss-green">Director, Greenfield Community College</p>
                </div>
              </div>
              <p className="text-moss-green italic">
                "Our partnership with CEA has allowed us to develop training programs that directly address Massachusetts' clean energy workforce needs. Enrollment in our renewable energy programs has increased 68%."
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      {/* CTA Section */}
      <Section className="py-20 bg-gradient-to-br from-spring-green-50 to-moss-green-50/30 animate-gentle-breathe">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="px-4 py-2 bg-spring-green text-midnight-forest font-medium mb-6">
              Join the Movement
            </Badge>
            <h2 className="text-4xl font-bold text-midnight-forest mb-6">
              Partner with Us to Build Massachusetts' Clean Energy Future
            </h2>
            <p className="text-xl text-moss-green mb-8">
              Whether you're a job seeker, employer, educator, or investor, the Climate Economy Assistant provides the tools and connections to accelerate Massachusetts' transition to a clean energy economy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-moss-green hover:bg-midnight-forest text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                  Schedule a Demo
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-moss-green text-moss-green hover:bg-moss-green hover:text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2">
                  Learn About Our Impact
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  )
}
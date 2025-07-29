"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Section } from "@/components/ui/section";
import { Container } from "@/components/ui/container";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Demo profile data for Massachusetts clean energy professional
const demoProfile = {
  full_name: "Sarah Johnson",
  email: "sarah.johnson@example.com",
  profile_type: "job_seeker",
  location: "Boston, Massachusetts",
  phone: "(617) 555-1234",
  bio: "Clean energy professional with 5+ years of experience in solar installation and project management. Passionate about advancing Massachusetts' transition to renewable energy and creating sustainable career opportunities across the Commonwealth.",
  skills: [
    "Solar PV Installation",
    "Energy Efficiency Analysis",
    "Project Management",
    "OSHA Safety Certified",
    "Customer Relations",
    "MassCEC Program Knowledge"
  ],
  education: [
    {
      degree: "B.S. Environmental Science",
      institution: "UMass Amherst",
      year: "2018"
    },
    {
      degree: "Clean Energy Certificate",
      institution: "Greenfield Community College",
      year: "2020"
    }
  ],
  certifications: [
    "NABCEP PV Installation Professional",
    "MassCEC Approved Installer",
    "LEED Green Associate"
  ],
  experience: [
    {
      title: "Solar Installation Team Lead",
      company: "Boston Solar Solutions",
      location: "Greater Boston Area",
      period: "2020-Present"
    },
    {
      title: "Energy Efficiency Specialist",
      company: "MassSave Program",
      location: "Worcester, MA",
      period: "2018-2020"
    }
  ],
  career_interests: [
    "Offshore Wind Development",
    "Energy Storage Technologies",
    "Clean Energy Policy",
    "Community Solar Projects"
  ]
};

export default function UserProfile() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Demo mode - always use demo profile
  useEffect(() => {
    setLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setProfile(demoProfile);
      setLoading(false);
    }, 500);
  }, []);

  const renderProfileHeader = () => (
    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
      <div className="w-32 h-32 bg-spring-green/20 rounded-full flex items-center justify-center">
        <span className="text-3xl font-bold text-moss-green">
          {profile?.full_name?.split(' ').map((n: string) => n[0]).join('')}
        </span>
      </div>
      
      <div className="flex-1 text-center md:text-left">
        <h1 className="text-3xl font-bold text-midnight-forest">{profile?.full_name}</h1>
        <p className="text-lg text-moss-green mb-2">{profile?.location}</p>
        
        <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
          <span className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">
            Massachusetts Clean Energy Professional
          </span>
          <span className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">
            MassCEC Network Member
          </span>
        </div>
      </div>
      
      <div className="flex flex-col gap-3">
        <Button className="bg-moss-green hover:bg-midnight-forest text-white">
          Edit Profile
        </Button>
        <Link href="/profile/resume" className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white text-center py-2 px-4 rounded-md">
          View Resume
        </Link>
      </div>
    </div>
  );

  const renderTabs = () => (
    <div className="border-b border-sand-gray mb-6">
      <div className="flex flex-wrap -mb-px">
        {['overview', 'experience', 'education', 'skills', 'preferences'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              activeTab === tab
                ? 'text-spring-green border-spring-green'
                : 'border-transparent hover:text-moss-green hover:border-moss-green/30'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <Card className="bg-white p-6 shadow-md border-sand-gray">
        <h2 className="text-xl font-bold text-midnight-forest mb-4">Professional Summary</h2>
        <p className="text-moss-green">{profile?.bio}</p>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white p-6 shadow-md border-sand-gray">
          <h2 className="text-xl font-bold text-midnight-forest mb-4">Massachusetts Career Interests</h2>
          <ul className="space-y-2">
            {profile?.career_interests?.map((interest: string, i: number) => (
              <li key={i} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
                <span className="text-moss-green">{interest}</span>
              </li>
            ))}
          </ul>
        </Card>
        
        <Card className="bg-white p-6 shadow-md border-sand-gray">
          <h2 className="text-xl font-bold text-midnight-forest mb-4">Top Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profile?.skills?.slice(0, 6).map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1 bg-spring-green/10 text-moss-green text-sm rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </Card>
      </div>
      
      <Card className="bg-white p-6 shadow-md border-sand-gray">
        <h2 className="text-xl font-bold text-midnight-forest mb-4">Massachusetts Clean Energy Journey</h2>
        <div className="relative pl-8 space-y-8 before:absolute before:left-4 before:top-2 before:bottom-0 before:w-0.5 before:bg-spring-green/30">
          {profile?.experience?.map((exp: any, i: number) => (
            <div key={i} className="relative">
              <div className="absolute left-[-30px] top-1 w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-spring-green rounded-full"></div>
              </div>
              <h3 className="text-lg font-semibold text-midnight-forest">{exp.title}</h3>
              <p className="text-moss-green">{exp.company} | {exp.location}</p>
              <p className="text-sm text-moss-green/80">{exp.period}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const renderExperience = () => (
    <Card className="bg-white p-6 shadow-md border-sand-gray">
      <h2 className="text-xl font-bold text-midnight-forest mb-6">Work Experience</h2>
      <div className="space-y-8">
        {profile?.experience?.map((exp: any, i: number) => (
          <div key={i} className="border-b border-sand-gray last:border-0 pb-6 last:pb-0">
            <h3 className="text-lg font-semibold text-midnight-forest">{exp.title}</h3>
            <p className="text-moss-green">{exp.company} | {exp.location}</p>
            <p className="text-sm text-moss-green/80 mb-3">{exp.period}</p>
            <p className="text-moss-green">
              {i === 0 ? 
                "Led a team of solar installers across Massachusetts, completing over 120 residential and commercial installations. Coordinated with MassCEC for rebate processing and compliance with Massachusetts building codes." :
                "Conducted energy audits for Massachusetts homes and businesses under the MassSave program. Helped customers identify energy efficiency opportunities and access state incentives for improvements."
              }
            </p>
          </div>
        ))}
      </div>
    </Card>
  );

  const renderEducation = () => (
    <Card className="bg-white p-6 shadow-md border-sand-gray">
      <h2 className="text-xl font-bold text-midnight-forest mb-6">Education & Certifications</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-midnight-forest mb-4">Academic Education</h3>
        <div className="space-y-6">
          {profile?.education?.map((edu: any, i: number) => (
            <div key={i} className="flex">
              <div className="mr-4 mt-1">
                <div className="w-6 h-6 bg-spring-green/20 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-spring-green rounded-full"></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-midnight-forest">{edu.degree}</h4>
                <p className="text-moss-green">{edu.institution}</p>
                <p className="text-sm text-moss-green/80">{edu.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-midnight-forest mb-4">Professional Certifications</h3>
        <div className="space-y-2">
          {profile?.certifications?.map((cert: string, i: number) => (
            <div key={i} className="flex items-center">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mr-2"></span>
              <span className="text-moss-green">{cert}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );

  const renderSkills = () => (
    <Card className="bg-white p-6 shadow-md border-sand-gray">
      <h2 className="text-xl font-bold text-midnight-forest mb-6">Skills & Expertise</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-midnight-forest mb-4">Technical Skills</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-moss-green">Solar PV Installation</span>
                <span className="text-moss-green">Expert</span>
              </div>
              <div className="w-full bg-sand-gray rounded-full h-2">
                <div className="bg-spring-green h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-moss-green">Energy Efficiency Analysis</span>
                <span className="text-moss-green">Advanced</span>
              </div>
              <div className="w-full bg-sand-gray rounded-full h-2">
                <div className="bg-spring-green h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-moss-green">Project Management</span>
                <span className="text-moss-green">Advanced</span>
              </div>
              <div className="w-full bg-sand-gray rounded-full h-2">
                <div className="bg-spring-green h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-midnight-forest mb-4">Massachusetts-Specific Knowledge</h3>
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <span className="text-moss-green">Massachusetts Building Codes & Regulations</span>
            </div>
            <div className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <span className="text-moss-green">MassCEC Incentive Programs</span>
            </div>
            <div className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <span className="text-moss-green">Massachusetts Clean Energy Policies</span>
            </div>
            <div className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <span className="text-moss-green">MassSave Program Requirements</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );

  const renderPreferences = () => (
    <Card className="bg-white p-6 shadow-md border-sand-gray">
      <h2 className="text-xl font-bold text-midnight-forest mb-6">Career Preferences</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-midnight-forest mb-4">Job Preferences</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <div>
                <span className="font-medium text-midnight-forest">Desired Role Types:</span>
                <p className="text-moss-green">Project Management, Technical Leadership</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <div>
                <span className="font-medium text-midnight-forest">Salary Expectations:</span>
                <p className="text-moss-green">$75,000 - $95,000 annually</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <div>
                <span className="font-medium text-midnight-forest">Work Arrangement:</span>
                <p className="text-moss-green">Hybrid (Office + Field Work)</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-midnight-forest mb-4">Massachusetts Location Preferences</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <div>
                <span className="font-medium text-midnight-forest">Preferred Regions:</span>
                <p className="text-moss-green">Greater Boston, North Shore, MetroWest</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <div>
                <span className="font-medium text-midnight-forest">Max Commute Distance:</span>
                <p className="text-moss-green">30 miles</p>
              </div>
            </li>
            <li className="flex items-start">
              <span className="w-1.5 h-1.5 bg-spring-green rounded-full mt-1.5 mr-2"></span>
              <div>
                <span className="font-medium text-midnight-forest">Transportation:</span>
                <p className="text-moss-green">Car, Public Transit (MBTA)</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-spring-green/10 rounded-lg">
        <h3 className="text-lg font-semibold text-midnight-forest mb-2">Massachusetts Clean Energy Focus Areas</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-white text-moss-green text-sm rounded-full border border-spring-green/30">Solar Energy</span>
          <span className="px-3 py-1 bg-white text-moss-green text-sm rounded-full border border-spring-green/30">Offshore Wind</span>
          <span className="px-3 py-1 bg-white text-moss-green text-sm rounded-full border border-spring-green/30">Energy Storage</span>
          <span className="px-3 py-1 bg-white text-moss-green text-sm rounded-full border border-spring-green/30">Grid Modernization</span>
          <span className="px-3 py-1 bg-white text-moss-green text-sm rounded-full border border-spring-green/30">Building Efficiency</span>
        </div>
      </div>
    </Card>
  );

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'experience': return renderExperience();
      case 'education': return renderEducation();
      case 'skills': return renderSkills();
      case 'preferences': return renderPreferences();
      default: return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Header */}
      <Section className="py-12 bg-gradient-to-br from-spring-green/10 to-moss-green/10">
        <Container>
          <div className="max-w-5xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <p className="text-moss-green">Loading profile...</p>
              </div>
            ) : error ? (
              <div className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</div>
            ) : profile ? (
              renderProfileHeader()
            ) : (
              <div className="text-moss-green bg-spring-green/10 p-4 rounded-lg">
                No profile found. Please complete your profile setup.
              </div>
            )}
          </div>
        </Container>
      </Section>

      {/* Profile Content */}
      {!loading && profile && (
        <Section className="py-12">
          <Container>
            <div className="max-w-5xl mx-auto">
              {renderTabs()}
              {renderActiveTab()}
            </div>
          </Container>
        </Section>
      )}

      {/* Demo Mode Banner */}
      <Section className="py-6 bg-spring-green/5">
        <Container>
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-sm text-moss-green">
              <span className="font-semibold">Demo Mode:</span> This is a demonstration of the Massachusetts Climate Economy Assistant user profile. In a production environment, this would display your actual profile information.
            </p>
          </div>
        </Container>
      </Section>
    </div>
  );
}

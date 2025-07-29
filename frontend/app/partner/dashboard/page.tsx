'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, BarChart3, Users, FileText, BookOpen, 
  PlusCircle, ArrowRight, CheckCircle, Eye
} from 'lucide-react';

// Define types
interface JobPerformance {
  id: string;
  title: string;
  location: string;
  applicants: number;
  views: number;
  posted_date: string;
  status: string;
}

interface CandidateMatch {
  id: string;
  name: string;
  match_score: number;
  job_title: string;
  skills: string[];
}

interface Activity {
  id: string;
  type: string;
  title: string;
  date: string;
  details?: string;
}

export default function PartnerDashboard() {
  // DEMO MODE: We'll use the user object if available, but won't require it
  const { user } = useAuth();
  const [demoMode] = useState(true); // Always use demo mode
  const [stats, setStats] = useState({
    activeJobListings: 8,
    totalApplications: 156,
    candidateMatches: 23,
    educationPrograms: 4,
    resourceViews: 1247,
    conversionRate: 12.5
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);
  const [topPerformingJobs, setTopPerformingJobs] = useState<JobPerformance[]>([]);
  const [candidateMatches, setCandidateMatches] = useState<CandidateMatch[]>([]);

  // DEMO MODE: Organization name for demonstration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const organizationName = user?.email?.split('@')[0] || 'Massachusetts Solar Solutions';

  useEffect(() => {
    // Always use demo mode for now
    console.log('Demo mode: Using mock data for partner dashboard');
    
    // In a production environment, this would check authentication
    // if (user) {
    //   fetchDashboardData();
    // } else {
    //   // Use mock data for demo mode
      setTimeout(() => {
        setStats({
          activeJobListings: 5,
          totalApplications: 28,
          candidateMatches: 14,
          educationPrograms: 8,
          resourceViews: 142,
          conversionRate: 18.5
        });
        
        // Mock job performance data with Massachusetts-specific job titles
        setTopPerformingJobs([
          {
            id: 'demo-job-1',
            title: 'Offshore Wind Technician',
            location: 'New Bedford, MA',
            applicants: 12,
            views: 87,
            posted_date: new Date(Date.now() - 604800000).toISOString(),
            status: 'active'
          },
          {
            id: 'demo-job-2',
            title: 'Solar Installation Team Lead',
            location: 'Worcester, MA',
            applicants: 8,
            views: 64,
            posted_date: new Date(Date.now() - 1209600000).toISOString(),
            status: 'active'
          },
          {
            id: 'demo-job-3',
            title: 'Energy Efficiency Specialist',
            location: 'Boston, MA',
            applicants: 5,
            views: 42,
            posted_date: new Date(Date.now() - 1814400000).toISOString(),
            status: 'active'
          }
        ]);
        
        // Mock candidate matches with Massachusetts-specific skills
        setCandidateMatches([
          {
            id: 'demo-candidate-1',
            name: 'Emily Rodriguez',
            match_score: 95,
            job_title: 'Massachusetts Offshore Wind Technician',
            skills: ['GWO Certification', 'Electrical Systems', 'Safety Training']
          },
          {
            id: 'demo-candidate-2',
            name: 'James Wilson',
            match_score: 92,
            job_title: 'Solar Installation Specialist',
            skills: ['PV System Design', 'Massachusetts Electrical License', 'Roofing Experience']
          },
          {
            id: 'demo-candidate-3',
            name: 'David Chen',
            match_score: 88,
            job_title: 'MassSave Energy Efficiency Specialist',
            skills: ['Building Science', 'Energy Auditing', 'MassSave Program Knowledge']
          },
          {
            id: 'demo-candidate-4',
            name: 'Sophia Williams',
            match_score: 94,
            job_title: 'Clean Energy Policy Analyst',
            skills: ['Massachusetts Climate Policy', 'Data Analysis', 'Stakeholder Engagement']
          },
        ]);
      // }
    }, 500);
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch real analytics data
      const response = await fetch('/api/v1/analytics?user_type=partner&time_range=30d');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const analyticsData = data.data;
          setStats({
            activeJobListings: analyticsData.overview?.active_jobs || 0,
            totalApplications: analyticsData.overview?.total_applications || 0,
            candidateMatches: 0, // Placeholder until candidate matching is implemented
            educationPrograms: 0, // Placeholder until programs feature is implemented
            resourceViews: 0, // Placeholder until view tracking is implemented
            conversionRate: analyticsData.overview?.conversion_rate || 0
          });
          
          // Set job performance data
          setTopPerformingJobs(analyticsData.job_performance || []);
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    }
  };

  return (
    <div className="bg-sand-gray min-h-screen">
      <Section className="py-8">
        <Container>
          {/* Header with welcome message and frame accent */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-0 w-2 h-full bg-spring-green"></div>
            <div className="pl-4">
              <h1 className="text-3xl font-bold text-midnight-forest">Welcome to the Massachusetts Climate Economy, {organizationName}!</h1>
              <p className="text-moss-green mt-1">Manage your Massachusetts clean energy talent pipeline and grow your team</p>
              <p className="text-sm text-moss-green mt-1">Access 42,000+ new clean energy professionals by 2030 through the Alliance for Climate Transition (ACT) network</p>
            </div>
          </div>

          {/* Demo Navigation Helper */}
          <div className="mb-8 card bg-gradient-to-r from-spring-green to-sand-gray shadow-sm border border-spring-green rounded-lg">
            <div className="card-body p-4">
              <h3 className="card-title text-lg flex items-center text-midnight-forest">
                Demo Mode - Massachusetts Clean Energy Employer Dashboard
              </h3>
              <p className="text-sm text-moss-green mb-3">
                You're viewing the <strong>Massachusetts Employer Dashboard</strong> - see how clean energy companies access talent, training programs, and incentives. Explore other perspectives:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/dashboard" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-sm">
                  Massachusetts Job Seeker Dashboard - Clean energy career guidance and training
                </Link>
                <Link href="/admin" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-sm">
                  ACT Admin Dashboard - Climate economy ecosystem management
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-spring-green">
                <p className="text-xs text-moss-green">
                  <strong>Massachusetts Employer Features:</strong> Post clean energy jobs, access MassCEC workforce development programs, connect with training partners, and leverage state incentives. 
                  Try the <Link href="/chat" className="text-moss-green font-bold hover:underline">Massachusetts Climate AI Assistant</Link> with your OpenAI API key.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Active Jobs</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.activeJobListings}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <Briefcase className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Applications</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.totalApplications}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <FileText className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Candidate Matches</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.candidateMatches}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <Users className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Programs</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.educationPrograms}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <BookOpen className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Resource Views</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.resourceViews}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <Eye className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Conversion Rate</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.conversionRate}%</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <BarChart3 className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* Top Performing Jobs */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-midnight-forest">Top Performing Jobs</h2>
                    <Button className="bg-moss-green text-white hover:bg-midnight-forest">
                      <Link href="/partner/jobs">View All Jobs</Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {topPerformingJobs.map((job) => (
                      <div key={job.id} className="p-4 border border-sand-gray rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="font-medium text-midnight-forest">{job.title}</h3>
                            <p className="text-sm text-moss-green">{job.location}</p>
                            <p className="text-xs text-moss-green mt-1">
                              Posted {new Date(job.posted_date).toLocaleDateString()}
                            </p>
                          </div>
                          <Badge className="bg-spring-green text-midnight-forest">
                            {job.status === 'active' ? 'Active' : job.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 my-4">
                          <div className="bg-sand-gray p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-midnight-forest">{job.applicants}</p>
                            <p className="text-xs text-moss-green">Applicants</p>
                          </div>
                          <div className="bg-sand-gray p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-midnight-forest">{Math.round(job.applicants * 0.25)}</p>
                            <p className="text-xs text-moss-green">Qualified</p>
                          </div>
                          <div className="bg-sand-gray p-3 rounded-lg text-center">
                            <p className="text-2xl font-bold text-midnight-forest">{job.views}</p>
                            <p className="text-xs text-moss-green">Views</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <Button size="sm" className="bg-moss-green text-white hover:bg-midnight-forest">
                            View Applications
                          </Button>
                          <Button size="sm" variant="outline" className="border-moss-green text-moss-green">
                            Edit Job
                          </Button>
                          <Button size="sm" variant="outline" className="border-moss-green text-moss-green">
                            Analytics
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    {topPerformingJobs.length === 0 && (
                      <div className="text-center p-6">
                        <p className="text-moss-green">No job listings found.</p>
                        <Button className="mt-4 bg-moss-green text-white hover:bg-midnight-forest">
                          <Link href="/partner/jobs/new">Post Your First Job</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
              
              {/* Hiring Pipeline Analytics */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-midnight-forest">Hiring Pipeline</h2>
                    <Button className="bg-moss-green text-white hover:bg-midnight-forest">
                      <Link href="/partner/analytics">Full Analytics</Link>
                    </Button>
                  </div>
                  
                  <div className="bg-sand-gray p-6 rounded-lg">
                    <div className="relative">
                      {/* Pipeline steps */}
                      <div className="h-2 bg-white rounded-full mb-6">
                        <div className="h-2 bg-spring-green rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      
                      {/* Pipeline stages */}
                      <div className="grid grid-cols-5 gap-2">
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-spring-green rounded-full flex items-center justify-center">
                            <span className="text-midnight-forest font-bold">156</span>
                          </div>
                          <p className="text-xs text-moss-green mt-1">Applications</p>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-spring-green rounded-full flex items-center justify-center">
                            <span className="text-midnight-forest font-bold">87</span>
                          </div>
                          <p className="text-xs text-moss-green mt-1">Screened</p>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-spring-green rounded-full flex items-center justify-center">
                            <span className="text-midnight-forest font-bold">42</span>
                          </div>
                          <p className="text-xs text-moss-green mt-1">Interviewed</p>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-white border-2 border-spring-green rounded-full flex items-center justify-center">
                            <span className="text-midnight-forest font-bold">18</span>
                          </div>
                          <p className="text-xs text-moss-green mt-1">Offers</p>
                        </div>
                        <div className="text-center">
                          <div className="w-10 h-10 mx-auto bg-white border-2 border-spring-green rounded-full flex items-center justify-center">
                            <span className="text-midnight-forest font-bold">12</span>
                          </div>
                          <p className="text-xs text-moss-green mt-1">Hired</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-moss-green">Time to Fill (avg)</p>
                        <p className="text-2xl font-bold text-midnight-forest">24 days</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg">
                        <p className="text-sm text-moss-green">Cost per Hire (avg)</p>
                        <p className="text-2xl font-bold text-midnight-forest">$1,450</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Right Column - 1/3 width */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="bg-midnight-forest text-white shadow-md">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <Link href="/partner/jobs/new" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <PlusCircle className="h-4 w-4" />
                        <span>Post New Job</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/partner/candidates" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Browse Candidates</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/partner/programs/new" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Create Training Program</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/partner/profile" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Update Company Profile</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
              
              {/* Recent Candidate Matches */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">Candidate Matches</h2>
                  
                  <div className="space-y-4">
                    {candidateMatches.map((candidate) => (
                      <div key={candidate.id} className="p-3 border border-sand-gray rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-medium text-midnight-forest">{candidate.name}</h3>
                          <Badge className="bg-spring-green text-moss-green">{candidate.match_score}% Match</Badge>
                        </div>
                        <p className="text-sm text-moss-green">{candidate.job_title}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {candidate.skills.map((skill, index) => (
                            <span key={index} className="text-xs px-2 py-1 bg-sand-gray text-moss-green rounded-full">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Link href="/partner/candidates" className="text-sm font-medium text-moss-green hover:text-midnight-forest flex items-center justify-end gap-1">
                      View all candidates
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
              
              {/* Performance Insights */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">Performance Insights</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-moss-green">Job Views</span>
                        <span className="text-moss-green font-medium">+23%</span>
                      </div>
                      <div className="h-2 bg-sand-gray rounded-full">
                        <div className="h-2 bg-spring-green rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-moss-green">Applications</span>
                        <span className="text-moss-green font-medium">+15%</span>
                      </div>
                      <div className="h-2 bg-sand-gray rounded-full">
                        <div className="h-2 bg-spring-green rounded-full" style={{ width: '60%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-moss-green">Quality Score</span>
                        <span className="text-moss-green font-medium">4.8/5</span>
                      </div>
                      <div className="h-2 bg-sand-gray rounded-full">
                        <div className="h-2 bg-spring-green rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4 bg-moss-green text-white hover:bg-midnight-forest">
                    <Link href="/partner/analytics">View Full Report</Link>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

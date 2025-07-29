'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Calendar, Briefcase, MessageSquare, CheckCircle, Clock } from 'lucide-react';

// Define types for dashboard data
interface DashboardStats {
  totalConversations: number;
  savedJobs: number;
  upcomingMeetings: number;
  completedSessions: number;
  massCECProgramsExplored?: number;
  massachusettsCleanEnergyJobsViewed?: number;
}

interface UpcomingBooking {
  id: string;
  agent_name: string;
  team_name: string;
  datetime: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'cancelled';
}

interface RecentActivity {
  type: 'conversation' | 'job_saved' | 'booking_created' | 'session_completed';
  title: string;
  date: string;
  agent?: string;
}

const SettingsForm = dynamic(() => import('@/components/SettingsForm'), { ssr: false });
const MassachusettsWorkforcePricing = dynamic(() => import('@/components/MassachusettsWorkforcePricing'), { ssr: false });

const DashboardPage = () => {
  const { user, profile } = useAuth();
  const [demoMode] = useState(true); // Always use demo mode
  const [stats, setStats] = useState<DashboardStats>({
    totalConversations: 0,
    savedJobs: 0,
    upcomingMeetings: 0,
    completedSessions: 0
  });
  const [upcomingBookings, setUpcomingBookings] = useState<UpcomingBooking[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isStatsLoading, setIsStatsLoading] = useState(true);

  // DEMO MODE: Use a demo name if user is not authenticated
  const fullName = (profile as any)?.full_name || (user as any)?.user_metadata?.full_name || (user as any)?.email?.split('@')[0] || 'Demo User';

  // DEMO MODE: Auth redirect is disabled to allow visitors to explore the dashboard
  // In a production environment, uncomment this code to enable authentication
  /*
  useEffect(() => {
    if (!loading && !user) {
      // User is not authenticated, redirect to login
      window.location.href = '/auth/login';
      return;
    }
  }, [user, loading]);

  // Don't render anything if not authenticated
  if (!loading && !user) {
    return null;
  }
  */
  
  useEffect(() => {
    // Always use demo mode for now
    console.log('Demo mode: Using mock data for dashboard');
    
    // In a production environment, this would check authentication
    // if (user) {
    //   fetchDashboardData();
    // } else {
    //   // Use mock data for demo mode
      setTimeout(() => {
        setStats({
          totalConversations: 14,
          savedJobs: 8,
          upcomingMeetings: 2,
          completedSessions: 12,
          massCECProgramsExplored: 5,
          massachusettsCleanEnergyJobsViewed: 24
        });
        
        // Mock upcoming bookings with Massachusetts-specific career advisors
        setUpcomingBookings([
          {
            id: 'demo-1',
            agent_name: 'Sarah Johnson',
            team_name: 'MassCEC Career Advisor Team',
            datetime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
            duration_minutes: 30,
            status: 'confirmed'
          },
          {
            id: 'demo-2',
            agent_name: 'Michael Chen',
            team_name: 'Massachusetts Clean Energy Technical Skills Team',
            datetime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
            duration_minutes: 45,
            status: 'pending'
          }
        ]);
        
        // Mock recent activity with Massachusetts-specific content
        setRecentActivity([
          {
            type: 'conversation',
            title: 'Chat with AI Assistant about Massachusetts offshore wind careers',
            date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          },
          {
            type: 'job_saved',
            title: 'Solar Panel Installer at SunPower Massachusetts',
            date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          },
          {
            type: 'session_completed',
            title: 'MassCEC Clean Energy Internship Program Application Review',
            date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
            agent: 'MassCEC Career Services'
          },
          {
            type: 'booking_created',
            title: 'ACT Climate Economy Career Guidance Session',
            date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
            agent: 'Sarah Johnson'
          }
        ]);
        
        setIsStatsLoading(false);
      }, 500);
    // }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setIsStatsLoading(true);
      // In a real implementation, these would be API calls to fetch actual data
      // For now, we'll use the same mock data
      
          setStats({
        totalConversations: 14,
        savedJobs: 8,
        upcomingMeetings: 2,
        completedSessions: 12
      });
      
      // Mock upcoming bookings - would be fetched from an API
      setUpcomingBookings([
        {
          id: 'demo-1',
          agent_name: 'Sarah Johnson',
          team_name: 'Career Advisor Team',
          datetime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          duration_minutes: 30,
          status: 'confirmed'
        },
        {
          id: 'demo-2',
          agent_name: 'Michael Chen',
          team_name: 'Technical Skills Team',
          datetime: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
          duration_minutes: 45,
          status: 'pending'
        }
      ]);
      
      // Mock recent activity - would be fetched from an API
      setRecentActivity([
        {
            type: 'conversation',
          title: 'Chat with AI Assistant about renewable energy careers',
          date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
        {
          type: 'job_saved',
          title: 'Solar Panel Installer at SunPower Inc',
          date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        },
        {
          type: 'session_completed',
          title: 'Resume Review Session',
          date: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
          agent: 'Career Services'
        },
        {
          type: 'booking_created',
          title: 'Career Guidance Session',
          date: new Date(Date.now() - 604800000).toISOString(), // 7 days ago
          agent: 'Sarah Johnson'
        }
      ]);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsStatsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-sand-gray min-h-screen">
      <Section className="py-8">
        <Container>
          {/* Header with welcome message and frame accent */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-0 w-2 h-full bg-spring-green"></div>
            <div className="pl-4">
              <h1 className="text-3xl font-bold text-midnight-forest">Welcome to Massachusetts Clean Energy, {fullName}!</h1>
              <p className="text-moss-green mt-1">Your Massachusetts climate economy career dashboard</p>
              <p className="text-sm text-moss-green mt-1">Powered by the Alliance for Climate Transition (ACT) and MassCEC</p>
            </div>
          </div>

          {/* Demo Navigation Helper */}
          <div className="mb-8 card bg-gradient-to-r from-spring-green to-sand-gray shadow-sm border border-spring-green rounded-lg">
            <div className="card-body p-4">
              <h3 className="card-title text-lg flex items-center text-midnight-forest">
                Demo Mode - Massachusetts Clean Energy Job Seeker Dashboard
              </h3>
              <p className="text-sm text-moss-green mb-3">
                You're viewing the <strong>Massachusetts Job Seeker Dashboard</strong> - explore clean energy career guidance and Massachusetts job discovery tools. Try other user perspectives:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/partner/dashboard" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-sm">
                  Massachusetts Employer Dashboard - Clean energy hiring and talent management
                </Link>
                <Link href="/admin" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-sm">
                  ACT Admin Dashboard - Climate economy platform administration
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-spring-green">
                <p className="text-xs text-moss-green">
                  <strong>Massachusetts Clean Energy Features:</strong> Track your climate career journey, explore 42,000+ new clean energy jobs by 2030, access MassCEC programs, and schedule career guidance sessions. 
                  Access the <Link href="/chat" className="text-moss-green font-bold hover:underline">Massachusetts Climate AI Assistant</Link> with your OpenAI API key.
                </p>
              </div>
              </div>
            </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white shadow-md border-l-4 border-l-spring-green">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">AI Conversations</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.totalConversations}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <MessageSquare className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-spring-green">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Saved Jobs</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.savedJobs}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <Briefcase className="h-5 w-5 text-moss-green" />
              </div>
            </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-spring-green">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Upcoming Meetings</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.upcomingMeetings}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <Calendar className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
            
            <Card className="bg-white shadow-md border-l-4 border-l-spring-green">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Completed Sessions</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.completedSessions}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <CheckCircle className="h-5 w-5 text-moss-green" />
              </div>
            </div>
              </div>
            </Card>
          </div>

      {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2">
              {/* Career Pathway Progress */}
              <Card className="bg-white shadow-md mb-6">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">Your Clean Energy Career Pathway</h2>
                  
                  <div className="relative">
                    {/* Progress bar */}
                    <div className="h-2 bg-sand-gray rounded-full mb-6">
                      <div className="h-2 bg-spring-green rounded-full" style={{ width: '35%' }}></div>
                    </div>
                    
                    {/* Progress steps */}
                    <div className="flex justify-between mb-2">
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-spring-green mx-auto mb-1 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-midnight-forest" />
                        </div>
                        <p className="text-xs text-moss-green">Profile</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-spring-green mx-auto mb-1 flex items-center justify-center">
                          <CheckCircle className="h-4 w-4 text-midnight-forest" />
                        </div>
                        <p className="text-xs text-moss-green">Skills</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-sand-gray mx-auto mb-1 flex items-center justify-center">
                          <span className="text-xs font-bold text-moss-green">3</span>
                        </div>
                        <p className="text-xs text-moss-green">Training</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-sand-gray mx-auto mb-1 flex items-center justify-center">
                          <span className="text-xs font-bold text-moss-green">4</span>
                        </div>
                        <p className="text-xs text-moss-green">Jobs</p>
                      </div>
                      <div className="text-center">
                        <div className="w-6 h-6 rounded-full bg-sand-gray mx-auto mb-1 flex items-center justify-center">
                          <span className="text-xs font-bold text-moss-green">5</span>
                  </div>
                        <p className="text-xs text-moss-green">Career</p>
                </div>
              </div>
            </div>

                  <div className="mt-4 p-4 bg-spring-green rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-1">Next Step: Complete a Massachusetts Training Program</h3>
                    <p className="text-sm text-moss-green mb-3">Based on your profile and skills, we recommend these Massachusetts clean energy training options:</p>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-spring-green"></div>
                        <span className="text-sm">MassCEC Clean Energy Internship Program</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-spring-green"></div>
                        <span className="text-sm">Technical Trades Work and Learning Program</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-spring-green"></div>
                        <span className="text-sm">Mass Save Clean Energy Pathways Program</span>
                      </li>
                    </ul>
                    <Button className="mt-4 bg-moss-green text-white hover:bg-midnight-forest">
                      Explore Massachusetts Training Options
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-midnight-forest">Recent Activity</h2>
                    <Badge className="bg-spring-green text-midnight-forest">Last 7 Days</Badge>
                  </div>
                  
                  {recentActivity.length > 0 ? (
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex gap-4 p-3 hover:bg-sand-gray rounded-lg transition-colors">
                          <div className="mt-1">
                            {activity.type === 'conversation' && (
                              <div className="p-2 bg-spring-green rounded-full">
                                <MessageSquare className="h-4 w-4 text-moss-green" />
                              </div>
                            )}
                            {activity.type === 'job_saved' && (
                              <div className="p-2 bg-spring-green rounded-full">
                                <Briefcase className="h-4 w-4 text-moss-green" />
                              </div>
                            )}
                            {activity.type === 'booking_created' && (
                              <div className="p-2 bg-spring-green rounded-full">
                                <Calendar className="h-4 w-4 text-moss-green" />
                              </div>
                            )}
                            {activity.type === 'session_completed' && (
                              <div className="p-2 bg-spring-green rounded-full">
                                <CheckCircle className="h-4 w-4 text-moss-green" />
                              </div>
                            )}
                          </div>
                            <div>
                            <h3 className="font-medium text-midnight-forest">{activity.title}</h3>
                            <div className="flex gap-2 text-xs text-moss-green mt-1">
                              <span>{new Date(activity.date).toLocaleDateString()}</span>
                              {activity.agent && (
                                <>
                                  <span>•</span>
                                  <span>{activity.agent}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-moss-green">No recent activity to display.</p>
                  )}
                  
                  <div className="mt-4 text-right">
                    <Link href="/profile/activity" className="text-sm font-medium text-moss-green hover:text-midnight-forest flex items-center justify-end gap-1">
                      View all activity
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
              </div>

            {/* Right Column */}
            <div>
              {/* Upcoming Bookings */}
              <Card className="bg-white shadow-md mb-6">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">Upcoming Meetings</h2>
                  
                  {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                      {upcomingBookings.map((booking) => (
                        <div key={booking.id} className="p-3 border border-sand-gray rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Clock className="h-4 w-4 text-moss-green" />
                            <span className="text-sm font-medium text-midnight-forest">
                              {formatDate(booking.datetime)}
                            </span>
                          </div>
                          <h3 className="font-medium text-midnight-forest">{booking.agent_name}</h3>
                          <p className="text-xs text-moss-green">{booking.team_name}</p>
                          <div className="flex justify-between items-center mt-3">
                            <Badge className={`${
                              booking.status === 'confirmed' 
                                ? 'bg-spring-green text-midnight-forest' 
                                : 'bg-sand-gray text-moss-green'
                            }`}>
                              {booking.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                            </Badge>
                            <span className="text-xs text-moss-green">{booking.duration_minutes} min</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-moss-green">No upcoming meetings scheduled.</p>
                  )}
                  
                  <Button className="w-full mt-4 bg-moss-green text-white hover:bg-midnight-forest">
                    Schedule New Meeting
                  </Button>
                </div>
              </Card>
              
              {/* Recommended Jobs */}
              <Card className="bg-white shadow-md mb-6">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">Recommended Jobs</h2>
                  
                  <div className="space-y-4">
                    <div className="p-3 border border-sand-gray rounded-lg">
                      <Badge className="mb-2 bg-spring-green text-moss-green">94% Match</Badge>
                      <h3 className="font-medium text-midnight-forest">Solar Installation Technician</h3>
                      <p className="text-xs text-moss-green">Massachusetts Solar Solutions • Boston, MA</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-sand-gray text-moss-green text-xs">Full-time</Badge>
                        <Badge className="bg-sand-gray text-moss-green text-xs">Entry Level</Badge>
                        <Badge className="bg-sand-gray text-moss-green text-xs">$65K-$75K</Badge>
                      </div>
                      <p className="text-xs text-moss-green mt-2">+174% growth in MA by 2030</p>
                    </div>
                    
                    <div className="p-3 border border-sand-gray rounded-lg">
                      <Badge className="mb-2 bg-spring-green text-moss-green">87% Match</Badge>
                      <h3 className="font-medium text-midnight-forest">Energy Efficiency Specialist</h3>
                      <p className="text-xs text-moss-green">MassSave Program • Cambridge, MA</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-sand-gray text-moss-green text-xs">Full-time</Badge>
                        <Badge className="bg-sand-gray text-moss-green text-xs">Mid Level</Badge>
                        <Badge className="bg-sand-gray text-moss-green text-xs">$78K-$92K</Badge>
                      </div>
                      <p className="text-xs text-moss-green mt-2">+86% growth in MA by 2030</p>
                    </div>
                    
                    <div className="p-3 border border-sand-gray rounded-lg">
                      <Badge className="mb-2 bg-spring-green text-moss-green">82% Match</Badge>
                      <h3 className="font-medium text-midnight-forest">Offshore Wind Technician</h3>
                      <p className="text-xs text-moss-green">Vineyard Wind • New Bedford, MA</p>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-sand-gray text-moss-green text-xs">Full-time</Badge>
                        <Badge className="bg-sand-gray text-moss-green text-xs">Entry Level</Badge>
                        <Badge className="bg-sand-gray text-moss-green text-xs">$72K-$85K</Badge>
                      </div>
                      <p className="text-xs text-moss-green mt-2">+128% growth in MA by 2030</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Link href="/jobs" className="text-sm font-medium text-moss-green hover:text-midnight-forest flex items-center justify-end gap-1">
                      View all jobs
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
              
              {/* Quick Actions */}
              <Card className="bg-midnight-forest text-white shadow-md">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                  
                  <div className="space-y-3">
                    <Link href="/chat" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span>Chat with Massachusetts Climate AI Assistant</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/profile/resume" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span>Update Resume for Clean Energy Careers</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/jobs/saved" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span>View Massachusetts Clean Energy Jobs</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/booking" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span>Schedule MassCEC Career Guidance</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/resources" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span>Explore ACT Climate Economy Resources</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
              </div>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
};

export default DashboardPage;

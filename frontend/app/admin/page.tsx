'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { 
  Users, Settings, FileText, BarChart3, Globe, 
  ShieldAlert, BookOpen, ArrowRight, Building, Briefcase
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(false); // Set to false initially for demo mode
  const [fullName, setFullName] = useState('Demo Admin');
  const [error, setError] = useState<string | null>(null);
  const [demoMode, setDemoMode] = useState(true); // Add demo mode flag
  const [stats, setStats] = useState({
    totalUsers: 1248,
    activeUsers: 856,
    totalJobs: 312,
    flaggedContent: 8,
    conversionRate: 12.5,
    newRegistrations: 34,
    massCECProgramsActive: 12,
    massachusettsEmployersEngaged: 250,
    cleanEnergyTrainingPrograms: 45,
    projectedJobGrowth: 42000
  });

  // Skip authentication in demo mode
  useEffect(() => {
    // Demo mode is enabled by default, so we don't need to do anything
    console.log("Admin dashboard running in demo mode");
    
    // This code is commented out to prevent the deep type instantiation error
    // If you want to enable real authentication, uncomment this code
    /*
    if (!demoMode) {
      const fetchUser = async () => {
        setLoading(true);
        try {
          const { data: authData } = await supabase.auth.getUser();
          if (authData && authData.user) {
            const { data: profileData } = await supabase
              .from('consolidated_profiles')
              .select('full_name')
              .eq('user_id', authData.user.id)
              .single();
            
            if (profileData) {
              setFullName(profileData.full_name || 'Admin User');
              setDemoMode(false);
            }
          }
        } catch (err) {
          console.error("Error fetching user:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchUser();
    }
    */
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-gray flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-spring-green border-t-[#001818] rounded-full animate-spin"></div>
      </div>
    );
  }

  // Don't show error in demo mode
  if (error && !demoMode) {
    return (
      <div className="min-h-screen bg-sand-gray flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-md">
          <h2 className="text-xl font-bold text-midnight-forest mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
          <Button className="mt-4 bg-moss-green text-white hover:bg-midnight-forest">
            <Link href="/auth/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-sand-gray min-h-screen">
      <Section className="py-8">
        <Container>
          {/* Header with welcome message and frame accent */}
          <div className="relative mb-8">
            <div className="absolute left-0 top-0 w-2 h-full bg-spring-green"></div>
            <div className="pl-4">
              <h1 className="text-3xl font-bold text-midnight-forest">Welcome to ACT Administration, {fullName}!</h1>
              <p className="text-moss-green mt-1">Massachusetts Climate Economy Assistant administration dashboard</p>
              <p className="text-sm text-moss-green mt-1">Alliance for Climate Transition (ACT) - Accelerating the just, equitable and rapid transition to a clean energy future</p>
            </div>
          </div>

          {/* Demo Mode Banner */}
          <div className="mb-8 card bg-gradient-to-r from-spring-green to-sand-gray shadow-sm border border-spring-green rounded-lg">
            <div className="card-body p-4">
              <h3 className="card-title text-lg flex items-center text-midnight-forest">
                Demo Mode - ACT Climate Economy Administrator Dashboard
              </h3>
              <p className="text-sm text-moss-green mb-3">
                You're viewing the <strong>ACT Administrator Dashboard</strong> - explore Massachusetts climate economy platform administration features. Try other user perspectives:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <Link href="/dashboard" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-sm">
                  Massachusetts Job Seeker Dashboard - Clean energy career guidance and training
                </Link>
                <Link href="/partner/dashboard" className="btn bg-moss-green text-white hover:bg-midnight-forest btn-sm">
                  Massachusetts Employer Dashboard - Clean energy hiring and workforce development
                </Link>
              </div>
              <div className="mt-3 pt-3 border-t border-spring-green">
                <p className="text-xs text-moss-green">
                  <strong>ACT Admin Features:</strong> Manage Massachusetts clean energy ecosystem users, moderate climate content, track workforce analytics, and configure MassCEC program resources. 
                  Access the <Link href="/chat" className="text-moss-green font-bold hover:underline">Massachusetts Climate AI Assistant</Link> with your OpenAI API key.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">Total Users</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.totalUsers}</h3>
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
                    <p className="text-sm text-moss-green font-medium">Active Users</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.activeUsers}</h3>
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
                    <p className="text-sm text-moss-green font-medium">Total Jobs</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.totalJobs}</h3>
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
                    <p className="text-sm text-moss-green font-medium">Flagged Content</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.flaggedContent}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <ShieldAlert className="h-5 w-5 text-moss-green" />
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
            
            <Card className="bg-white shadow-md border-l-4 border-l-[#B2DE26]">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-moss-green font-medium">New Users</p>
                    <h3 className="text-2xl font-bold text-midnight-forest">{stats.newRegistrations}</h3>
                  </div>
                  <div className="bg-spring-green p-3 rounded-full">
                    <Users className="h-5 w-5 text-moss-green" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2/3 width */}
            <div className="lg:col-span-2 space-y-6">
              {/* User Management */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-midnight-forest">User Management</h2>
                    <Button className="bg-moss-green text-white hover:bg-midnight-forest">
                      <Link href="/admin/users">View All Users</Link>
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-sand-gray">
                          <th className="p-2 text-left font-medium text-midnight-forest">Name</th>
                          <th className="p-2 text-left font-medium text-midnight-forest">Email</th>
                          <th className="p-2 text-left font-medium text-midnight-forest">Role</th>
                          <th className="p-2 text-left font-medium text-midnight-forest">Location</th>
                          <th className="p-2 text-left font-medium text-midnight-forest">Status</th>
                          <th className="p-2 text-left font-medium text-midnight-forest">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-sand-gray">
                          <td className="p-2">John Smith</td>
                          <td className="p-2">john.smith@example.com</td>
                          <td className="p-2">Clean Energy Job Seeker</td>
                          <td className="p-2">Boston, MA</td>
                          <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                          <td className="p-2">
                            <Button size="sm" variant="outline" className="text-xs">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-sand-gray">
                          <td className="p-2">Jane Doe</td>
                          <td className="p-2">jane.doe@masssolar.com</td>
                          <td className="p-2">Massachusetts Solar Employer</td>
                          <td className="p-2">Worcester, MA</td>
                          <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                          <td className="p-2">
                            <Button size="sm" variant="outline" className="text-xs">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-sand-gray">
                          <td className="p-2">Mike Johnson</td>
                          <td className="p-2">mike@masscec.com</td>
                          <td className="p-2">MassCEC Program Admin</td>
                          <td className="p-2">Cambridge, MA</td>
                          <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                          <td className="p-2">
                            <Button size="sm" variant="outline" className="text-xs">View</Button>
                          </td>
                        </tr>
                        <tr className="border-b border-sand-gray">
                          <td className="p-2">Sarah Williams</td>
                          <td className="p-2">sarah@joinact.org</td>
                          <td className="p-2">ACT Program Manager</td>
                          <td className="p-2">Boston, MA</td>
                          <td className="p-2"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Active</span></td>
                          <td className="p-2">
                            <Button size="sm" variant="outline" className="text-xs">View</Button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>
              
              {/* Content Moderation */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-midnight-forest">Content Moderation</h2>
                    <Button className="bg-moss-green text-white hover:bg-midnight-forest">
                      <Link href="/admin/content">View All Content</Link>
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-sand-gray rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-midnight-forest">Flagged Massachusetts Clean Energy Job Posting</h3>
                          <p className="text-sm text-moss-green mt-1">Reported for: Salary misrepresentation for Offshore Wind Technician role</p>
                          <p className="text-xs text-moss-green mt-2">Reported by: MassCEC Program Manager • 2 hours ago</p>
                          <p className="text-xs text-moss-green mt-1">Note: Salary range ($45-55K) is below Massachusetts industry standard ($72-85K)</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">Remove</Button>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">Approve</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-sand-gray rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-midnight-forest">Flagged Climate Economy Resource</h3>
                          <p className="text-sm text-moss-green mt-1">Reported for: Outdated MassCEC program information</p>
                          <p className="text-xs text-moss-green mt-2">Reported by: ACT Content Manager • 5 hours ago</p>
                          <p className="text-xs text-moss-green mt-1">Note: Clean Energy Internship Program details need updating for 2024 cycle</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">Remove</Button>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">Update</Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border border-sand-gray rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-midnight-forest">New Massachusetts Training Program</h3>
                          <p className="text-sm text-moss-green mt-1">Pending approval: Grid Modernization Certificate Program</p>
                          <p className="text-xs text-moss-green mt-2">Submitted by: Greenfield Community College • 1 day ago</p>
                          <p className="text-xs text-moss-green mt-1">Note: Aligns with Massachusetts clean energy workforce needs</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">Reject</Button>
                          <Button size="sm" variant="outline" className="border-green-500 text-green-500 hover:bg-green-50">Approve</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
              
              {/* Analytics Dashboard */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-midnight-forest">Analytics Overview</h2>
                    <Button className="bg-moss-green text-white hover:bg-midnight-forest">
                      <Link href="/admin/analytics">View Full Analytics</Link>
                    </Button>
                  </div>
                  
                  <div className="bg-sand-gray p-6 rounded-lg text-center">
                    <BarChart3 className="h-12 w-12 mx-auto text-moss-green mb-4" />
                    <p className="text-moss-green">Analytics visualization would appear here</p>
                    <p className="text-sm text-moss-green mt-2">View the full analytics dashboard for detailed metrics</p>
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
                    <Link href="/admin/users" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>Manage Massachusetts Climate Economy Users</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/admin/content" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>Moderate Clean Energy Content</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/admin/analytics" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        <span>View Massachusetts Workforce Analytics</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/admin/resources" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        <span>Manage MassCEC Training Programs</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/admin/jobs" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" />
                        <span>Manage Clean Energy Job Listings</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/admin/partners" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        <span>Manage Massachusetts Employer Partners</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    
                    <Link href="/admin/settings" className="flex items-center justify-between p-3 bg-moss-green hover:bg-spring-green hover:text-midnight-forest rounded-lg transition-colors">
                      <span className="flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        <span>ACT Platform Settings</span>
                      </span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
              
              {/* System Status */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">System Status</h2>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-midnight-forest">Massachusetts Climate AI Services</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-midnight-forest">Clean Energy Job Database</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-midnight-forest">MassCEC Program Authentication</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-midnight-forest">Massachusetts Training API</span>
                      </div>
                      <span className="text-sm text-yellow-600">Degraded</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-midnight-forest">ACT Resource Storage</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-midnight-forest">Massachusetts Employer Portal</span>
                      </div>
                      <span className="text-sm text-green-600">Operational</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Link href="/admin/system" className="text-sm font-medium text-moss-green hover:text-midnight-forest flex items-center justify-end gap-1">
                      View system details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </Card>
              
              {/* Recent Notifications */}
              <Card className="bg-white shadow-md">
                <div className="card-body p-6">
                  <h2 className="text-xl font-bold text-midnight-forest mb-4">Recent Notifications</h2>
                  
                  <div className="space-y-4">
                    <div className="p-3 border-l-4 border-l-yellow-500 bg-yellow-50 rounded-r-lg">
                      <h3 className="font-medium text-midnight-forest">Massachusetts Training API Alert</h3>
                      <p className="text-sm text-moss-green mt-1">MassCEC training program data sync performance degraded</p>
                      <p className="text-xs text-moss-green mt-2">30 minutes ago</p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
                      <h3 className="font-medium text-midnight-forest">New Massachusetts Employer Partner</h3>
                      <p className="text-sm text-moss-green mt-1">Vineyard Wind (New Bedford) has registered as a clean energy employer</p>
                      <p className="text-xs text-moss-green mt-2">2 hours ago</p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
                      <h3 className="font-medium text-midnight-forest">ACT Climate Economy Report</h3>
                      <p className="text-sm text-moss-green mt-1">Q2 2024 Massachusetts Clean Energy Jobs Report published</p>
                      <p className="text-xs text-moss-green mt-2">6 hours ago</p>
                    </div>
                    
                    <div className="p-3 border-l-4 border-l-blue-500 bg-blue-50 rounded-r-lg">
                      <h3 className="font-medium text-midnight-forest">MassCEC Program Update</h3>
                      <p className="text-sm text-moss-green mt-1">Clean Energy Internship Program applications open for Summer 2024</p>
                      <p className="text-xs text-moss-green mt-2">1 day ago</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-right">
                    <Link href="/admin/notifications" className="text-sm font-medium text-moss-green hover:text-midnight-forest flex items-center justify-end gap-1">
                      View all notifications
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

export default AdminDashboardPage;

'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// Define the ResourceUploader component
const ResourceUploader = ({ resourceType }: { resourceType: 'knowledge' | 'job' | 'education' }) => {
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState('article');
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');

  // Get target table based on resource type
  const getTargetTable = () => {
    switch (resourceType) {
      case 'knowledge': return 'knowledge_resources';
      case 'job': return 'job_listings';
      case 'education': return 'education_programs';
      default: return 'knowledge_resources';
    }
  };

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Handle resource upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((uploadMethod === 'file' && !file) || (uploadMethod === 'url' && !url)) {
      toast.error('Please provide either a file or URL');
      return;
    }
    
    if (!title) {
      toast.error('Title is required');
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user token
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to upload resources');
        setLoading(false);
        return;
      }
      
      // Prepare form data
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('content_type', contentType);
      formData.append('target_table', getTargetTable());
      
      // Add file or URL
      if (uploadMethod === 'file' && file) {
        formData.append('file', file);
      } else if (uploadMethod === 'url' && url) {
        formData.append('url', url);
      }
      
      // Additional metadata for specific resource types
      if (resourceType === 'job') {
        const jobMetadata = {
          company: (document.getElementById('company') as HTMLInputElement)?.value || '',
          location: (document.getElementById('location') as HTMLInputElement)?.value || '',
          application_url: (document.getElementById('application_url') as HTMLInputElement)?.value || url || ''
        };
        formData.append('additional_metadata', JSON.stringify(jobMetadata));
      } else if (resourceType === 'education') {
        const educationMetadata = {
          institution: (document.getElementById('institution') as HTMLInputElement)?.value || '',
          application_url: (document.getElementById('application_url') as HTMLInputElement)?.value || url || ''
        };
        formData.append('additional_metadata', JSON.stringify(educationMetadata));
      }
      
      // Call RAG pipeline API
      const response = await fetch('/api/v1/rag-pipeline/process', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Resource upload started');
        // Reset form
        setTitle('');
        setDescription('');
        setFile(null);
        setUrl('');
      } else {
        toast.error(`Upload error: ${result.detail || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resource');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-lg">
      <div className="card-body">
        <h2 className="card-title">Upload {resourceType === 'knowledge' ? 'Knowledge Resource' : 
                                        resourceType === 'job' ? 'Job Listing' : 
                                        'Education Program'}</h2>
        
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Title</span>
            </label>
            <input
              type="text"
              placeholder="Resource title"
              className="input input-bordered"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Description</span>
            </label>
            <textarea
              placeholder="Brief description"
              className="textarea textarea-bordered h-20"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          
          <div className="form-control">
            <label className="label">
              <span className="label-text">Content Type</span>
            </label>
            <select
              className="select select-bordered"
              value={contentType}
              onChange={(e) => setContentType(e.target.value)}
              required
            >
              {resourceType === 'knowledge' ? (
                <>
                  <option value="article">Article</option>
                  <option value="guide">Guide</option>
                  <option value="report">Report</option>
                  <option value="case_study">Case Study</option>
                </>
              ) : resourceType === 'job' ? (
                <>
                  <option value="job_posting">Job Posting</option>
                  <option value="internship">Internship</option>
                  <option value="fellowship">Fellowship</option>
                </>
              ) : (
                <>
                  <option value="course">Course</option>
                  <option value="degree">Degree Program</option>
                  <option value="certification">Certification</option>
                  <option value="workshop">Workshop</option>
                </>
              )}
            </select>
          </div>
          
          {/* Resource-specific fields */}
          {resourceType === 'job' && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Company</span>
                </label>
                <input
                  id="company"
                  type="text"
                  placeholder="Company name"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Location</span>
                </label>
                <input
                  id="location"
                  type="text"
                  placeholder="Job location"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Application URL</span>
                </label>
                <input
                  id="application_url"
                  type="url"
                  placeholder="https://example.com/apply"
                  className="input input-bordered"
                />
              </div>
            </>
          )}
          
          {resourceType === 'education' && (
            <>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Institution</span>
                </label>
                <input
                  id="institution"
                  type="text"
                  placeholder="School or organization"
                  className="input input-bordered"
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Application URL</span>
                </label>
                <input
                  id="application_url"
                  type="url"
                  placeholder="https://example.com/apply"
                  className="input input-bordered"
                />
              </div>
            </>
          )}
          
          <div className="divider">Upload Method</div>
          
          <div className="flex justify-center gap-4">
            <button 
              type="button"
              className={`btn ${uploadMethod === 'file' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUploadMethod('file')}
            >
              Upload File
            </button>
            <button 
              type="button"
              className={`btn ${uploadMethod === 'url' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setUploadMethod('url')}
            >
              Use URL
            </button>
          </div>
          
          {uploadMethod === 'file' ? (
            <div className="form-control">
              <label className="label">
                <span className="label-text">Upload File (PDF only)</span>
              </label>
              <input
                type="file"
                className="file-input file-input-bordered w-full"
                onChange={handleFileChange}
                accept=".pdf"
              />
            </div>
          ) : (
            <div className="form-control">
              <label className="label">
                <span className="label-text">URL</span>
              </label>
              <input
                type="url"
                placeholder="https://example.com/resource"
                className="input input-bordered"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>
          )}
          
          <div className="form-control mt-6">
            <button
              type="submit"
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Upload Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Job Status component to display processing status
const JobStatus = () => {
  const [jobs, setJobs] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Get current user token
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError('You must be logged in to view jobs');
          setLoading(false);
          return;
        }
        
        // Call RAG pipeline API
        const response = await fetch('/api/v1/rag-pipeline/jobs', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        
        const result = await response.json();
        setJobs(result.jobs || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setError('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
    // Refresh every 10 seconds
    const interval = setInterval(fetchJobs, 10000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);
  
  if (loading) {
    return <div className="text-center p-4">Loading jobs...</div>;
  }
  
  if (error) {
    return <div className="text-center text-error p-4">{error}</div>;
  }
  
  if (jobs.length === 0) {
    return <div className="text-center p-4">No processing jobs found</div>;
  }
  
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Title</th>
            <th>Status</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job: unknown, index: number) => {
            const jobData = job as { id: string; name: string; status: string; progress: number; created_at: string };
            return (
              <tr key={jobData.id || index}>
                <td className="font-mono text-xs">{jobData.id.substring(0, 8)}...</td>
                <td>{jobData.name}</td>
                <td>{jobData.status}</td>
                <td>
                  <span className={`badge ${
                    jobData.status === 'completed' ? 'badge-success' : 
                    jobData.status === 'failed' ? 'badge-error' : 
                    jobData.status === 'processing' ? 'badge-warning' : 'badge-info'
                  }`}>
                    {jobData.status}
                  </span>
                </td>
                <td>{jobData.created_at}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// Main page component
export default function AdminResourcesPage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        // Get current user and check if admin
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Redirect to login if not logged in
          router.push('/auth/signin');
          return;
        }
        
        // Check user role
        const { data: profile } = await supabase
          .from('consolidated_profiles')
          .select('profile_type')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.profile_type !== 'admin' && profile?.profile_type !== 'partner') {
          // Redirect if not admin or partner
          router.push('/');
          toast.error('You do not have access to this area');
        } else {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error('Auth error:', error);
        router.push('/auth/signin');
      }
    };
    
    checkAdmin();
  }, [router]);
  
  if (!isAdmin) {
    return <div className="container mx-auto p-8 text-center">Loading...</div>;
  }
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Resource Management</h1>
      
      <Tabs defaultValue="knowledge" className="w-full" onValueChange={() => {}}>
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="knowledge">Knowledge Resources</TabsTrigger>
          <TabsTrigger value="jobs">Job Listings</TabsTrigger>
          <TabsTrigger value="education">Education Programs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="knowledge" className="space-y-8">
          <ResourceUploader resourceType="knowledge" />
          <div className="card bg-base-100 shadow-lg mt-8">
            <div className="card-body">
              <h2 className="card-title">Processing Jobs</h2>
              <JobStatus />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="jobs" className="space-y-8">
          <ResourceUploader resourceType="job" />
          <div className="card bg-base-100 shadow-lg mt-8">
            <div className="card-body">
              <h2 className="card-title">Processing Jobs</h2>
              <JobStatus />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="education" className="space-y-8">
          <ResourceUploader resourceType="education" />
          <div className="card bg-base-100 shadow-lg mt-8">
            <div className="card-body">
              <h2 className="card-title">Processing Jobs</h2>
              <JobStatus />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function ResumeUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resume, setResume] = useState<any>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Load user data and check if resume exists
  useEffect(() => {
    const fetchUserAndResume = async () => {
      try {
        setLoading(true);
        
        // Get current user session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          router.push('/auth/signin');
          return;
        }
        
        setUserId(session.user.id);
        
        // Check if user already has a resume
        const response = await fetch(`/api/v1/rag-pipeline/resume/${session.user.id}`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.data?.has_resume) {
            setResume(result.data);
          }
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        toast.error('Failed to load your profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndResume();
  }, [router]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file type
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        toast.error('Please upload a PDF file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('File size cannot exceed 5MB');
        return;
      }
      
      setFile(selectedFile);
    }
  };

  // Handle resume upload
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a PDF resume file');
      return;
    }
    
    try {
      setUploading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to upload your resume');
        return;
      }
      
      // Prepare form data
      const formData = new FormData();
      formData.append('file', file);
      
      // Upload resume
      const response = await fetch('/api/v1/rag-pipeline/resume/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success('Resume uploaded successfully! Processing your resume...');
        // Refresh the page after a delay to show updated status
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(`Upload error: ${result.error?.message || 'Failed to upload resume'}`);
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  // Handle resume deletion
  const handleDelete = async () => {
    if (!resume?.resume_id || !confirm('Are you sure you want to delete your resume?')) {
      return;
    }
    
    try {
      setUploading(true);
      
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error('You must be logged in to delete your resume');
        return;
      }
      
      // Delete resume
      const response = await fetch(`/api/v1/rag-pipeline/resume/${resume.resume_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (response.ok) {
        toast.success('Resume deleted successfully');
        setResume(null);
      } else {
        const result = await response.json();
        toast.error(`Delete error: ${result.error?.message || 'Failed to delete resume'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8 text-center">
        <div className="flex items-center justify-center">
          <div className="loading loading-spinner loading-lg"></div>
        </div>
        <p className="mt-4">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Resume Management</h1>
        
        {resume ? (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Your Current Resume</h2>
              
              <div className="bg-base-200 p-4 rounded-lg mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-medium">{resume.filename}</p>
                    <p className="text-sm text-base-content/70">
                      Uploaded: {new Date(resume.processed_date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-base-content/70">
                      Size: {Math.round(resume.text_length / 1024)} KB text extracted
                    </p>
                  </div>
                  <div className="badge badge-success">Active</div>
                </div>
              </div>
              
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <span className="font-medium">Your resume is being used for job matching</span>
                  <p className="text-sm">Our AI will analyze your skills and suggest matching opportunities.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => router.push('/profile/job-matches')}
                >
                  View Job Matches
                </button>
                <button 
                  className="btn btn-outline btn-error"
                  onClick={handleDelete}
                  disabled={uploading}
                >
                  {uploading ? 'Processing...' : 'Replace Resume'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h2 className="card-title">Upload Your Resume</h2>
              
              <div className="alert alert-info mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <span className="font-medium">Why upload your resume?</span>
                  <p className="text-sm">Our AI will analyze your skills and suggest matching clean energy job opportunities.</p>
                </div>
              </div>
              
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Upload Resume (PDF only)</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    onChange={handleFileChange}
                    accept=".pdf"
                    disabled={uploading}
                  />
                  <label className="label">
                    <span className="label-text-alt">Max file size: 5MB</span>
                  </label>
                </div>
                
                {file && (
                  <div className="bg-base-200 p-3 rounded-lg">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{file.name}</span>
                    </div>
                  </div>
                )}
                
                <div className="form-control mt-6">
                  <button
                    type="submit"
                    className={`btn btn-primary ${uploading ? 'loading' : ''}`}
                    disabled={!file || uploading}
                  >
                    {uploading ? 'Uploading...' : 'Upload Resume'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        <div className="mt-8 bg-base-100 shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Resume Tips</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Include your name and contact information at the top</li>
            <li>List your most relevant skills for clean energy jobs</li>
            <li>Highlight any experience in renewable energy, sustainability, or related fields</li>
            <li>Include relevant education, certifications, and training</li>
            <li>Keep your resume concise and focused on clean energy career goals</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
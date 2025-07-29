/**
 * Resume Analysis Page - ACT Climate Economy Assistant
 * 
 * Purpose: Dedicated page for resume upload and analysis with Massachusetts clean energy focus
 * Location: /app/resume-analysis/page.tsx
 * 
 * Features:
 * - Resume upload and analysis interface
 * - Integration with RAG pipeline for processing
 * - Massachusetts clean energy career matching
 * - Skills extraction and job recommendations
 * - User-friendly progress tracking
 * - Mobile responsive design
 */

"use client";

import React, { useState } from 'react';
import { Section } from '@/components/ui/section';
import { Card } from '@/components/ui/card';
import ResumeAnalysis from '@/components/resume/ResumeAnalysis';

export default function ResumeAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle resume upload
  const handleResumeUpload = async (file: File) => {
    setIsProcessing(true);
    
    try {
      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('user_id', crypto.randomUUID()); // Generate user ID for demo
      
      // Upload to RAG pipeline
      const response = await fetch('/api/resume/analyze', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status}`);
      }
      
      const result = await response.json();
      console.log('Resume analysis result:', result);
      
      // For now, we'll use mock data since the RAG pipeline might not be fully configured
      // In production, this would use the actual RAG pipeline response
      
    } catch (error) {
      console.error('Resume upload error:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle analysis completion
  const handleAnalysisComplete = (analysis: any) => {
    setAnalysisResult(analysis);
  };

  return (
    <div className="min-h-screen bg-sand-gray">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">
            Resume Analysis
          </h1>
          <p className="text-moss-green">
            Get personalized insights for Massachusetts clean energy careers
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-midnight-forest mb-4">
                Upload Your Resume
              </h2>
              <ResumeAnalysis
                onUpload={handleResumeUpload}
                onAnalysisComplete={handleAnalysisComplete}
                maxFileSize={5 * 1024 * 1024} // 5MB
                disabled={isProcessing}
              />
            </Card>
          </div>

          {/* Information Section */}
          <div className="space-y-6">
            {/* How It Works */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-midnight-forest mb-4">
                How It Works
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-spring-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-spring-green font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-midnight-forest">Upload Resume</h4>
                    <p className="text-sm text-sand-gray">
                      Upload your resume in PDF, DOC, or DOCX format
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-spring-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-spring-green font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-midnight-forest">AI Analysis</h4>
                    <p className="text-sm text-sand-gray">
                      Our AI analyzes your skills and experience
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-spring-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-spring-green font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-midnight-forest">Get Insights</h4>
                    <p className="text-sm text-sand-gray">
                      Receive personalized recommendations for clean energy careers
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Benefits */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-midnight-forest mb-4">
                Why Analyze Your Resume?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-spring-green mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-sand-gray">
                    Identify transferable skills for clean energy roles
                  </span>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-spring-green mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-sand-gray">
                    Get personalized career recommendations
                  </span>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-spring-green mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-sand-gray">
                    Discover Massachusetts clean energy opportunities
                  </span>
                </div>
                
                <div className="flex items-start">
                  <svg className="w-5 h-5 text-spring-green mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-sand-gray">
                    Optimize your resume for green energy jobs
                  </span>
                </div>
              </div>
            </Card>

            {/* Privacy Notice */}
            <Card className="p-6 bg-spring-green/5 border-spring-green/20">
              <h3 className="text-lg font-semibold text-midnight-forest mb-4">
                Privacy & Security
              </h3>
              <p className="text-sm text-sand-gray mb-3">
                Your resume is processed securely and confidentially. We do not store your personal information and all data is encrypted during transmission.
              </p>
              <div className="flex items-center text-xs text-sand-gray">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Your data is protected and never shared</span>
              </div>
            </Card>
          </div>
        </div>

        {/* Analysis Results */}
        {analysisResult && (
          <div className="mt-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-midnight-forest mb-4">
                Analysis Results
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Skills Match */}
                <div className="bg-white rounded-lg p-4 border border-sand-gray/20">
                  <h4 className="font-medium text-midnight-forest mb-2">Skills Match</h4>
                  <div className="text-2xl font-bold text-spring-green">
                    {analysisResult.greenJobsMatch}%
                  </div>
                  <p className="text-xs text-sand-gray">Clean Energy Alignment</p>
                </div>
                
                {/* Experience Level */}
                <div className="bg-white rounded-lg p-4 border border-sand-gray/20">
                  <h4 className="font-medium text-midnight-forest mb-2">Experience</h4>
                  <div className="text-lg font-semibold text-moss-green">
                    {analysisResult.experience}
                  </div>
                  <p className="text-xs text-sand-gray">Years in Field</p>
                </div>
                
                {/* Key Skills */}
                <div className="bg-white rounded-lg p-4 border border-sand-gray/20">
                  <h4 className="font-medium text-midnight-forest mb-2">Key Skills</h4>
                  <div className="text-lg font-semibold text-moss-green">
                    {analysisResult.skills.length}
                  </div>
                  <p className="text-xs text-sand-gray">Identified Skills</p>
                </div>
                
                {/* Recommendations */}
                <div className="bg-white rounded-lg p-4 border border-sand-gray/20">
                  <h4 className="font-medium text-midnight-forest mb-2">Suggestions</h4>
                  <div className="text-lg font-semibold text-moss-green">
                    {analysisResult.suggestions.length}
                  </div>
                  <p className="text-xs text-sand-gray">Improvement Tips</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 
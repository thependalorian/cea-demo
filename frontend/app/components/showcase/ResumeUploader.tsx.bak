/**
 * ResumeUploader Component - ACT Climate Economy Assistant
 * 
 * Purpose: Drag-and-drop resume uploader with Massachusetts clean energy focus
 * Location: /app/components/showcase/ResumeUploader.tsx
 * Used by: Homepage, profile pages, and resume analysis showcase
 * 
 * Features:
 * - Drag-and-drop file upload with visual feedback
 * - Support for PDF, DOC, DOCX resume formats
 * - File validation and size limits (5MB max)
 * - ACT brand styling with eco-gradient effects
 * - Progress indicators and upload states
 * - Massachusetts clean energy job context
 * - Accessibility compliant (WCAG 2.1 AA)
 * - Mobile responsive with touch support
 * 
 * @example
 * <ResumeUploader 
 *   onUpload={handleUpload}
 *   onAnalysisComplete={handleAnalysis}
 *   maxFileSize={5 * 1024 * 1024}
 * />
 */

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';

// File upload types
export interface UploadedFile {
  file: File;
  id: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  analysis?: {
    skills: string[];
    experience: string;
    greenJobsMatch: number;
    suggestions: string[];
  };
}

export interface ResumeUploaderProps {
  onUpload?: (file: File) => Promise<void>;
  onAnalysisComplete?: (analysis: UploadedFile['analysis']) => void;
  onError?: (error: string) => void;
  maxFileSize?: number; // bytes
  acceptedFormats?: string[];
  disabled?: boolean;
  className?: string;
  showAnalysis?: boolean;
}

const ResumeUploader: React.FC<ResumeUploaderProps> = ({
  onUpload,
  onAnalysisComplete,
  onError,
  maxFileSize = 5 * 1024 * 1024, // 5MB default
  acceptedFormats = ['.pdf', '.doc', '.docx'],
  disabled = false,
  className,
  showAnalysis = true,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File validation
  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxFileSize) {
      return `File size must be less than ${Math.round(maxFileSize / 1024 / 1024)}MB`;
    }

    // Check file format
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!acceptedFormats.includes(fileExtension)) {
      return `Please upload a resume in ${acceptedFormats.join(', ')} format`;
    }

    return null;
  };

  // Handle file upload
  const handleFileUpload = useCallback(async (files: File[]) => {
    if (disabled || files.length === 0) return;

    const file = files[0]; // Single file upload
    const validationError = validateFile(file);
    
    if (validationError) {
      onError?.(validationError);
      return;
    }

    const uploadedFile: UploadedFile = {
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: 'uploading',
    };

    setUploadedFiles(prev => [...prev, uploadedFile]);
    setIsUploading(true);

    try {
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 100));
        setUploadedFiles(prev => 
          prev.map(f => 
            f.id === uploadedFile.id 
              ? { ...f, progress }
              : f
          )
        );
      }

      // Call upload handler
      if (onUpload) {
        await onUpload(file);
      }

      // Mock analysis results for demonstration
      const mockAnalysis = {
        skills: ['Solar Installation', 'Energy Efficiency', 'Project Management', 'Electrical Systems'],
        experience: '5+ years in renewable energy sector',
        greenJobsMatch: 85,
        suggestions: [
          'Consider highlighting your solar installation certifications',
          'Add keywords like "renewable energy" and "sustainability"',
          'Emphasize your Massachusetts clean energy experience'
        ]
      };

      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'completed', analysis: mockAnalysis }
            : f
        )
      );

      if (showAnalysis && onAnalysisComplete) {
        onAnalysisComplete(mockAnalysis);
      }

    } catch (error) {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === uploadedFile.id 
            ? { ...f, status: 'error' }
            : f
        )
      );
      onError?.('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [disabled, onUpload, onAnalysisComplete, onError, showAnalysis, maxFileSize, acceptedFormats]);

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) {
      setIsDragOver(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;

    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  }, [disabled, handleFileUpload]);

  // File input change handler
  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
    
    // Reset input value
    if (e.target) {
      e.target.value = '';
    }
  }, [handleFileUpload]);

  // Click to upload
  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleUploadClick}
        className={cn(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300',
          isDragOver && !disabled
            ? 'border-spring-green bg-spring-green/5 scale-105'
            : 'border-sand-gray hover:border-moss-green hover:bg-moss-green/5',
          disabled && 'opacity-50 cursor-not-allowed',
          'focus:outline-none focus:ring-2 focus:ring-spring-green/50'
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Upload resume file"
      >
        {/* Upload Icon */}
        <div className="mb-4">
          {isUploading ? (
            <div className="flex justify-center">
              <Spinner size="xl" variant="gradient" />
            </div>
          ) : (
            <div className={cn(
              'w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl transition-colors',
              isDragOver 
                ? 'bg-spring-green text-midnight-forest' 
                : 'bg-moss-green/10 text-moss-green'
            )}>
              📄
            </div>
          )}
        </div>

        {/* Upload Text */}
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-midnight-forest">
            {isUploading ? 'Analyzing your resume...' : 'Upload Your Resume'}
          </h3>
          <p className="text-base-content/70">
            {isUploading 
              ? 'Finding Massachusetts clean energy opportunities for you'
              : isDragOver 
                ? 'Drop your resume here'
                : 'Drag and drop your resume, or click to browse'
            }
          </p>
          <p className="text-sm text-base-content/50">
            Supports PDF, DOC, DOCX • Max {Math.round(maxFileSize / 1024 / 1024)}MB
          </p>
        </div>

        {/* Upload Button */}
        {!isUploading && (
          <Button 
            variant="primary" 
            className="mt-4"
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
          >
            Choose File
          </Button>
        )}

        {/* Eco Gradient Overlay */}
        {isDragOver && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-spring-green/10 via-moss-green/10 to-midnight-forest/10 pointer-events-none" />
        )}
      </div>

      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.join(',')}
        onChange={handleFileInputChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-midnight-forest">Recent Uploads</h4>
          {uploadedFiles.map((uploadedFile) => (
            <div 
              key={uploadedFile.id}
              className="bg-white border border-sand-gray/30 rounded-lg p-4 shadow-sm"
            >
              {/* File Info */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-moss-green/10 rounded-lg flex items-center justify-center text-moss-green">
                    📄
                  </div>
                  <div>
                    <p className="font-medium text-midnight-forest truncate max-w-48">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-base-content/60">
                      {(uploadedFile.file.size / 1024 / 1024).toFixed(1)}MB
                    </p>
                  </div>
                </div>
                
                {/* Status */}
                <div className="text-right">
                  {uploadedFile.status === 'uploading' && (
                    <div className="text-sm text-base-content/70">
                      {uploadedFile.progress}%
                    </div>
                  )}
                  {uploadedFile.status === 'completed' && (
                    <div className="text-sm text-success">✅ Analyzed</div>
                  )}
                  {uploadedFile.status === 'error' && (
                    <div className="text-sm text-error">❌ Failed</div>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              {uploadedFile.status === 'uploading' && (
                <div className="w-full h-2 bg-sand-gray/30 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-spring-green to-moss-green transition-all duration-300"
                    style={{ width: `${uploadedFile.progress}%` }}
                  />
                </div>
              )}

              {/* Analysis Results */}
              {uploadedFile.status === 'completed' && uploadedFile.analysis && showAnalysis && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎯</span>
                    <span className="text-sm font-medium text-midnight-forest">
                      Green Jobs Match: {uploadedFile.analysis.greenJobsMatch}%
                    </span>
                    <div className="flex-1 h-2 bg-sand-gray/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-spring-green to-moss-green"
                        style={{ width: `${uploadedFile.analysis.greenJobsMatch}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-moss-green mb-1">Top Skills Found:</p>
                      <div className="flex flex-wrap gap-1">
                        {uploadedFile.analysis.skills.slice(0, 3).map((skill, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 bg-spring-green/10 text-spring-green rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-medium text-moss-green mb-1">Experience Level:</p>
                      <p className="text-base-content/70">{uploadedFile.analysis.experience}</p>
                    </div>
                  </div>

                  <div>
                    <p className="font-medium text-moss-green mb-2">💡 Suggestions for MA Clean Energy Jobs:</p>
                    <ul className="space-y-1 text-sm text-base-content/70">
                      {uploadedFile.analysis.suggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-spring-green">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResumeUploader;
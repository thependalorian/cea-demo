/**
 * JobListingCard
 * 
 * Purpose: Display job opportunities in Massachusetts clean energy sector
 * Shows job details, company information, and application options
 * Location: /app/components/partner/JobListingCard.tsx
 * Used by: Job boards, search results, and career discovery pages
 * 
 * Features:
 * - Comprehensive job information display
 * - Company branding and verification status
 * - Skills matching and salary transparency
 * - Application tracking and save functionality
 * - ACT brand integration with accessibility focus
 * 
 * @example
 * <JobListingCard job={jobData} onApply={handleApply} />
 */

'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Job listing interface
interface JobListing {
  id: string;
  title: string;
  company: {
    name: string;
    logo?: string;
    verified: boolean;
    size: string;
    location: string;
  };
  location: string;
  workType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'apprenticeship';
  workArrangement: 'on-site' | 'remote' | 'hybrid';
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive';
  department?: string;
  cleanEnergyCategory: string;
  summary: string;
  responsibilities: string[];
  qualifications: string[];
  skills: string[];
  compensation: {
    salaryMin: number;
    salaryMax: number;
    salaryType: 'hourly' | 'salary' | 'contract';
    benefits: string[];
    equity?: boolean;
  };
  postedDate: Date;
  applicationDeadline?: Date;
  urgency: 'standard' | 'urgent' | 'asap';
  massachusetts: {
    veteranPreference: boolean;
    diversityInitiative: boolean;
    stateIncentiveEligible: boolean;
    transportationNotes?: string;
  };
  applicationUrl?: string;
  contactEmail?: string;
  applied?: boolean;
  saved?: boolean;
  matchScore?: number;
  matchingSkills?: string[];
}

interface JobListingCardProps {
  job: JobListing;
  onApply: (jobId: string) => void;
  onSave?: (jobId: string) => void;
  onViewDetails?: (jobId: string) => void;
  showMatchScore?: boolean;
  compact?: boolean;
  className?: string;
}

const JobListingCard: React.FC<JobListingCardProps> = ({
  job,
  onApply,
  onSave,
  onViewDetails,
  showMatchScore = false,
  compact = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(job.saved || false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(job.id);
    }
  };

  const getExperienceColor = (level: string) => {
    switch (level) {
      case 'entry': return 'bg-green-100 text-green-800';
      case 'mid': return 'bg-blue-100 text-blue-800';
      case 'senior': return 'bg-purple-100 text-purple-800';
      case 'executive': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getWorkTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-midnight-forest text-white';
      case 'part-time': return 'bg-moss-green text-white';
      case 'contract': return 'bg-blue-600 text-white';
      case 'internship': return 'bg-spring-green text-midnight-forest';
      case 'apprenticeship': return 'bg-purple-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'asap': return 'bg-red-100 text-red-800 border-red-200';
      default: return '';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getDaysUntilDeadline = (deadline: Date) => {
    const now = new Date();
    const diffInDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffInDays;
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border border-gray-200",
      compact ? "p-4" : "p-6",
      job.urgency !== 'standard' && "border-l-4 border-l-orange-400",
      className
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            {/* Company Logo */}
            <div className="w-12 h-12 bg-gradient-to-r from-spring-green to-moss-green rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
              {job.company.logo ? (
                <img 
                  src={job.company.logo} 
                  alt={job.company.name}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              ) : (
                job.company.name.charAt(0)
              )}
            </div>

            {/* Job Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-2">
                <h3 className="text-lg font-semibold text-midnight-forest line-clamp-1">
                  {job.title}
                </h3>
                {job.company.verified && (
                  <div className="flex items-center gap-1 text-spring-green flex-shrink-0">
                    <span className="text-sm">✓</span>
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-moss-green">{job.company.name}</span>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">{job.location}</span>
                {job.department && (
                  <>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{job.department}</span>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getWorkTypeColor(job.workType)
                )}>
                  {job.workType.charAt(0).toUpperCase() + job.workType.slice(1)}
                </span>
                
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getExperienceColor(job.experienceLevel)
                )}>
                  {job.experienceLevel.charAt(0).toUpperCase() + job.experienceLevel.slice(1)} Level
                </span>

                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                  {job.workArrangement.charAt(0).toUpperCase() + job.workArrangement.slice(1)}
                </span>

                {job.urgency !== 'standard' && (
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium border",
                    getUrgencyColor(job.urgency)
                  )}>
                    {job.urgency === 'asap' ? 'ASAP' : 'Urgent'}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSave}
              className={cn(
                "p-2 rounded-full transition-colors",
                isSaved 
                  ? "text-spring-green bg-spring-green/10" 
                  : "text-gray-400 hover:text-spring-green hover:bg-spring-green/10"
              )}
              title={isSaved ? "Saved" : "Save job"}
            >
              <span className="text-lg">{isSaved ? "💚" : "🤍"}</span>
            </button>
            
            {!compact && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-2 rounded-full text-gray-400 hover:text-moss-green hover:bg-moss-green/10 transition-colors"
                title={isExpanded ? "Show less" : "Show more"}
              >
                <span className="text-sm">{isExpanded ? "▲" : "▼"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Match Score */}
        {showMatchScore && job.matchScore && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-blue-800">Match Score</span>
              <span className="text-2xl font-bold text-blue-600">{job.matchScore}%</span>
            </div>
            {job.matchingSkills && job.matchingSkills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {job.matchingSkills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {skill}
                  </span>
                ))}
                {job.matchingSkills.length > 3 && (
                  <span className="text-xs text-blue-600">+{job.matchingSkills.length - 3} more</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Clean Energy Category */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Category:</span>
          <span className="px-2 py-1 bg-spring-green/10 text-spring-green rounded text-sm font-medium">
            {job.cleanEnergyCategory}
          </span>
        </div>

        {/* Job Summary */}
        {!compact && (
          <div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {job.summary}
            </p>
          </div>
        )}

        {/* Compensation */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-500">Salary: </span>
            <span className="font-semibold text-midnight-forest">
              {job.compensation.salaryMin > 0 && job.compensation.salaryMax > 0 ? (
                `${formatCurrency(job.compensation.salaryMin)} - ${formatCurrency(job.compensation.salaryMax)}`
              ) : (
                'Competitive'
              )}
            </span>
            {job.compensation.salaryType === 'hourly' && (
              <span className="text-sm text-gray-500"> /hour</span>
            )}
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Posted {getTimeAgo(job.postedDate)}</div>
            {job.applicationDeadline && (
              <div className="text-xs text-red-600">
                Deadline: {getDaysUntilDeadline(job.applicationDeadline)} days left
              </div>
            )}
          </div>
        </div>

        {/* Massachusetts Features */}
        {(job.massachusetts.veteranPreference || job.massachusetts.diversityInitiative || job.massachusetts.stateIncentiveEligible) && (
          <div className="flex flex-wrap gap-2">
            {job.massachusetts.veteranPreference && (
              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                🇺🇸 Veteran Preference
              </span>
            )}
            {job.massachusetts.diversityInitiative && (
              <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                🤝 Diversity Initiative
              </span>
            )}
            {job.massachusetts.stateIncentiveEligible && (
              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                🏛️ State Incentive Eligible
              </span>
            )}
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && !compact && (
          <div className="space-y-4 border-t pt-4">
            {/* Skills */}
            {job.skills.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-midnight-forest mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Responsibilities */}
            {job.responsibilities.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-midnight-forest mb-2">Key Responsibilities</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  {job.responsibilities.slice(0, 3).map((responsibility, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-spring-green mt-1 flex-shrink-0">•</span>
                      {responsibility}
                    </li>
                  ))}
                  {job.responsibilities.length > 3 && (
                    <li className="text-xs text-gray-500">
                      +{job.responsibilities.length - 3} more responsibilities
                    </li>
                  )}
                </ul>
              </div>
            )}

            {/* Benefits */}
            {job.compensation.benefits.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-midnight-forest mb-2">Benefits</h4>
                <div className="flex flex-wrap gap-2">
                  {job.compensation.benefits.slice(0, 4).map((benefit, index) => (
                    <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {benefit}
                    </span>
                  ))}
                  {job.compensation.benefits.length > 4 && (
                    <span className="text-xs text-gray-500">
                      +{job.compensation.benefits.length - 4} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          {job.applied ? (
            <Button
              disabled
              className="bg-gray-400 text-white cursor-not-allowed"
              size="sm"
            >
              ✓ Applied
            </Button>
          ) : (
            <Button
              onClick={() => onApply(job.id)}
              className="bg-spring-green text-midnight-forest hover:bg-spring-green/90"
              size="sm"
            >
              Apply Now
            </Button>
          )}

          {onViewDetails && (
            <Button
              onClick={() => onViewDetails(job.id)}
              variant="outline"
              className="border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
              size="sm"
            >
              View Details
            </Button>
          )}

          {/* External Apply */}
          {job.applicationUrl && (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 ml-auto self-center"
            >
              External Application →
            </a>
          )}
        </div>
      </div>
    </Card>
  );
};

export default JobListingCard; 
/**
 * CandidateCard
 * 
 * Purpose: Display job seeker profiles for Massachusetts clean energy employers
 * Allows partners to view candidate information, skills, and contact details
 * Location: /app/components/partner/CandidateCard.tsx
 * Used by: Partner dashboard, candidate search, and talent matching pages
 * 
 * Features:
 * - Comprehensive candidate profile display
 * - Skills matching and compatibility scoring
 * - Massachusetts-specific information highlighting
 * - Contact and communication actions
 * - ACT brand integration with accessibility focus
 * 
 * @example
 * <CandidateCard candidate={candidateData} onContact={handleContact} />
 */

'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Candidate profile interface
interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  profileType: string;
  bio: string;
  location: string;
  avatar?: string;
  skills: string[];
  experience: {
    years: number;
    level: 'entry' | 'mid' | 'senior' | 'executive';
    previousRoles: string[];
  };
  education: {
    degree: string;
    institution: string;
    year: number;
  }[];
  certifications: string[];
  availability: {
    startDate: string;
    workType: string[];
    salaryRange: {
      min: number;
      max: number;
    };
  };
  massachusetts: {
    transportation: string[];
    veteranStatus: boolean;
    languageSupport: string[];
    ruralOpportunities: boolean;
  };
  compatibility?: {
    score: number;
    matchingSkills: string[];
    reasoning: string[];
  };
  linkedIn?: string;
  portfolio?: string;
  resumeUrl?: string;
  lastActive: Date;
  verified: boolean;
}

interface CandidateCardProps {
  candidate: Candidate;
  onContact: (candidateId: string, method: 'email' | 'message' | 'interview') => void;
  onSave?: (candidateId: string) => void;
  onViewProfile?: (candidateId: string) => void;
  showCompatibility?: boolean;
  compact?: boolean;
  className?: string;
}

const CandidateCard: React.FC<CandidateCardProps> = ({
  candidate,
  onContact,
  onSave,
  onViewProfile,
  showCompatibility = true,
  compact = false,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (onSave) {
      onSave(candidate.id);
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

  const getCompatibilityColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-50';
    if (score >= 75) return 'text-blue-600 bg-blue-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
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
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Active now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  return (
    <Card className={cn(
      "transition-all duration-300 hover:shadow-lg border border-gray-200",
      compact ? "p-4" : "p-6",
      className
    )}>
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-r from-spring-green to-moss-green rounded-full flex items-center justify-center text-white font-semibold">
              {candidate.avatar ? (
                <Image 
                  src={candidate.avatar} 
                  alt={`${candidate.firstName} ${candidate.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                `${candidate.firstName[0]}${candidate.lastName[0]}`
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-midnight-forest">
                  {candidate.firstName} {candidate.lastName}
                </h3>
                {candidate.verified && (
                  <div className="flex items-center gap-1 text-spring-green">
                    <span className="text-sm">✓</span>
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  "px-2 py-1 rounded-full text-xs font-medium",
                  getExperienceColor(candidate.experience.level)
                )}>
                  {candidate.experience.level.charAt(0).toUpperCase() + candidate.experience.level.slice(1)} Level
                </span>
                <span className="text-sm text-gray-600">•</span>
                <span className="text-sm text-gray-600">{candidate.location}</span>
                {candidate.massachusetts.veteranStatus && (
                  <>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm font-medium text-blue-600">Veteran</span>
                  </>
                )}
              </div>

              <p className="text-sm text-moss-green mt-1">{candidate.profileType}</p>
              <p className="text-xs text-gray-500 mt-1">Last active: {getTimeAgo(candidate.lastActive)}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={cn(
                "p-2 rounded-full transition-colors",
                isSaved 
                  ? "text-spring-green bg-spring-green/10" 
                  : "text-gray-400 hover:text-spring-green hover:bg-spring-green/10"
              )}
              title={isSaved ? "Saved" : "Save candidate"}
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

        {/* Compatibility Score */}
        {showCompatibility && candidate.compatibility && (
          <div className={cn(
            "p-3 rounded-lg border",
            getCompatibilityColor(candidate.compatibility.score)
          )}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium">Compatibility Score</span>
              <span className="text-2xl font-bold">{candidate.compatibility.score}%</span>
            </div>
            <div className="flex flex-wrap gap-1 mb-2">
              {candidate.compatibility.matchingSkills.slice(0, 3).map((skill, index) => (
                <span key={index} className="text-xs bg-white/50 px-2 py-1 rounded">
                  {skill}
                </span>
              ))}
              {candidate.compatibility.matchingSkills.length > 3 && (
                <span className="text-xs">+{candidate.compatibility.matchingSkills.length - 3} more</span>
              )}
            </div>
            {candidate.compatibility.reasoning.length > 0 && (
              <p className="text-xs opacity-80">
                {candidate.compatibility.reasoning[0]}
              </p>
            )}
          </div>
        )}

        {/* Bio */}
        {!compact && (
          <div>
            <p className="text-sm text-gray-700 line-clamp-2">
              {candidate.bio}
            </p>
          </div>
        )}

        {/* Skills Preview */}
        <div>
          <h4 className="text-sm font-medium text-midnight-forest mb-2">Key Skills</h4>
          <div className="flex flex-wrap gap-2">
            {candidate.skills.slice(0, compact ? 3 : 5).map((skill, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                {skill}
              </span>
            ))}
            {candidate.skills.length > (compact ? 3 : 5) && (
              <span className="text-xs text-gray-500">
                +{candidate.skills.length - (compact ? 3 : 5)} more
              </span>
            )}
          </div>
        </div>

        {/* Availability */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Available:</span>
            <span className="ml-2 text-midnight-forest font-medium">
              {candidate.availability.startDate === 'immediate' ? 'Immediately' : candidate.availability.startDate}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Salary:</span>
            <span className="ml-2 text-midnight-forest font-medium">
              {formatCurrency(candidate.availability.salaryRange.min)} - {formatCurrency(candidate.availability.salaryRange.max)}
            </span>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && !compact && (
          <div className="space-y-4 border-t pt-4">
            {/* Experience */}
            <div>
              <h4 className="text-sm font-medium text-midnight-forest mb-2">Experience</h4>
              <div className="space-y-2">
                <p className="text-sm text-gray-700">
                  {candidate.experience.years} years of experience
                </p>
                {candidate.experience.previousRoles.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Previous roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {candidate.experience.previousRoles.map((role, index) => (
                        <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Education */}
            {candidate.education.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-midnight-forest mb-2">Education</h4>
                <div className="space-y-2">
                  {candidate.education.map((edu, index) => (
                    <div key={index} className="text-sm">
                      <span className="font-medium">{edu.degree}</span>
                      <span className="text-gray-600"> - {edu.institution}</span>
                      <span className="text-gray-500"> ({edu.year})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Certifications */}
            {candidate.certifications.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-midnight-forest mb-2">Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.certifications.map((cert, index) => (
                    <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Massachusetts Specific */}
            <div>
              <h4 className="text-sm font-medium text-midnight-forest mb-2">Massachusetts Details</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Transportation:</span>
                  <div className="mt-1">
                    {candidate.massachusetts.transportation.length > 0 ? (
                      candidate.massachusetts.transportation.slice(0, 2).map((transport, index) => (
                        <span key={index} className="block text-xs text-gray-700">
                          • {transport}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">Not specified</span>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-500">Languages:</span>
                  <div className="mt-1">
                    {candidate.massachusetts.languageSupport.length > 0 ? (
                      candidate.massachusetts.languageSupport.slice(0, 2).map((lang, index) => (
                        <span key={index} className="block text-xs text-gray-700">
                          • {lang}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-500">English</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Work Preferences */}
            <div>
              <h4 className="text-sm font-medium text-midnight-forest mb-2">Work Preferences</h4>
              <div className="flex flex-wrap gap-2">
                {candidate.availability.workType.map((type, index) => (
                  <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {type}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2 pt-2">
          <Button
            onClick={() => onContact(candidate.id, 'message')}
            className="bg-spring-green text-midnight-forest hover:bg-spring-green/90"
            size="sm"
          >
            Send Message
          </Button>
          
          <Button
            onClick={() => onContact(candidate.id, 'email')}
            variant="outline"
            className="border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
            size="sm"
          >
            Email
          </Button>

          <Button
            onClick={() => onContact(candidate.id, 'interview')}
            variant="outline"
            className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
            size="sm"
          >
            Schedule Interview
          </Button>

          {onViewProfile && (
            <Button
              onClick={() => onViewProfile(candidate.id)}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-midnight-forest"
            >
              View Full Profile
            </Button>
          )}

          {/* External Links */}
          <div className="flex gap-2 ml-auto">
            {candidate.linkedIn && (
              <a
                href={candidate.linkedIn}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 text-xs"
                title="LinkedIn Profile"
              >
                LinkedIn
              </a>
            )}
            {candidate.portfolio && (
              <a
                href={candidate.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 text-xs"
                title="Portfolio"
              >
                Portfolio
              </a>
            )}
            {candidate.resumeUrl && (
              <a
                href={candidate.resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-600 hover:text-green-800 text-xs"
                title="Download Resume"
              >
                Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CandidateCard; 
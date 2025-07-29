/**
 * CredentialEvaluationShowcase
 * 
 * Purpose: Interactive showcase demonstrating how the platform evaluates international 
 * credentials and maps them to Massachusetts clean energy job opportunities
 * Location: /app/components/showcase/CredentialEvaluationShowcase.tsx
 * Used by: Homepage to showcase credential evaluation capabilities for international job seekers
 * 
 * Features:
 * - Interactive credential selection demo
 * - Step-by-step evaluation animation
 * - Skills mapping to MA clean energy roles
 * - Gap analysis and recommendations
 * - ACT brand integration with accessibility focus
 * 
 * @example
 * <CredentialEvaluationShowcase />
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/loading';
import { 
  GlobeAltIcon, 
  AcademicCapIcon, 
  CheckCircleIcon,
  ArrowRightIcon,
  StarIcon,
  ExclamationTriangleIcon,
  LightBulbIcon,
  BookOpenIcon,
  CertificateIcon,
  MapPinIcon
} from '@heroicons/react/24/outline';

// Sample international credentials data
interface Credential {
  id: string;
  title: string;
  country: string;
  institution: string;
  field: string;
  level: string;
  description: string;
  flag: string;
}

interface EvaluationStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'processing' | 'completed';
  icon: React.ComponentType<any>;
  result?: string;
}

interface SkillMapping {
  international: string;
  massachusetts: string;
  match: 'excellent' | 'good' | 'partial' | 'gap';
  relevantJobs: string[];
}

interface RecommendedCertification {
  name: string;
  provider: string;
  duration: string;
  cost: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

const sampleCredentials: Credential[] = [
  {
    id: 'eng_renewable',
    title: 'Renewable Energy Engineering Degree',
    country: 'Germany',
    institution: 'Technical University of Munich',
    field: 'Renewable Energy Systems',
    level: "Master's Degree",
    description: 'Specialized in wind and solar energy systems design',
    flag: '🇩🇪'
  },
  {
    id: 'env_science',
    title: 'Environmental Science Diploma',
    country: 'India',
    institution: 'Indian Institute of Technology',
    field: 'Environmental Science',
    level: "Bachelor's Degree",
    description: 'Focus on sustainable development and clean technology',
    flag: '🇮🇳'
  },
  {
    id: 'elec_eng',
    title: 'Electrical Engineering Degree',
    country: 'Brazil',
    institution: 'University of São Paulo',
    field: 'Electrical Engineering',
    level: "Bachelor's Degree",
    description: 'Specialization in power systems and grid integration',
    flag: '🇧🇷'
  }
];

const evaluationSteps: Omit<EvaluationStep, 'status'>[] = [
  {
    id: 'verification',
    title: 'Credential Verification',
    description: 'Verifying authenticity with international databases',
    icon: CertificateIcon
  },
  {
    id: 'equivalency',
    title: 'US Equivalency Analysis',
    description: 'Comparing to US education standards and requirements',
    icon: AcademicCapIcon
  },
  {
    id: 'skills_mapping',
    title: 'Skills Mapping',
    description: 'Mapping skills to Massachusetts clean energy roles',
    icon: MapPinIcon
  },
  {
    id: 'gap_analysis',
    title: 'Gap Analysis',
    description: 'Identifying skill gaps and certification needs',
    icon: ExclamationTriangleIcon
  },
  {
    id: 'recommendations',
    title: 'Career Recommendations',
    description: 'Generating personalized career pathway suggestions',
    icon: LightBulbIcon
  }
];

const CredentialEvaluationShowcase: React.FC = () => {
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [evaluationInProgress, setEvaluationInProgress] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<EvaluationStep[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Initialize steps when evaluation starts
  useEffect(() => {
    if (evaluationInProgress) {
      setSteps(evaluationSteps.map(step => ({ ...step, status: 'pending' })));
      setCurrentStep(0);
      setShowResults(false);
    }
  }, [evaluationInProgress]);

  // Animate through evaluation steps
  useEffect(() => {
    if (!evaluationInProgress || steps.length === 0) return;

    const timer = setTimeout(() => {
      setSteps(prev => prev.map((step, index) => {
        if (index < currentStep) return { ...step, status: 'completed' };
        if (index === currentStep) return { ...step, status: 'processing' };
        return { ...step, status: 'pending' };
      }));

      if (currentStep < steps.length - 1) {
        setTimeout(() => {
          setCurrentStep(prev => prev + 1);
        }, 2000);
      } else {
        setTimeout(() => {
          setSteps(prev => prev.map(step => ({ ...step, status: 'completed' })));
          setShowResults(true);
          setEvaluationInProgress(false);
        }, 2000);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [currentStep, evaluationInProgress, steps.length]);

  const startEvaluation = (credential: Credential) => {
    setSelectedCredential(credential);
    setEvaluationInProgress(true);
  };

  const resetDemo = () => {
    setSelectedCredential(null);
    setEvaluationInProgress(false);
    setCurrentStep(0);
    setSteps([]);
    setShowResults(false);
  };

  // Sample results based on selected credential
  const getSkillMappings = (): SkillMapping[] => {
    if (!selectedCredential) return [];

    const mappings: Record<string, SkillMapping[]> = {
      'eng_renewable': [
        {
          international: 'Wind Turbine Design',
          massachusetts: 'Offshore Wind Development',
          match: 'excellent',
          relevantJobs: ['Wind Energy Engineer', 'Offshore Wind Technician']
        },
        {
          international: 'Solar Panel Systems',
          massachusetts: 'Solar Installation & Maintenance',
          match: 'good',
          relevantJobs: ['Solar Installation Specialist', 'Solar Field Technician']
        },
        {
          international: 'Energy Storage Systems',
          massachusetts: 'Grid-Scale Battery Systems',
          match: 'partial',
          relevantJobs: ['Energy Storage Engineer', 'Battery Systems Technician']
        }
      ],
      'env_science': [
        {
          international: 'Environmental Impact Assessment',
          massachusetts: 'Clean Energy Project Assessment',
          match: 'excellent',
          relevantJobs: ['Environmental Compliance Specialist', 'Sustainability Coordinator']
        },
        {
          international: 'Waste Management Systems',
          massachusetts: 'Circular Economy Solutions',
          match: 'good',
          relevantJobs: ['Waste-to-Energy Specialist', 'Recycling Program Manager']
        },
        {
          international: 'Carbon Footprint Analysis',
          massachusetts: 'GHG Reduction Programs',
          match: 'excellent',
          relevantJobs: ['Carbon Analyst', 'Climate Program Coordinator']
        }
      ],
      'elec_eng': [
        {
          international: 'Power Grid Systems',
          massachusetts: 'Smart Grid Technology',
          match: 'good',
          relevantJobs: ['Grid Modernization Engineer', 'Smart Grid Technician']
        },
        {
          international: 'Electrical Controls',
          massachusetts: 'Clean Energy Controls',
          match: 'excellent',
          relevantJobs: ['Control Systems Engineer', 'Automation Specialist']
        },
        {
          international: 'Power Electronics',
          massachusetts: 'EV Charging Infrastructure',
          match: 'partial',
          relevantJobs: ['EV Infrastructure Engineer', 'Charging Station Technician']
        }
      ]
    };

    return mappings[selectedCredential.id] || [];
  };

  const getRecommendedCertifications = (): RecommendedCertification[] => {
    if (!selectedCredential) return [];

    const certifications: Record<string, RecommendedCertification[]> = {
      'eng_renewable': [
        {
          name: 'NABCEP Solar Installation Professional',
          provider: 'North American Board of Certified Energy Practitioners',
          duration: '3-6 months',
          cost: '$500-$1,500',
          description: 'Industry-standard certification for solar installation in Massachusetts',
          priority: 'high'
        },
        {
          name: 'Wind Energy Technician Certificate',
          provider: 'Massachusetts Clean Energy Center',
          duration: '6-12 months',
          cost: '$2,000-$4,000',
          description: 'State-sponsored training for offshore wind industry',
          priority: 'high'
        }
      ],
      'env_science': [
        {
          name: 'LEED Green Associate',
          provider: 'U.S. Green Building Council',
          duration: '2-4 months',
          cost: '$200-$400',
          description: 'Foundation certification for green building practices',
          priority: 'medium'
        },
        {
          name: 'Massachusetts Environmental Compliance Certificate',
          provider: 'Mass DEP Training Institute',
          duration: '1-3 months',
          cost: '$300-$800',
          description: 'State-specific environmental regulations and compliance',
          priority: 'high'
        }
      ],
      'elec_eng': [
        {
          name: 'Massachusetts Electrical License',
          provider: 'Commonwealth of Massachusetts',
          duration: '6-12 months',
          cost: '$200-$500',
          description: 'Required state licensing for electrical work',
          priority: 'high'
        },
        {
          name: 'EVITP Electric Vehicle Infrastructure Training',
          provider: 'Electric Vehicle Infrastructure Training Program',
          duration: '2-4 weeks',
          cost: '$1,000-$2,000',
          description: 'Specialized training for EV charging infrastructure',
          priority: 'medium'
        }
      ]
    };

    return certifications[selectedCredential.id] || [];
  };

  const getMatchColor = (match: string) => {
    switch (match) {
      case 'excellent': return 'success';
      case 'good': return 'warning';
      case 'partial': return 'info';
      case 'gap': return 'error';
      default: return 'neutral';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'error';
      case 'medium': return 'warning';
      case 'low': return 'info';
      default: return 'neutral';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-spring-green/10 rounded-full">
            <GlobeAltIcon className="w-8 h-8 text-spring-green" />
          </div>
          <h2 className="text-3xl font-bold text-midnight-forest">
            International Credential Evaluation
          </h2>
        </div>
        <p className="text-lg text-moss-green max-w-3xl mx-auto">
          See how our AI evaluates international credentials and maps them to 
          Massachusetts clean energy opportunities. Get personalized career pathways 
          and certification recommendations.
        </p>
      </div>

      {!selectedCredential ? (
        /* Credential Selection */
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center text-midnight-forest">
            Choose a Sample International Credential
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {sampleCredentials.map((credential) => (
              <Card key={credential.id} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="text-3xl">{credential.flag}</div>
                    <Badge variant="outline" className="text-xs">
                      {credential.level}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-semibold text-midnight-forest line-clamp-2">
                      {credential.title}
                    </h4>
                    <p className="text-sm text-moss-green">
                      {credential.institution}
                    </p>
                    <p className="text-sm text-gray-600">
                      {credential.country} • {credential.field}
                    </p>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {credential.description}
                    </p>
                  </div>

                  <Button
                    onClick={() => startEvaluation(credential)}
                    className="w-full group-hover:bg-spring-green group-hover:text-midnight-forest transition-colors"
                    variant="outline"
                  >
                    Evaluate This Credential
                    <ArrowRightIcon className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        /* Evaluation Process */
        <div className="space-y-8">
          {/* Selected Credential */}
          <Card className="p-6 bg-spring-green/5 border-spring-green/20">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="text-3xl">{selectedCredential.flag}</div>
                <div className="space-y-1">
                  <h3 className="font-semibold text-midnight-forest">
                    {selectedCredential.title}
                  </h3>
                  <p className="text-sm text-moss-green">
                    {selectedCredential.institution} • {selectedCredential.country}
                  </p>
                  <Badge variant="secondary" className="text-xs">
                    {selectedCredential.level}
                  </Badge>
                </div>
              </div>
              <Button
                onClick={resetDemo}
                variant="ghost"
                size="sm"
                className="text-moss-green hover:text-midnight-forest"
              >
                Choose Different
              </Button>
            </div>
          </Card>

          {/* Evaluation Steps */}
          {steps.length > 0 && (
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6 text-midnight-forest">
                Evaluation Process
              </h3>
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg transition-all duration-500",
                        step.status === 'completed' && "bg-green-50 border border-green-200",
                        step.status === 'processing' && "bg-blue-50 border border-blue-200",
                        step.status === 'pending' && "bg-gray-50 border border-gray-200"
                      )}
                    >
                      <div className={cn(
                        "p-2 rounded-full transition-colors",
                        step.status === 'completed' && "bg-green-100 text-green-600",
                        step.status === 'processing' && "bg-blue-100 text-blue-600",
                        step.status === 'pending' && "bg-gray-100 text-gray-400"
                      )}>
                        {step.status === 'processing' ? (
                          <Spinner size="sm" />
                        ) : step.status === 'completed' ? (
                          <CheckCircleIcon className="w-5 h-5" />
                        ) : (
                          <Icon className="w-5 h-5" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={cn(
                          "font-medium transition-colors",
                          step.status === 'completed' && "text-green-800",
                          step.status === 'processing' && "text-blue-800",
                          step.status === 'pending' && "text-gray-500"
                        )}>
                          {step.title}
                        </h4>
                        <p className={cn(
                          "text-sm transition-colors",
                          step.status === 'completed' && "text-green-600",
                          step.status === 'processing' && "text-blue-600",
                          step.status === 'pending' && "text-gray-400"
                        )}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Results */}
          {showResults && (
            <div className="space-y-6">
              {/* Skills Mapping */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-midnight-forest flex items-center gap-2">
                  <MapPinIcon className="w-6 h-6 text-spring-green" />
                  Skills Mapping to Massachusetts Clean Energy Jobs
                </h3>
                <div className="space-y-4">
                  {getSkillMappings().map((mapping, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-midnight-forest">
                            {mapping.international}
                          </span>
                          <ArrowRightIcon className="w-4 h-4 text-gray-400" />
                          <span className="font-medium text-moss-green">
                            {mapping.massachusetts}
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {mapping.relevantJobs.map((job, jobIndex) => (
                            <Badge key={jobIndex} variant="secondary" className="text-xs">
                              {job}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Badge 
                        variant={getMatchColor(mapping.match) as any}
                        className="ml-4"
                      >
                        {mapping.match.charAt(0).toUpperCase() + mapping.match.slice(1)} Match
                      </Badge>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recommendations */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-6 text-midnight-forest flex items-center gap-2">
                  <BookOpenIcon className="w-6 h-6 text-spring-green" />
                  Recommended Certifications for Massachusetts
                </h3>
                <div className="grid gap-4">
                  {getRecommendedCertifications().map((cert, index) => (
                    <div
                      key={index}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-midnight-forest">
                            {cert.name}
                          </h4>
                          <p className="text-sm text-moss-green">
                            {cert.provider}
                          </p>
                        </div>
                        <Badge variant={getPriorityColor(cert.priority) as any}>
                          {cert.priority.charAt(0).toUpperCase() + cert.priority.slice(1)} Priority
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">
                        {cert.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-moss-green">
                          Duration: {cert.duration}
                        </span>
                        <span className="text-moss-green">
                          Cost: {cert.cost}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-gradient-to-r from-spring-green/10 to-moss-green/10 border-spring-green/20">
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold text-midnight-forest">
                    Ready to Get Your Credentials Evaluated?
                  </h3>
                  <p className="text-moss-green">
                    Get a personalized evaluation of your international credentials 
                    and discover your pathway to Massachusetts clean energy careers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button className="bg-spring-green text-midnight-forest hover:bg-spring-green/90">
                      Start My Evaluation
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={resetDemo}
                      className="border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
                    >
                      Try Another Credential
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CredentialEvaluationShowcase; 
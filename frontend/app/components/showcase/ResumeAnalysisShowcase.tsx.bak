/**
 * ResumeAnalysisShowcase Component - ACT Climate Economy Assistant
 * 
 * Purpose: Interactive demo of AI resume analysis for Massachusetts clean energy jobs
 * Location: /app/components/showcase/ResumeAnalysisShowcase.tsx
 * Used by: Homepage and features page to showcase AI capabilities
 * 
 * Features:
 * - Interactive demo with sample resume analysis
 * - Real-time analysis animation with ACT branding
 * - Skills mapping to Massachusetts clean energy sectors
 * - Job matching scores and recommendations
 * - Animated progress indicators and visual feedback
 * - Mobile responsive design with touch interactions
 * - Accessibility compliant with screen reader support
 * 
 * @example
 * <ResumeAnalysisShowcase 
 *   autoPlay={true}
 *   showDetails={true}
 *   onTryNow={handleTryNow}
 * />
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EcoPulse, Spinner } from '@/components/ui/loading';

// Sample data for demonstration
const sampleResume = {
  name: 'Sarah Chen',
  title: 'Electrical Engineer',
  experience: '7 years in renewable energy systems',
  skills: [
    'Solar PV Systems', 'Energy Storage', 'Grid Integration', 'Project Management',
    'AutoCAD', 'MATLAB', 'Power Electronics', 'Sustainability Assessment'
  ],
  certifications: ['NABCEP Solar Installation', 'PE License', 'LEED Green Associate'],
  education: 'MS Electrical Engineering, MIT'
};

const analysisSteps = [
  { 
    step: 1, 
    title: 'Resume Processing', 
    description: 'Extracting skills and experience',
    duration: 1500,
    icon: '📄'
  },
  { 
    step: 2, 
    title: 'Skills Analysis', 
    description: 'Mapping to clean energy sectors',
    duration: 2000,
    icon: '🔍'
  },
  { 
    step: 3, 
    title: 'Job Matching', 
    description: 'Finding Massachusetts opportunities',
    duration: 1800,
    icon: '🎯'
  },
  { 
    step: 4, 
    title: 'Recommendations', 
    description: 'Generating career insights',
    duration: 1200,
    icon: '💡'
  }
];

const jobMatches = [
  {
    title: 'Senior Solar Engineer',
    company: 'SunPower Corporation',
    location: 'Boston, MA',
    match: 95,
    salary: '$85K - $110K',
    type: 'Full-time'
  },
  {
    title: 'Energy Storage Specialist',
    company: 'Tesla Energy',
    location: 'Cambridge, MA', 
    match: 92,
    salary: '$90K - $120K',
    type: 'Full-time'
  },
  {
    title: 'Grid Modernization Engineer',
    company: 'National Grid',
    location: 'Worcester, MA',
    match: 88,
    salary: '$75K - $95K',
    type: 'Full-time'
  }
];

export interface ResumeAnalysisShowcaseProps {
  autoPlay?: boolean;
  showDetails?: boolean;
  onTryNow?: () => void;
  className?: string;
}

const ResumeAnalysisShowcase: React.FC<ResumeAnalysisShowcaseProps> = ({
  autoPlay = false,
  showDetails = true,
  onTryNow,
  className
}) => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [animatedSkills, setAnimatedSkills] = useState<string[]>([]);

  // Auto-run demo
  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        startAnalysis();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [autoPlay]);

  // Run analysis animation
  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setShowResults(false);
    setCurrentStep(0);
    setAnimatedSkills([]);

    // Step through analysis phases
    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, analysisSteps[i].duration));
      
      // Animate skills appearing during skills analysis
      if (i === 1) {
        for (let j = 0; j < sampleResume.skills.length; j++) {
          await new Promise(resolve => setTimeout(resolve, 200));
          setAnimatedSkills(prev => [...prev, sampleResume.skills[j]]);
        }
      }
    }

    setIsAnalyzing(false);
    setShowResults(true);
  };

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-6', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-midnight-forest">
          AI-Powered Resume Analysis
        </h2>
        <p className="text-base-content/70 max-w-2xl mx-auto leading-relaxed">
          See how our AI analyzes your experience and matches you with Massachusetts 
          clean energy opportunities in seconds.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Demo Resume */}
        <Card variant="glass" className="h-fit">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>📄</span>
              Sample Resume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-midnight-forest">{sampleResume.name}</h3>
              <p className="text-moss-green">{sampleResume.title}</p>
              <p className="text-sm text-base-content/70">{sampleResume.education}</p>
            </div>

            <div>
              <h4 className="font-medium text-midnight-forest mb-2">Experience</h4>
              <p className="text-sm text-base-content/70">{sampleResume.experience}</p>
            </div>

            <div>
              <h4 className="font-medium text-midnight-forest mb-2">Skills</h4>
              <div className="flex flex-wrap gap-2">
                {sampleResume.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={cn(
                      'px-3 py-1 rounded-full text-xs transition-all duration-500',
                      animatedSkills.includes(skill)
                        ? 'bg-spring-green text-midnight-forest transform scale-110'
                        : 'bg-sand-gray/30 text-base-content/60'
                    )}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-midnight-forest mb-2">Certifications</h4>
              <ul className="text-sm text-base-content/70 space-y-1">
                {sampleResume.certifications.map((cert, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="text-spring-green">•</span>
                    {cert}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Analysis Panel */}
        <div className="space-y-6">
          {/* Analysis Progress */}
          <Card variant="glass">
            <CardContent className="p-6">
              {!isAnalyzing && !showResults && (
                <div className="text-center space-y-4">
                  <EcoPulse size="lg" />
                  <h3 className="text-lg font-semibold text-midnight-forest">
                    Ready to Analyze
                  </h3>
                  <p className="text-base-content/70">
                    Click below to see our AI in action
                  </p>
                  <Button 
                    variant="eco-gradient" 
                    size="lg" 
                    onClick={startAnalysis}
                    className="shadow-lg"
                  >
                    Start Analysis
                  </Button>
                </div>
              )}

              {isAnalyzing && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                      Analyzing Resume...
                    </h3>
                    <EcoPulse size="lg" />
                  </div>

                  {/* Analysis Steps */}
                  <div className="space-y-4">
                    {analysisSteps.map((step, index) => (
                      <div 
                        key={step.step}
                        className={cn(
                          'flex items-center gap-4 p-3 rounded-lg transition-all duration-500',
                          index <= currentStep 
                            ? 'bg-spring-green/10 border border-spring-green/20' 
                            : 'bg-sand-gray/20'
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-500',
                          index <= currentStep 
                            ? 'bg-spring-green text-midnight-forest' 
                            : 'bg-sand-gray text-base-content/50'
                        )}>
                          {index < currentStep ? '✓' : step.icon}
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-midnight-forest">{step.title}</h4>
                          <p className="text-sm text-base-content/70">{step.description}</p>
                        </div>
                        {index === currentStep && (
                          <Spinner size="sm" variant="gradient" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {showResults && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-midnight-forest">
                      ✅ Analysis Complete!
                    </h3>
                    <p className="text-base-content/70">
                      Found {jobMatches.length} matching opportunities in Massachusetts
                    </p>
                  </div>

                  {/* Overall Score */}
                  <div className="text-center p-4 bg-gradient-to-r from-spring-green/10 to-moss-green/10 rounded-lg">
                    <div className="text-3xl font-bold text-spring-green">94%</div>
                    <div className="text-sm text-midnight-forest font-medium">
                      Clean Energy Career Match
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Job Matches */}
          {showResults && showDetails && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🎯</span>
                  Top Job Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobMatches.map((job, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-sand-gray/30 rounded-lg hover:border-spring-green/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-midnight-forest">{job.title}</h4>
                        <p className="text-moss-green font-medium">{job.company}</p>
                        <p className="text-sm text-base-content/70">{job.location} • {job.type}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-spring-green">{job.match}%</div>
                        <div className="text-xs text-base-content/60">match</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-midnight-forest font-medium">{job.salary}</span>
                      <div className="w-20 h-2 bg-sand-gray/30 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-spring-green to-moss-green transition-all duration-1000"
                          style={{ width: `${job.match}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* CTA */}
      {showResults && (
        <div className="text-center space-y-4 p-6 bg-gradient-to-r from-spring-green/5 to-moss-green/5 rounded-xl">
          <h3 className="text-xl font-semibold text-midnight-forest">
            Ready to Find Your Perfect Green Job?
          </h3>
          <p className="text-base-content/70">
            Upload your resume and discover Massachusetts clean energy opportunities today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="eco-gradient" 
              size="lg"
              onClick={onTryNow}
              className="shadow-lg"
            >
              Try with Your Resume
            </Button>
            <Button 
              variant="outline-primary" 
              size="lg"
              onClick={startAnalysis}
            >
              Watch Demo Again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalysisShowcase; 
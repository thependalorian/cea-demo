/**
 * MilitarySkillsTranslationShowcase Component - ACT Climate Economy Assistant
 * 
 * Purpose: Interactive demo showing how military skills translate to clean energy careers
 * Location: /app/components/showcase/MilitarySkillsTranslationShowcase.tsx
 * Used by: Homepage, veterans page, and resources page to showcase veteran support
 * 
 * Features:
 * - Military Occupational Specialty (MOS) to civilian job mapping
 * - Interactive skill translation with visual connections
 * - Massachusetts veteran hiring incentives information
 * - Real veteran success stories and testimonials
 * - Clean energy career pathways for different military backgrounds
 * - ACT brand styling with military-to-civilian transition focus
 * - Accessibility compliant with veteran-friendly design
 * 
 * @example
 * <MilitarySkillsTranslationShowcase 
 *   selectedMOS="25B"
 *   showSuccessStories={true}
 *   onGetStarted={handleGetStarted}
 * />
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/input';
import { EcoPulse, Spinner } from '@/components/ui/loading';

// Military Occupational Specialties data
const militarySkills = {
  '25B': {
    title: 'Information Technology Specialist',
    branch: 'Army',
    description: 'Install, operate, and maintain IT systems and networks',
    skills: [
      'Network Administration',
      'Systems Troubleshooting', 
      'IT Security',
      'Help Desk Support',
      'Equipment Maintenance'
    ],
    civilianJobs: [
      {
        title: 'Smart Grid IT Specialist',
        company: 'Eversource Energy',
        location: 'Boston, MA',
        salary: '$65K - $85K',
        match: 92,
        description: 'Manage IT systems for smart grid infrastructure'
      },
      {
        title: 'Solar Monitoring Systems Technician',
        company: 'SunPower Corporation',
        location: 'Worcester, MA',
        salary: '$55K - $70K',
        match: 88,
        description: 'Monitor and maintain solar farm IT systems'
      }
    ]
  },
  '12B': {
    title: 'Combat Engineer',
    branch: 'Army',
    description: 'Construction, demolition, and engineering support',
    skills: [
      'Construction Management',
      'Heavy Equipment Operation',
      'Project Planning',
      'Safety Protocols',
      'Team Leadership'
    ],
    civilianJobs: [
      {
        title: 'Wind Farm Construction Manager',
        company: 'Ørsted',
        location: 'Cape Cod, MA',
        salary: '$75K - $95K',
        match: 94,
        description: 'Oversee offshore wind turbine installation'
      },
      {
        title: 'Solar Installation Project Lead',
        company: 'Trinity Solar',
        location: 'Springfield, MA',
        salary: '$60K - $80K',
        match: 89,
        description: 'Lead residential and commercial solar projects'
      }
    ]
  },
  '6C': {
    title: 'Aircraft Electrician',
    branch: 'Navy',
    description: 'Maintain and repair aircraft electrical systems',
    skills: [
      'Electrical Systems',
      'Diagnostic Testing',
      'Preventive Maintenance',
      'Technical Documentation',
      'Quality Control'
    ],
    civilianJobs: [
      {
        title: 'Wind Turbine Technician',
        company: 'Vestas',
        location: 'Fall River, MA',
        salary: '$70K - $90K',
        match: 96,
        description: 'Maintain and repair wind turbine electrical systems'
      },
      {
        title: 'Energy Storage Systems Technician',
        company: 'Tesla Energy',
        location: 'Cambridge, MA',
        salary: '$65K - $85K',
        match: 91,
        description: 'Install and maintain battery storage systems'
      }
    ]
  }
};

const veteranSuccessStories = [
  {
    name: 'Staff Sergeant Maria Rodriguez',
    previousMOS: '25B - IT Specialist',
    newRole: 'Smart Grid Engineer at National Grid',
    quote: 'My military IT experience translated perfectly to managing smart grid systems. ACT helped me see the connection.',
    image: '👩‍💼',
    timeframe: '3 months to placement'
  },
  {
    name: 'Petty Officer James Wilson', 
    previousMOS: '6C - Aircraft Electrician',
    newRole: 'Wind Turbine Technician at Ørsted',
    quote: 'Working on wind turbines feels like maintaining aircraft - just on the ground. The pay is better too!',
    image: '👨‍🔧',
    timeframe: '6 weeks to placement'
  }
];

export interface MilitarySkillsTranslationShowcaseProps {
  selectedMOS?: string;
  showSuccessStories?: boolean;
  onGetStarted?: () => void;
  className?: string;
}

const MilitarySkillsTranslationShowcase: React.FC<MilitarySkillsTranslationShowcaseProps> = ({
  selectedMOS,
  showSuccessStories = true,
  onGetStarted,
  className
}) => {
  const [currentMOS, setCurrentMOS] = useState<string>(selectedMOS || '25B');
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentSkills = militarySkills[currentMOS as keyof typeof militarySkills];

  // Auto-run demo if MOS is selected
  useEffect(() => {
    if (selectedMOS) {
      setTimeout(() => {
        startTranslation();
      }, 1000);
    }
  }, [selectedMOS]);

  const startTranslation = async () => {
    setIsTranslating(true);
    setShowTranslation(false);

    // Simulate translation process
    await new Promise(resolve => setTimeout(resolve, 3000));

    setIsTranslating(false);
    setShowTranslation(true);
  };

  const handleMOSSelect = (mos: string) => {
    setCurrentMOS(mos);
    setShowTranslation(false);
    startTranslation();
  };

  const filteredMOS = Object.entries(militarySkills).filter(([code, data]) =>
    searchQuery === '' ||
    code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    data.branch.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn('w-full max-w-6xl mx-auto space-y-8', className)}>
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-midnight-forest">
          🇺🇸 Military Skills to Clean Energy Careers
        </h2>
        <p className="text-base-content/70 max-w-3xl mx-auto leading-relaxed">
          Your military experience is valuable in Massachusetts clean energy sector. 
          See how your skills translate to high-paying green jobs with veteran hiring preferences.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* MOS Selection */}
        <div className="space-y-6">
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>🎖️</span>
                Select Your MOS
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SearchInput
                placeholder="Search MOS code or job title..."
                value={searchQuery}
                onSearch={setSearchQuery}
                className="w-full"
              />

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {filteredMOS.map(([code, data]) => (
                  <button
                    key={code}
                    onClick={() => handleMOSSelect(code)}
                    className={cn(
                      'w-full p-3 text-left rounded-lg border transition-all duration-200',
                      currentMOS === code
                        ? 'border-spring-green bg-spring-green/10 shadow-sm'
                        : 'border-sand-gray hover:border-moss-green hover:bg-moss-green/5'
                    )}
                  >
                    <div className="font-medium text-midnight-forest">
                      {code} - {data.title}
                    </div>
                    <div className="text-sm text-moss-green">{data.branch}</div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Massachusetts Veteran Benefits */}
          <Card variant="gradient" className="border-spring-green/20">
            <CardContent className="p-4">
              <div className="text-center space-y-2">
                <div className="text-2xl">🏆</div>
                <h3 className="font-semibold text-midnight-forest">
                  MA Veteran Advantages
                </h3>
                <div className="text-sm text-base-content/70 space-y-1">
                  <div>• Veterans Preference in hiring</div>
                  <div>• $3,000 training tax credits</div>
                  <div>• Accelerated security clearances</div>
                  <div>• Military skill recognition</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Translation Process */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current MOS Details */}
          <Card variant="glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📋</span>
                {currentMOS} - {currentSkills?.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-base-content/70 mb-3">
                  {currentSkills?.description}
                </p>
                <div>
                  <h4 className="font-medium text-midnight-forest mb-2">Military Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentSkills?.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-moss-green/10 text-moss-green rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {!isTranslating && !showTranslation && (
                <div className="text-center">
                  <Button 
                    variant="eco-gradient" 
                    onClick={startTranslation}
                    className="shadow-lg"
                  >
                    Translate to Clean Energy Jobs
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Translation Process */}
          {isTranslating && (
            <Card variant="glass">
              <CardContent className="p-6 text-center space-y-6">
                <EcoPulse size="lg" />
                <div>
                  <h3 className="text-lg font-semibold text-midnight-forest mb-2">
                    Analyzing Your Military Experience
                  </h3>
                  <p className="text-base-content/70">
                    Mapping your skills to Massachusetts clean energy opportunities...
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-spring-green/10 rounded-lg">
                    <Spinner size="sm" variant="gradient" />
                    <span className="text-sm text-midnight-forest">
                      Matching technical skills to clean energy roles
                    </span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-moss-green/10 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-moss-green animate-pulse"></div>
                    <span className="text-sm text-midnight-forest">
                      Finding veteran-friendly employers in MA
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Translation Results */}
          {showTranslation && (
            <Card variant="glass">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>🎯</span>
                  Your Clean Energy Career Matches
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-gradient-to-r from-spring-green/10 to-moss-green/10 rounded-lg">
                  <div className="text-2xl font-bold text-spring-green">
                    {currentSkills?.civilianJobs.length} Jobs Found
                  </div>
                  <div className="text-sm text-midnight-forest">
                    With veteran hiring preference
                  </div>
                </div>

                {currentSkills?.civilianJobs.map((job, index) => (
                  <div 
                    key={index}
                    className="p-4 border border-sand-gray/30 rounded-lg hover:border-spring-green/30 transition-all duration-300 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-midnight-forest">{job.title}</h4>
                        <p className="text-moss-green font-medium">{job.company}</p>
                        <p className="text-sm text-base-content/70">{job.location}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-spring-green">{job.match}%</div>
                        <div className="text-xs text-base-content/60">match</div>
                      </div>
                    </div>

                    <p className="text-sm text-base-content/70 mb-3">{job.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-midnight-forest">{job.salary}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-spring-green">🇺🇸 Veteran Preferred</span>
                        <div className="w-16 h-2 bg-sand-gray/30 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-spring-green to-moss-green transition-all duration-1000"
                            style={{ width: `${job.match}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="text-center space-y-4 pt-4">
                  <h3 className="font-semibold text-midnight-forest">
                    Ready to Start Your Clean Energy Career?
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="eco-gradient" 
                      onClick={onGetStarted}
                      className="shadow-lg"
                    >
                      Get Started Today
                    </Button>
                    <Button variant="outline-primary">
                      Download MOS Translation Guide
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Success Stories */}
      {showSuccessStories && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-midnight-forest text-center">
            🌟 Veteran Success Stories
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {veteranSuccessStories.map((story, index) => (
              <Card key={index} variant="glass" className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{story.image}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-midnight-forest">{story.name}</h4>
                      <p className="text-sm text-moss-green mb-2">{story.previousMOS}</p>
                      <p className="text-sm font-medium text-spring-green mb-3">{story.newRole}</p>
                      <blockquote className="text-sm text-base-content/70 italic leading-relaxed">
                        "{story.quote}"
                      </blockquote>
                      <div className="text-xs text-base-content/50 mt-3 text-right">
                        {story.timeframe}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="text-center space-y-4 p-8 bg-gradient-to-r from-spring-green/5 to-moss-green/5 rounded-xl">
        <h3 className="text-2xl font-bold text-midnight-forest">
          Honor Your Service with a Clean Energy Career
        </h3>
        <p className="text-base-content/70 max-w-2xl mx-auto">
          Massachusetts values your military experience. Join thousands of veterans 
          building a sustainable future while earning competitive salaries.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            variant="eco-gradient" 
            size="lg"
            onClick={onGetStarted}
            className="shadow-lg"
          >
            Start My Transition
          </Button>
          <Button variant="outline-primary" size="lg">
            Download Veteran Resource Guide
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MilitarySkillsTranslationShowcase;
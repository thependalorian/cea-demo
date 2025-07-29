/**
 * BookingFeatureShowcase
 * 
 * Purpose: Interactive showcase demonstrating the meeting scheduling feature
 * for connecting job seekers with Massachusetts clean energy professionals
 * Location: /app/components/showcase/BookingFeatureShowcase.tsx
 * Used by: Homepage to showcase booking capabilities for networking and career guidance
 * 
 * Features:
 * - Interactive calendar demo
 * - Professional type selection
 * - Time slot booking simulation
 * - Meeting preparation suggestions
 * - ACT brand integration with accessibility focus
 * 
 * @example
 * <BookingFeatureShowcase />
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';

// Professional types available for booking
interface Professional {
  id: string;
  type: 'employer' | 'mentor' | 'counselor' | 'recruiter';
  name: string;
  title: string;
  company: string;
  specialties: string[];
  rating: number;
  experience: string;
  meetingTypes: string[];
  avatar: string;
  location: string;
  languages: string[];
}

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  duration: string;
  type: 'virtual' | 'in-person' | 'phone';
}

interface BookingStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: string;
}

interface MeetingPrep {
  category: string;
  suggestions: string[];
  icon: string;
}

const sampleProfessionals: Professional[] = [
  {
    id: 'sarah_chen',
    type: 'employer',
    name: 'Sarah Chen',
    title: 'Solar Installation Manager',
    company: 'Massachusetts Solar Solutions',
    specialties: ['Solar Installation', 'Project Management', 'Team Leadership'],
    rating: 4.8,
    experience: '8+ years',
    meetingTypes: ['Career Discussion', 'Interview Prep', 'Industry Insights'],
    avatar: '👩‍💼',
    location: 'Boston, MA',
    languages: ['English', 'Mandarin']
  },
  {
    id: 'marcus_rodriguez',
    type: 'mentor',
    name: 'Marcus Rodriguez',
    title: 'Senior Wind Energy Engineer',
    company: 'Bay State Wind',
    specialties: ['Offshore Wind', 'Engineering Design', 'Career Development'],
    rating: 4.9,
    experience: '12+ years',
    meetingTypes: ['Mentorship Session', 'Technical Guidance', 'Career Planning'],
    avatar: '👨‍🔧',
    location: 'New Bedford, MA',
    languages: ['English', 'Spanish']
  },
  {
    id: 'dr_thompson',
    type: 'counselor',
    name: 'Dr. Jennifer Thompson',
    title: 'Clean Energy Career Counselor',
    company: 'Massachusetts Clean Energy Center',
    specialties: ['Career Transitions', 'Skills Assessment', 'Education Planning'],
    rating: 4.7,
    experience: '15+ years',
    meetingTypes: ['Career Assessment', 'Pathway Planning', 'Skills Evaluation'],
    avatar: '👩‍🎓',
    location: 'Springfield, MA',
    languages: ['English', 'Portuguese']
  },
  {
    id: 'james_wilson',
    type: 'recruiter',
    name: 'James Wilson',
    title: 'Clean Energy Talent Acquisition',
    company: 'Green Jobs Massachusetts',
    specialties: ['Talent Matching', 'Resume Review', 'Interview Coaching'],
    rating: 4.6,
    experience: '6+ years',
    meetingTypes: ['Job Matching', 'Resume Review', 'Interview Practice'],
    avatar: '👨‍💼',
    location: 'Worcester, MA',
    languages: ['English', 'French']
  }
];

const timeSlots: TimeSlot[] = [
  { id: '1', time: '9:00 AM', available: true, duration: '30 min', type: 'virtual' },
  { id: '2', time: '10:00 AM', available: false, duration: '45 min', type: 'virtual' },
  { id: '3', time: '11:00 AM', available: true, duration: '30 min', type: 'in-person' },
  { id: '4', time: '1:00 PM', available: true, duration: '60 min', type: 'virtual' },
  { id: '5', time: '2:30 PM', available: true, duration: '30 min', type: 'phone' },
  { id: '6', time: '4:00 PM', available: false, duration: '45 min', type: 'virtual' },
];

const BookingFeatureShowcase: React.FC = () => {
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeSlot | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<string>('');
  const [bookingStep, setBookingStep] = useState<'select' | 'schedule' | 'confirm' | 'complete'>('select');
  const [isBooking, setIsBooking] = useState(false);

  const bookingSteps: BookingStep[] = [
    {
      id: 'select',
      title: 'Select Professional',
      description: 'Choose who you want to meet with',
      completed: !!selectedProfessional,
      icon: '👥'
    },
    {
      id: 'schedule',
      title: 'Schedule Time',
      description: 'Pick your preferred time slot',
      completed: !!selectedTimeSlot,
      icon: '📅'
    },
    {
      id: 'confirm',
      title: 'Confirm Details',
      description: 'Review and confirm your booking',
      completed: bookingStep === 'complete',
      icon: '✅'
    }
  ];

  const meetingPreparation: MeetingPrep[] = [
    {
      category: 'Research',
      icon: '🔍',
      suggestions: [
        'Review the professional\'s background and company',
        'Research recent Massachusetts clean energy initiatives',
        'Prepare specific questions about their career path',
        'Look up recent industry news and trends'
      ]
    },
    {
      category: 'Documents',
      icon: '📄',
      suggestions: [
        'Update your resume with latest experiences',
        'Prepare a brief personal introduction',
        'Create a list of your key skills and interests',
        'Gather any relevant certifications or portfolios'
      ]
    },
    {
      category: 'Questions',
      icon: '❓',
      suggestions: [
        'What skills are most valuable in your field?',
        'How did you transition into clean energy?',
        'What career opportunities do you see growing?',
        'What advice would you give to someone starting out?'
      ]
    },
    {
      category: 'Goals',
      icon: '🎯',
      suggestions: [
        'Define what you want to achieve from this meeting',
        'Set 2-3 specific learning objectives',
        'Prepare your elevator pitch (30-60 seconds)',
        'Think about next steps you want to discuss'
      ]
    }
  ];

  const handleBooking = async () => {
    setIsBooking(true);
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBookingStep('complete');
    setIsBooking(false);
  };

  const resetDemo = () => {
    setSelectedProfessional(null);
    setSelectedTimeSlot(null);
    setSelectedMeetingType('');
    setBookingStep('select');
    setIsBooking(false);
  };

  const getProfessionalTypeColor = (type: string) => {
    switch (type) {
      case 'employer': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'mentor': return 'bg-green-100 text-green-800 border-green-200';
      case 'counselor': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'recruiter': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMeetingTypeIcon = (type: string) => {
    switch (type) {
      case 'virtual': return '💻';
      case 'in-person': return '🏢';
      case 'phone': return '📞';
      default: return '💬';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>
        ⭐
      </span>
    ));
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-spring-green/10 rounded-full">
            <span className="text-2xl">📅</span>
          </div>
          <h2 className="text-3xl font-bold text-midnight-forest">
            Schedule Career Meetings
          </h2>
        </div>
        <p className="text-lg text-moss-green max-w-3xl mx-auto">
          Connect with Massachusetts clean energy professionals for career guidance, 
          mentorship, and job opportunities. Book meetings that fit your schedule 
          and career goals.
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center">
        <div className="flex items-center space-x-4">
          {bookingSteps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors",
                step.completed 
                  ? "bg-spring-green border-spring-green text-midnight-forest" 
                  : "bg-gray-100 border-gray-300 text-gray-500"
              )}>
                <span className="text-lg">{step.icon}</span>
              </div>
              <div className="ml-3 text-sm">
                <div className={cn(
                  "font-medium",
                  step.completed ? "text-midnight-forest" : "text-gray-500"
                )}>
                  {step.title}
                </div>
                <div className="text-gray-400 text-xs">{step.description}</div>
              </div>
              {index < bookingSteps.length - 1 && (
                <div className={cn(
                  "mx-4 h-px w-12 transition-colors",
                  step.completed ? "bg-spring-green" : "bg-gray-300"
                )} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      {bookingStep === 'select' && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center text-midnight-forest">
            Choose a Professional to Meet With
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {sampleProfessionals.map((professional) => (
              <Card key={professional.id} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl mb-2">{professional.avatar}</div>
                    <h4 className="font-semibold text-midnight-forest">
                      {professional.name}
                    </h4>
                    <p className="text-sm text-moss-green">{professional.title}</p>
                    <p className="text-xs text-gray-600">{professional.company}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className={cn(
                      "inline-block px-2 py-1 rounded-full text-xs font-medium border",
                      getProfessionalTypeColor(professional.type)
                    )}>
                      {professional.type.charAt(0).toUpperCase() + professional.type.slice(1)}
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{professional.experience}</span>
                      <div className="flex items-center gap-1">
                        {renderStars(Math.floor(professional.rating))}
                        <span className="text-xs text-gray-500">({professional.rating})</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1">
                      {professional.specialties.slice(0, 2).map((specialty, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {specialty}
                        </span>
                      ))}
                      {professional.specialties.length > 2 && (
                        <span className="text-xs text-gray-400">
                          +{professional.specialties.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedProfessional(professional);
                      setBookingStep('schedule');
                    }}
                    className="w-full group-hover:bg-spring-green group-hover:text-midnight-forest transition-colors"
                    variant="outline"
                  >
                    Select {professional.name}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {bookingStep === 'schedule' && selectedProfessional && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-midnight-forest">
              Schedule with {selectedProfessional.name}
            </h3>
            <Button
              onClick={() => setBookingStep('select')}
              variant="ghost"
              size="sm"
              className="text-moss-green hover:text-midnight-forest"
            >
              ← Back
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Meeting Type Selection */}
            <Card className="p-6">
              <h4 className="font-semibold text-midnight-forest mb-4">
                Choose Meeting Type
              </h4>
              <div className="space-y-3">
                {selectedProfessional.meetingTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedMeetingType(type)}
                    className={cn(
                      "w-full p-3 text-left border rounded-lg transition-colors",
                      selectedMeetingType === type
                        ? "border-spring-green bg-spring-green/10 text-midnight-forest"
                        : "border-gray-200 hover:border-moss-green hover:bg-moss-green/5"
                    )}
                  >
                    <div className="font-medium">{type}</div>
                    <div className="text-sm text-gray-600">
                      {type === 'Career Discussion' && '30-45 minutes focused on career exploration'}
                      {type === 'Interview Prep' && '45-60 minutes of interview practice and feedback'}
                      {type === 'Industry Insights' && '30 minutes discussing industry trends and opportunities'}
                      {type === 'Mentorship Session' && '60 minutes of one-on-one mentoring and guidance'}
                      {type === 'Technical Guidance' && '45 minutes discussing technical skills and development'}
                      {type === 'Career Planning' && '60 minutes creating a personalized career roadmap'}
                      {type === 'Career Assessment' && '90 minutes comprehensive skills and interests evaluation'}
                      {type === 'Pathway Planning' && '60 minutes designing your education and career path'}
                      {type === 'Skills Evaluation' && '45 minutes assessing your current skills and gaps'}
                      {type === 'Job Matching' && '30 minutes discussing current job opportunities'}
                      {type === 'Resume Review' && '30 minutes reviewing and improving your resume'}
                      {type === 'Interview Practice' && '45 minutes of mock interviews and feedback'}
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Time Slot Selection */}
            <Card className="p-6">
              <h4 className="font-semibold text-midnight-forest mb-4">
                Available Time Slots - Tomorrow
              </h4>
              <div className="space-y-3">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && setSelectedTimeSlot(slot)}
                    disabled={!slot.available}
                    className={cn(
                      "w-full p-3 text-left border rounded-lg transition-colors flex items-center justify-between",
                      !slot.available && "opacity-50 cursor-not-allowed bg-gray-50",
                      slot.available && selectedTimeSlot?.id === slot.id
                        ? "border-spring-green bg-spring-green/10 text-midnight-forest"
                        : slot.available
                        ? "border-gray-200 hover:border-moss-green hover:bg-moss-green/5"
                        : "border-gray-200"
                    )}
                  >
                    <div>
                      <div className="font-medium flex items-center gap-2">
                        <span>{slot.time}</span>
                        <span className="text-lg">{getMeetingTypeIcon(slot.type)}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {slot.duration} • {slot.type}
                        {!slot.available && ' (Booked)'}
                      </div>
                    </div>
                    {slot.available && selectedTimeSlot?.id === slot.id && (
                      <span className="text-spring-green">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {selectedMeetingType && selectedTimeSlot && (
            <div className="text-center">
              <Button
                onClick={() => setBookingStep('confirm')}
                className="bg-spring-green text-midnight-forest hover:bg-spring-green/90 px-8"
              >
                Continue to Confirmation
              </Button>
            </div>
          )}
        </div>
      )}

      {bookingStep === 'confirm' && selectedProfessional && selectedTimeSlot && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-midnight-forest">
              Confirm Your Meeting
            </h3>
            <Button
              onClick={() => setBookingStep('schedule')}
              variant="ghost"
              size="sm"
              className="text-moss-green hover:text-midnight-forest"
            >
              ← Back
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Meeting Summary */}
            <Card className="p-6">
              <h4 className="font-semibold text-midnight-forest mb-4">
                Meeting Details
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{selectedProfessional.avatar}</div>
                  <div>
                    <div className="font-medium">{selectedProfessional.name}</div>
                    <div className="text-sm text-moss-green">{selectedProfessional.title}</div>
                    <div className="text-xs text-gray-600">{selectedProfessional.company}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📅</span>
                    <div>
                      <div className="font-medium">Tomorrow</div>
                      <div className="text-sm text-gray-600">{selectedTimeSlot.time}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{getMeetingTypeIcon(selectedTimeSlot.type)}</span>
                    <div>
                      <div className="font-medium">{selectedTimeSlot.type}</div>
                      <div className="text-sm text-gray-600">{selectedTimeSlot.duration}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-lg">💼</span>
                    <div>
                      <div className="font-medium">{selectedMeetingType}</div>
                      <div className="text-sm text-gray-600">Meeting focus</div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Meeting Preparation */}
            <Card className="p-6">
              <h4 className="font-semibold text-midnight-forest mb-4">
                Meeting Preparation Tips
              </h4>
              <div className="space-y-4">
                {meetingPreparation.slice(0, 2).map((prep) => (
                  <div key={prep.category}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{prep.icon}</span>
                      <h5 className="font-medium text-midnight-forest">{prep.category}</h5>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1 pl-6">
                      {prep.suggestions.slice(0, 2).map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-spring-green mt-1">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="text-center space-y-4">
            <Button
              onClick={handleBooking}
              disabled={isBooking}
              className="bg-spring-green text-midnight-forest hover:bg-spring-green/90 px-8"
            >
              {isBooking ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  Booking Meeting...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          </div>
        </div>
      )}

      {bookingStep === 'complete' && selectedProfessional && selectedTimeSlot && (
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-spring-green/10 rounded-full">
            <span className="text-4xl">✅</span>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-midnight-forest">
              Meeting Booked Successfully!
            </h3>
            <p className="text-lg text-moss-green">
              Your meeting with {selectedProfessional.name} is confirmed for tomorrow at {selectedTimeSlot.time}
            </p>
          </div>

          {/* Complete Meeting Preparation */}
          <Card className="p-6 max-w-4xl mx-auto">
            <h4 className="font-semibold text-midnight-forest mb-6 text-center">
              Complete Meeting Preparation Guide
            </h4>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {meetingPreparation.map((prep) => (
                <div key={prep.category} className="space-y-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{prep.icon}</span>
                    <h5 className="font-medium text-midnight-forest">{prep.category}</h5>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-2">
                    {prep.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-spring-green mt-1 flex-shrink-0">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Card>

          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              You'll receive a calendar invitation and preparation materials via email.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-spring-green text-midnight-forest hover:bg-spring-green/90">
                Add to Calendar
              </Button>
              <Button 
                variant="outline" 
                onClick={resetDemo}
                className="border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
              >
                Book Another Meeting
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingFeatureShowcase;
/**
 * AgentTeamsShowcase
 * 
 * Purpose: Interactive showcase demonstrating how AI agent teams collaborate
 * to provide comprehensive career support in Massachusetts clean energy sector
 * Location: /app/components/showcase/AgentTeamsShowcase.tsx
 * Used by: Homepage to showcase AI agent team capabilities and collaboration
 * 
 * Features:
 * - Multiple specialized AI agents
 * - Interactive conversation simulation
 * - Agent handoffs and collaboration
 * - Real-time thinking process visualization
 * - Massachusetts clean energy focus
 * - ACT brand integration with accessibility focus
 * 
 * @example
 * <AgentTeamsShowcase />
 */

'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/loading';

// AI Agent types and their specializations
interface Agent {
  id: string;
  name: string;
  role: string;
  specialty: string;
  avatar: string;
  color: string;
  description: string;
  capabilities: string[];
  active: boolean;
  thinking?: string;
}

interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'handoff' | 'analysis' | 'recommendation';
  metadata?: {
    confidence?: number;
    reasoning?: string;
    nextSteps?: string[];
  };
}

interface Scenario {
  id: string;
  title: string;
  description: string;
  userMessage: string;
  icon: string;
  expectedAgents: string[];
}

const aiAgents: Agent[] = [
  {
    id: 'career_advisor',
    name: 'Alex',
    role: 'Career Advisor',
    specialty: 'Career Planning & Strategy',
    avatar: '🎯',
    color: 'from-blue-500 to-blue-600',
    description: 'Helps plan career paths and set achievable goals in clean energy',
    capabilities: [
      'Career pathway planning',
      'Goal setting and tracking',
      'Industry trend analysis',
      'Skills gap identification'
    ],
    active: false
  },
  {
    id: 'skills_assessor',
    name: 'Sam',
    role: 'Skills Assessor',
    specialty: 'Skills Analysis & Development',
    avatar: '🔍',
    color: 'from-green-500 to-green-600',
    description: 'Evaluates current skills and recommends development opportunities',
    capabilities: [
      'Skills assessment and mapping',
      'Training recommendations',
      'Certification guidance',
      'Portfolio development'
    ],
    active: false
  },
  {
    id: 'job_matcher',
    name: 'Jordan',
    role: 'Job Matcher',
    specialty: 'Job Matching & Applications',
    avatar: '💼',
    color: 'from-purple-500 to-purple-600',
    description: 'Finds and matches candidates with relevant Massachusetts clean energy jobs',
    capabilities: [
      'Job opportunity identification',
      'Resume optimization',
      'Application strategy',
      'Interview preparation'
    ],
    active: false
  },
  {
    id: 'market_analyst',
    name: 'Taylor',
    role: 'Market Analyst',
    specialty: 'Industry & Market Intelligence',
    avatar: '📊',
    color: 'from-orange-500 to-orange-600',
    description: 'Provides insights on Massachusetts clean energy market trends and opportunities',
    capabilities: [
      'Market trend analysis',
      'Salary benchmarking',
      'Company research',
      'Industry forecasting'
    ],
    active: false
  },
  {
    id: 'networking_guide',
    name: 'Riley',
    role: 'Networking Guide',
    specialty: 'Professional Networking',
    avatar: '🤝',
    color: 'from-pink-500 to-pink-600',
    description: 'Helps build professional networks and connections in the clean energy sector',
    capabilities: [
      'Networking strategy',
      'Event recommendations',
      'LinkedIn optimization',
      'Mentor matching'
    ],
    active: false
  },
  {
    id: 'coordinator',
    name: 'Casey',
    role: 'Team Coordinator',
    specialty: 'Agent Coordination & Synthesis',
    avatar: '🧠',
    color: 'from-spring-green to-moss-green',
    description: 'Coordinates the agent team and synthesizes insights for comprehensive guidance',
    capabilities: [
      'Agent orchestration',
      'Insight synthesis',
      'Decision coordination',
      'Action planning'
    ],
    active: true
  }
];

const scenarios: Scenario[] = [
  {
    id: 'career_transition',
    title: 'Career Transition',
    description: 'Transitioning from traditional engineering to clean energy',
                    userMessage: "I'm a mechanical engineer wanting to transition into Massachusetts' offshore wind industry. How do I make this transition?",
    icon: '🔄',
    expectedAgents: ['coordinator', 'career_advisor', 'skills_assessor', 'job_matcher', 'market_analyst']
  },
  {
    id: 'recent_graduate',
    title: 'Recent Graduate',
    description: 'New graduate seeking entry-level opportunities',
    userMessage: "I just graduated with an environmental science degree. What entry-level clean energy jobs are available in Massachusetts?",
    icon: '🎓',
    expectedAgents: ['coordinator', 'job_matcher', 'market_analyst', 'networking_guide']
  },
  {
    id: 'skill_development',
    title: 'Skill Development',
    description: 'Upskilling for advancement in clean energy',
    userMessage: "I work in solar installation but want to advance to project management. What skills do I need to develop?",
    icon: '📚',
    expectedAgents: ['coordinator', 'skills_assessor', 'career_advisor', 'job_matcher']
  },
  {
    id: 'industry_exploration',
    title: 'Industry Exploration',
    description: 'Exploring different clean energy sectors',
                    userMessage: "I'm interested in clean energy but don't know which sector would be the best fit. Can you help me explore options?",
    icon: '🌱',
    expectedAgents: ['coordinator', 'market_analyst', 'career_advisor', 'networking_guide']
  }
];

const AgentTeamsShowcase: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
  const [agents, setAgents] = useState<Agent[]>(aiAgents);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Simulate agent conversation flow
  const simulateAgentConversation = async (scenario: Scenario) => {
    setIsProcessing(true);
    setMessages([]);
    setCurrentStep(0);

    // Reset all agents
    setAgents(prev => prev.map(agent => ({ ...agent, active: false, thinking: undefined })));

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversationFlow = getConversationFlow(scenario);
    
    for (let i = 0; i < conversationFlow.length; i++) {
      const step = conversationFlow[i];
      setCurrentStep(i);

      // Activate thinking agent
      setAgents(prev => prev.map(agent => ({
        ...agent,
        active: agent.id === step.agentId,
        thinking: agent.id === step.agentId ? step.thinking : undefined
      })));

      await new Promise(resolve => setTimeout(resolve, 1500));

      // Add message
      const newMessage: Message = {
        id: `msg_${i}`,
        agentId: step.agentId,
        content: step.content,
        timestamp: new Date(),
        type: step.type,
        metadata: step.metadata
      };

      setMessages(prev => [...prev, newMessage]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    setIsProcessing(false);
    setAgents(prev => prev.map(agent => ({ ...agent, active: false, thinking: undefined })));
  };

  const getConversationFlow = (scenario: Scenario) => {
    const flows: Record<string, any[]> = {
      career_transition: [
        {
          agentId: 'coordinator',
          thinking: 'Analyzing user request for career transition support...',
          content: "I understand you want to transition from mechanical engineering to offshore wind. Let me coordinate with my team to give you comprehensive guidance.",
          type: 'message'
        },
        {
          agentId: 'market_analyst',
          thinking: 'Researching Massachusetts offshore wind market trends...',
          content: "The offshore wind industry in Massachusetts is booming! We have major projects like Vineyard Wind and Commonwealth Wind creating thousands of jobs. The state aims for 5,600 MW of offshore wind by 2027.",
          type: 'analysis',
          metadata: {
            confidence: 95,
            reasoning: 'Based on current MA Clean Energy Plan and active projects'
          }
        },
        {
          agentId: 'skills_assessor',
          thinking: 'Mapping mechanical engineering skills to offshore wind requirements...',
          content: "Your mechanical engineering background is highly valuable! Key transferable skills: structural analysis, mechanical systems design, and project engineering. You'll want to add: offshore-specific design codes, marine engineering basics, and wind turbine technology.",
          type: 'analysis',
          metadata: {
            confidence: 88,
            reasoning: 'Strong skill overlap with additional offshore specialization needed'
          }
        },
        {
          agentId: 'career_advisor',
          thinking: 'Creating transition pathway recommendations...',
          content: "I recommend a 6-12 month transition plan: 1) Complete offshore wind fundamentals course, 2) Network at offshore wind conferences, 3) Consider contract roles for experience, 4) Target companies like Avangrid, Ørsted, or local engineering firms supporting offshore projects.",
          type: 'recommendation',
          metadata: {
            nextSteps: [
              'Enroll in offshore wind course',
              'Attend MA Offshore Wind Conference',
              'Update LinkedIn with wind energy focus',
              'Apply to 3-5 relevant positions'
            ]
          }
        },
        {
          agentId: 'job_matcher',
          thinking: 'Identifying relevant job opportunities...',
          content: "I found 23 relevant positions in Massachusetts! Top matches: Offshore Wind Project Engineer at Vineyard Wind, Marine Engineer at Mayflower Wind, and Mechanical Design Engineer at several consulting firms. Salary range: $75K-$120K depending on experience.",
          type: 'recommendation'
        }
      ],
      recent_graduate: [
        {
          agentId: 'coordinator',
          thinking: 'Processing new graduate job search request...',
          content: "Perfect timing for a clean energy career! Let me have my team analyze the best entry-level opportunities for environmental science graduates in Massachusetts.",
          type: 'message'
        },
        {
          agentId: 'market_analyst',
          thinking: 'Analyzing entry-level opportunities in MA clean energy...',
          content: "Great news! Massachusetts added 3,200 clean energy jobs last year. Entry-level opportunities are strongest in: solar installation/maintenance, environmental compliance, energy efficiency consulting, and renewable energy project support.",
          type: 'analysis'
        },
        {
          agentId: 'job_matcher',
          thinking: 'Finding entry-level positions for environmental science graduates...',
          content: "I found 45 entry-level positions! Top matches: Environmental Compliance Specialist ($45K-$55K), Solar Field Technician ($40K-$50K), Energy Efficiency Auditor ($42K-$52K), and Sustainability Coordinator ($48K-$58K).",
          type: 'recommendation'
        },
        {
          agentId: 'networking_guide',
          thinking: 'Identifying networking opportunities for new graduates...',
          content: "Build your network through: Mass Clean Energy Center young professionals group, local Sierra Club meetings, university alumni in clean energy, and LinkedIn groups like 'Massachusetts Clean Energy Jobs'. Consider informational interviews with recent graduates in the field.",
          type: 'recommendation'
        }
      ],
      skill_development: [
        {
          agentId: 'coordinator',
          thinking: 'Analyzing skill development needs for career advancement...',
          content: "Moving from solar installation to project management is a smart career progression! Let me have my team analyze the specific skills and pathway you'll need.",
          type: 'message'
        },
        {
          agentId: 'skills_assessor',
          thinking: 'Evaluating current skills and identifying development needs...',
          content: "Your installation experience gives you crucial technical foundation! To advance to project management, focus on: PMP certification, financial modeling, construction management, team leadership, and client communication skills.",
          type: 'analysis'
        },
        {
          agentId: 'career_advisor',
          thinking: 'Creating advancement pathway plan...',
          content: "Recommended progression: 1) Lead installer role (6-12 months), 2) Assistant project manager (12-18 months), 3) Project manager. Consider: part-time PMP prep course, volunteer to lead small projects, seek mentorship from current PMs.",
          type: 'recommendation'
        },
        {
          agentId: 'job_matcher',
          thinking: 'Identifying project management opportunities...',
          content: "I see strong demand for solar project managers in MA! Companies actively hiring: SunPower, Tesla Energy, Trinity Solar, and numerous local installers. Salary progression: Lead Installer ($55K) → Assistant PM ($65K) → Project Manager ($75K-$95K).",
          type: 'recommendation'
        }
      ],
      industry_exploration: [
        {
          agentId: 'coordinator',
          thinking: 'Preparing comprehensive industry overview...',
          content: "Clean energy offers diverse career paths! Let me have my team break down the different sectors and help you find your best fit based on your interests and skills.",
          type: 'message'
        },
        {
          agentId: 'market_analyst',
          thinking: 'Analyzing Massachusetts clean energy sectors...',
          content: "Massachusetts clean energy has 5 major sectors: Solar (largest, 15K+ jobs), Offshore Wind (fastest growing), Energy Efficiency (stable demand), Energy Storage (emerging), and Electric Transportation (expanding rapidly). Each offers different career paths and growth potential.",
          type: 'analysis'
        },
        {
          agentId: 'career_advisor',
          thinking: 'Matching personality and interests to sectors...',
          content: "To find your best fit, consider: Do you prefer hands-on work (solar/wind installation) or analytical work (efficiency consulting)? Startup environment (energy storage) or established industry (solar)? Local projects (residential solar) or large-scale (offshore wind)?",
          type: 'analysis'
        },
        {
          agentId: 'networking_guide',
          thinking: 'Recommending exploration activities...',
          content: "Explore through: Attend sector-specific meetups, schedule informational interviews in each area, volunteer with Clean Energy Corps, visit job sites (many companies offer tours), and join professional associations like NESEA or Mass Solar Energy Industries Association.",
          type: 'recommendation'
        }
      ]
    };

    return flows[scenario.id] || [];
  };

  const resetDemo = () => {
    setSelectedScenario(null);
    setMessages([]);
    setIsProcessing(false);
    setCurrentStep(0);
    setAgents(aiAgents);
  };

  const getAgentById = (id: string) => agents.find(agent => agent.id === id);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-spring-green/10 rounded-full">
            <span className="text-2xl">🤖</span>
          </div>
          <h2 className="text-3xl font-bold text-midnight-forest">
            AI Agent Teams at Work
          </h2>
        </div>
        <p className="text-lg text-moss-green max-w-3xl mx-auto">
          See how our specialized AI agents collaborate to provide comprehensive 
          career guidance. Each agent brings unique expertise to help you succeed 
          in Massachusetts' clean energy sector.
        </p>
      </div>

      {!selectedScenario ? (
        <div className="space-y-8">
          {/* Agent Team Overview */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-midnight-forest mb-6 text-center">
              Meet Your AI Agent Team
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => (
                <div key={agent.id} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-xl",
                      agent.color
                    )}>
                      {agent.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-midnight-forest">{agent.name}</h4>
                      <p className="text-sm text-moss-green">{agent.role}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{agent.description}</p>
                  <div className="space-y-1">
                    {agent.capabilities.slice(0, 2).map((capability, index) => (
                      <div key={index} className="text-xs text-gray-500 flex items-center gap-2">
                        <span className="w-1 h-1 bg-spring-green rounded-full"></span>
                        {capability}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Scenario Selection */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-center text-midnight-forest">
              Choose a Career Scenario to See Agents in Action
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => (
                <Card key={scenario.id} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{scenario.icon}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-midnight-forest mb-2">
                          {scenario.title}
                        </h4>
                        <p className="text-sm text-moss-green mb-3">
                          {scenario.description}
                        </p>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm text-gray-700 italic">
                            "{scenario.userMessage}"
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Agents involved:</p>
                      <div className="flex flex-wrap gap-2">
                        {scenario.expectedAgents.map((agentId) => {
                          const agent = getAgentById(agentId);
                          return agent ? (
                            <div key={agentId} className="flex items-center gap-1 text-xs bg-gray-100 rounded-full px-2 py-1">
                              <span>{agent.avatar}</span>
                              <span>{agent.name}</span>
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <Button
                      onClick={() => {
                        setSelectedScenario(scenario);
                        simulateAgentConversation(scenario);
                      }}
                      className="w-full group-hover:bg-spring-green group-hover:text-midnight-forest transition-colors"
                      variant="outline"
                    >
                      See Agents in Action
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Scenario Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">{selectedScenario.icon}</span>
              <div>
                <h3 className="text-xl font-semibold text-midnight-forest">
                  {selectedScenario.title}
                </h3>
                <p className="text-sm text-moss-green">{selectedScenario.description}</p>
              </div>
            </div>
            <Button
              onClick={resetDemo}
              variant="ghost"
              size="sm"
              className="text-moss-green hover:text-midnight-forest"
            >
              Try Different Scenario
            </Button>
          </div>

          {/* User Question */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                You
              </div>
              <p className="text-blue-800 italic">"{selectedScenario.userMessage}"</p>
            </div>
          </Card>

          {/* Agent Status Panel */}
          <Card className="p-6">
            <h4 className="font-semibold text-midnight-forest mb-4">Agent Team Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    "text-center p-3 rounded-lg border transition-all duration-300",
                    agent.active 
                      ? "border-spring-green bg-spring-green/10 scale-105" 
                      : "border-gray-200 bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 mx-auto rounded-full bg-gradient-to-r flex items-center justify-center text-white text-lg mb-2 transition-all",
                    agent.color,
                    agent.active && "ring-2 ring-spring-green ring-offset-2"
                  )}>
                    {agent.active && isProcessing ? (
                      <Spinner size="sm" className="text-white" />
                    ) : (
                      agent.avatar
                    )}
                  </div>
                  <div className="text-xs font-medium text-midnight-forest">{agent.name}</div>
                  <div className="text-xs text-gray-500">{agent.role}</div>
                  {agent.thinking && (
                    <div className="text-xs text-spring-green mt-1 animate-pulse">
                      Thinking...
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Conversation Flow */}
          <Card className="p-6">
            <h4 className="font-semibold text-midnight-forest mb-4">Agent Collaboration</h4>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {messages.map((message) => {
                const agent = getAgentById(message.agentId);
                if (!agent) return null;

                return (
                  <div key={message.id} className="flex items-start gap-3">
                    <div className={cn(
                      "w-8 h-8 rounded-full bg-gradient-to-r flex items-center justify-center text-white text-sm flex-shrink-0",
                      agent.color
                    )}>
                      {agent.avatar}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-midnight-forest">{agent.name}</span>
                        <span className="text-xs text-gray-500">({agent.role})</span>
                        {message.type !== 'message' && (
                          <span className={cn(
                            "text-xs px-2 py-1 rounded-full",
                            message.type === 'analysis' && "bg-blue-100 text-blue-800",
                            message.type === 'recommendation' && "bg-green-100 text-green-800",
                            message.type === 'handoff' && "bg-yellow-100 text-yellow-800"
                          )}>
                            {message.type}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700">{message.content}</p>
                      {message.metadata?.confidence && (
                        <div className="text-xs text-gray-500">
                          Confidence: {message.metadata.confidence}%
                        </div>
                      )}
                      {message.metadata?.nextSteps && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-gray-700 mb-1">Recommended next steps:</p>
                          <ul className="text-xs text-gray-600 space-y-1">
                            {message.metadata.nextSteps.map((step, index) => (
                              <li key={index} className="flex items-center gap-2">
                                <span className="w-1 h-1 bg-spring-green rounded-full"></span>
                                {step}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {isProcessing && messages.length === 0 && (
                <div className="text-center py-8">
                  <Spinner size="lg" className="mx-auto mb-4" />
                  <p className="text-gray-500">Agent team is analyzing your request...</p>
                </div>
              )}
            </div>
          </Card>

          {/* CTA */}
          {!isProcessing && messages.length > 0 && (
            <Card className="p-6 bg-gradient-to-r from-spring-green/10 to-moss-green/10 border-spring-green/20">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-midnight-forest">
                  Ready for Personalized AI Career Guidance?
                </h3>
                <p className="text-moss-green">
                  Get your own AI agent team to help navigate your Massachusetts 
                  clean energy career journey with personalized insights and recommendations.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Button className="bg-spring-green text-midnight-forest hover:bg-spring-green/90">
                    Start My Career Journey
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetDemo}
                    className="border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
                  >
                    Try Another Scenario
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AgentTeamsShowcase; 
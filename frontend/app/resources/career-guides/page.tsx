'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface KnowledgeResource {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  categories: string[]
  topics: string[]
  climate_sectors: string[]
  career_stages: string[]
  skill_categories: string[]
  source_url?: string
  created_at: string
  updated_at: string
}

export default function CareerGuides() {
  const [guides, setGuides] = useState<KnowledgeResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Static test data for career guides
  const testGuides: KnowledgeResource[] = [
    {
      id: '1',
      title: 'Clean Energy Career Transition Guide',
      description: 'Comprehensive guide for professionals transitioning to clean energy careers from other industries',
      content: 'Learn how to transition your skills to clean energy.',
      tags: ['career transition', 'clean energy', 'professional development'],
      categories: ['career guides'],
      topics: [],
      climate_sectors: ['Clean Energy'],
      career_stages: ['Career Transition'],
      skill_categories: [],
      source_url: 'https://www.masscec.com/career-guides/transition-guide',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      title: 'Solar Installation Career Path',
      description: 'Step-by-step guide to building a career in solar installation and maintenance',
      content: 'Navigate your solar installation career path.',
      tags: ['solar installation', 'career path', 'technical skills'],
      categories: ['career guides'],
      topics: [],
      climate_sectors: ['Solar Energy'],
      career_stages: ['Entry Level', 'Mid Career'],
      skill_categories: [],
      source_url: 'https://www.masscec.com/career-guides/solar-career-path',
      created_at: '2024-01-20',
      updated_at: '2024-01-20'
    },
    {
      id: '3',
      title: 'Energy Efficiency Professional Development',
      description: 'Guide to advancing your career in energy efficiency and building performance',
      content: 'Advance your energy efficiency career.',
      tags: ['energy efficiency', 'professional development', 'building performance'],
      categories: ['career guides'],
      topics: [],
      climate_sectors: ['Energy Efficiency'],
      career_stages: ['Mid Career', 'Senior Level'],
      skill_categories: [],
      source_url: 'https://www.masscec.com/career-guides/energy-efficiency-guide',
      created_at: '2024-01-25',
      updated_at: '2024-01-25'
    },
    {
      id: '4',
      title: 'Veterans Clean Energy Career Guide',
      description: 'Specialized guide for veterans transitioning to clean energy careers',
      content: 'Leverage your military experience in clean energy.',
      tags: ['veterans', 'career transition', 'military skills'],
      categories: ['career guides'],
      topics: [],
      climate_sectors: ['Clean Energy'],
      career_stages: ['Career Transition'],
      skill_categories: [],
      source_url: 'https://www.masscec.com/career-guides/veterans-guide',
      created_at: '2024-01-30',
      updated_at: '2024-01-30'
    },
    {
      id: '5',
      title: 'Wind Energy Technician Career Guide',
      description: 'Complete guide to becoming a wind energy technician in Massachusetts',
      content: 'Start your wind energy technician career.',
      tags: ['wind energy', 'technician', 'technical skills'],
      categories: ['career guides'],
      topics: [],
      climate_sectors: ['Wind Energy'],
      career_stages: ['Entry Level'],
      skill_categories: [],
      source_url: 'https://www.masscec.com/career-guides/wind-technician-guide',
      created_at: '2024-02-01',
      updated_at: '2024-02-01'
    },
    {
      id: '6',
      title: 'Clean Energy Leadership Development',
      description: 'Guide for experienced professionals looking to advance to leadership roles',
      content: 'Develop your clean energy leadership skills.',
      tags: ['leadership', 'management', 'senior level'],
      categories: ['career guides'],
      topics: [],
      climate_sectors: ['Clean Energy'],
      career_stages: ['Senior Level', 'Leadership'],
      skill_categories: [],
      source_url: 'https://www.masscec.com/career-guides/leadership-guide',
      created_at: '2024-02-05',
      updated_at: '2024-02-05'
    }
  ]

  useEffect(() => {
    // For now, use static data to test the UI
    console.log('🔍 Loading static test career guides...')
    setTimeout(() => {
      setGuides(testGuides)
      setLoading(false)
    }, 1000)
  }, [])

  // Group guides by career stage
  const guidesByStage = guides.reduce((acc, guide) => {
    const stage = guide.career_stages?.[0] || 'General'
    if (!acc[stage]) {
      acc[stage] = []
    }
    acc[stage].push(guide)
    return acc
  }, {} as { [key: string]: KnowledgeResource[] })

  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">Massachusetts Clean Energy Career Guides</h1>
          <p className="text-moss-green">
            Comprehensive career development resources and professional guidance for Massachusetts clean energy professionals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center mb-8">
            <div className="loading loading-spinner loading-lg text-moss-green"></div>
            <p className="text-midnight-forest mt-4">Loading career guides...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 mb-8">
            Failed to load career guides. Please try again later.
            <br />
            <small className="text-sm text-gray-500">Error: {error}</small>
          </div>
        )}
        
        {!loading && !error && guides.length === 0 && (
          <div className="text-center text-midnight-forest mb-8">No career guides found.</div>
        )}

        {!loading && !error && guides.length > 0 && (
          <>
            {/* Featured Guides */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-midnight-forest mb-6">Featured Massachusetts Career Guides</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.slice(0, 6).map((guide) => (
                  <div key={guide.id} className="card bg-white shadow-xl border border-spring-green/20">
                    <div className="card-body">
                      <div className="badge badge-success mb-2">
                        {guide.categories?.[0] || 'Guide'}
                      </div>
                      <h3 className="card-title text-lg text-midnight-forest">{guide.title}</h3>
                      <p className="text-sm text-moss-green mb-4">
                        {guide.description?.substring(0, 120)}...
                      </p>
                      <div className="space-y-2 mb-4">
                        {guide.climate_sectors && guide.climate_sectors.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {guide.climate_sectors.slice(0, 3).map((sector, index) => (
                              <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                {sector}
                              </span>
                            ))}
                          </div>
                        )}
                        {guide.career_stages && guide.career_stages.length > 0 && (
                          <div className="text-xs text-midnight-forest">
                            Stage: {guide.career_stages.join(', ')}
                          </div>
                        )}
                        {guide.tags && guide.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {guide.tags.slice(0, 3).map((tag, index) => (
                              <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-moss-green">
                          {new Date(guide.created_at).toLocaleDateString()}
                        </span>
                        {guide.source_url && (
                          <Link href={guide.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest" target="_blank" rel="noopener noreferrer">
                            View Guide
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Guides by Career Stage */}
            {Object.keys(guidesByStage).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-midnight-forest mb-6">Career Guides by Stage</h2>
                <div className="space-y-8">
                  {Object.entries(guidesByStage).map(([stage, stageGuides]) => (
                    <div key={stage} className="card bg-white shadow-xl border border-spring-green/20">
                      <div className="card-body">
                        <h3 className="card-title text-midnight-forest mb-4">{stage} Career Guides</h3>
                        <div className="space-y-4">
                          {stageGuides.map((guide) => (
                            <div key={guide.id} className="p-4 bg-spring-green/10 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-bold text-midnight-forest">{guide.title}</h4>
                                  <p className="text-sm text-moss-green mb-2">
                                    {guide.description?.substring(0, 100)}...
                                  </p>
                                  {guide.tags && guide.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {guide.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-xs text-moss-green">
                                    {new Date(guide.created_at).toLocaleDateString()}
                                  </div>
                                  {guide.source_url && (
                                    <Link href={guide.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest mt-2" target="_blank" rel="noopener noreferrer">
                                      View
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Development Resources */}
            <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
              <div className="card-body">
                <h2 className="card-title text-midnight-forest mb-6">Professional Development Resources</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Skills Development</h3>
                    <p className="text-sm text-moss-green">Technical and soft skills training</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Certification Prep</h3>
                    <p className="text-sm text-moss-green">Industry certification guidance</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Networking</h3>
                    <p className="text-sm text-moss-green">Professional networking strategies</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Industry Partners */}
            <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
              <div className="card-body">
                <h2 className="card-title text-midnight-forest mb-6">Industry Partners</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">MassCEC</h3>
                    <p className="text-sm text-moss-green">Career development and training</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Industry Associations</h3>
                    <p className="text-sm text-moss-green">Professional development resources</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Educational Institutions</h3>
                    <p className="text-sm text-moss-green">Academic and training programs</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <Link href="/resources" className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white">
            Back to Resources
          </Link>
        </div>
      </div>
    </div>
  )
} 
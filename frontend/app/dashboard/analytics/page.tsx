'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  totalJobs: number
  totalPrograms: number
  totalResources: number
  totalUsers: number
  topSkills: { skill: string; count: number }[]
  regionalBreakdown: { region: string; jobs: number }[]
  sectorDistribution: { sector: string; count: number }[]
  programTypes: { type: string; count: number }[]
}

export default function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalJobs: 0,
    totalPrograms: 0,
    totalResources: 0,
    totalUsers: 0,
    topSkills: [],
    regionalBreakdown: [],
    sectorDistribution: [],
    programTypes: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true)
      setError(null)
      
      try {
        // Fetch job listings
        const { data: jobs, error: jobsError } = await (supabase as any)
          .from('job_listings')
          .select('*')
          .eq('is_active', true)

        if (jobsError) {
          setError('Failed to load job analytics.')
          return
        }

        // Fetch education programs
        const { data: programs, error: programsError } = await (supabase as any)
          .from('education_programs')
          .select('*')
          .eq('is_active', true)

        if (programsError) {
          setError('Failed to load program analytics.')
          return
        }

        // Fetch knowledge resources
        const { data: resources, error: resourcesError } = await (supabase as any)
          .from('knowledge_resources')
          .select('*')

        if (resourcesError) {
          setError('Failed to load resource analytics.')
          return
        }

        // Fetch user profiles
        const { data: users, error: usersError } = await (supabase as any)
          .from('user_profiles')
          .select('*')

        if (usersError) {
          setError('Failed to load user analytics.')
          return
        }

        const jobData = (jobs as any[]) || []
        const programData = (programs as any[]) || []
        const resourceData = (resources as any[]) || []
        const userData = (users as any[]) || []

        // Calculate top skills from job listings
        const skillCounts: { [key: string]: number } = {}
        jobData.forEach(job => {
          job.skills_required?.forEach((skill: string) => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
          })
        })
        const topSkills = Object.entries(skillCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([skill, count]) => ({ skill, count }))

        // Calculate regional breakdown
        const regionalCounts: { [key: string]: number } = {}
        jobData.forEach(job => {
          const region = job.location?.split(',')[0]?.trim() || 'Other'
          regionalCounts[region] = (regionalCounts[region] || 0) + 1
        })
        const regionalBreakdown = Object.entries(regionalCounts)
          .map(([region, jobs]) => ({ region, jobs }))

        // Calculate sector distribution from job listings
        const sectorCounts: { [key: string]: number } = {}
        jobData.forEach(job => {
          job.climate_focus?.forEach((sector: string) => {
            sectorCounts[sector] = (sectorCounts[sector] || 0) + 1
          })
        })
        const sectorDistribution = Object.entries(sectorCounts)
          .map(([sector, count]) => ({ sector, count }))

        // Calculate program types
        const programTypeCounts: { [key: string]: number } = {}
        programData.forEach(program => {
          const type = program.program_type || 'Other'
          programTypeCounts[type] = (programTypeCounts[type] || 0) + 1
        })
        const programTypes = Object.entries(programTypeCounts)
          .map(([type, count]) => ({ type, count }))

        setAnalyticsData({
          totalJobs: jobData.length,
          totalPrograms: programData.length,
          totalResources: resourceData.length,
          totalUsers: userData.length,
          topSkills,
          regionalBreakdown,
          sectorDistribution,
          programTypes
        })

      } catch (err) {
        setError('Failed to load analytics data.')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">Analytics Dashboard</h1>
          <p className="text-moss-green">
            Real-time insights into Massachusetts clean energy workforce development and opportunities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && <div className="text-center text-moss-green">Loading analytics...</div>}
        {error && <div className="text-center text-red-600">{error}</div>}
        
        {!loading && !error && (
          <>
            {/* Key Metrics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Active Job Listings</div>
                <div className="stat-value text-midnight-forest">{analyticsData.totalJobs}</div>
                <div className="stat-desc text-spring-green">Available positions</div>
              </div>
              
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Training Programs</div>
                <div className="stat-value text-midnight-forest">{analyticsData.totalPrograms}</div>
                <div className="stat-desc text-spring-green">Active programs</div>
              </div>
              
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Knowledge Resources</div>
                <div className="stat-value text-midnight-forest">{analyticsData.totalResources}</div>
                <div className="stat-desc text-spring-green">Available resources</div>
              </div>
              
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Registered Users</div>
                <div className="stat-value text-midnight-forest">{analyticsData.totalUsers}</div>
                <div className="stat-desc text-spring-green">Active users</div>
              </div>
            </div>

            {/* Top Skills Analysis */}
            {analyticsData.topSkills.length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Top Skills in Demand</h2>
                  <div className="space-y-4">
                    {analyticsData.topSkills.map((skill, index) => (
                      <div key={skill.skill} className="flex justify-between items-center p-4 bg-spring-green/10 rounded-lg">
                        <div className="flex items-center">
                          <span className="text-lg font-bold text-midnight-forest mr-4">#{index + 1}</span>
                          <div>
                            <h3 className="font-bold text-midnight-forest">{skill.skill}</h3>
                            <p className="text-sm text-moss-green">Most requested skill</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-midnight-forest">{skill.count}</div>
                          <div className="text-sm text-moss-green">Job listings</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Regional Job Distribution */}
            {analyticsData.regionalBreakdown.length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Regional Job Distribution</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analyticsData.regionalBreakdown.map((region) => (
                      <div key={region.region} className="text-center p-4 bg-spring-green/10 rounded-lg">
                        <h3 className="font-bold text-midnight-forest mb-2">{region.region}</h3>
                        <div className="text-2xl font-bold text-midnight-forest">{region.jobs}</div>
                        <div className="text-sm text-moss-green">Jobs Available</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Sector Distribution */}
            {analyticsData.sectorDistribution.length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Climate Sector Distribution</h2>
                  <div className="space-y-4">
                    {analyticsData.sectorDistribution.map((sector) => (
                      <div key={sector.sector} className="flex justify-between items-center p-4 bg-spring-green/10 rounded-lg">
                        <div>
                          <h3 className="font-bold text-midnight-forest">{sector.sector}</h3>
                          <p className="text-sm text-moss-green">Clean energy sector</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-midnight-forest">{sector.count}</div>
                          <div className="text-sm text-moss-green">Job listings</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Program Types */}
            {analyticsData.programTypes.length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Training Program Types</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {analyticsData.programTypes.map((program) => (
                      <div key={program.type} className="text-center p-4 bg-spring-green/10 rounded-lg">
                        <h3 className="font-bold text-midnight-forest mb-2">{program.type}</h3>
                        <div className="text-2xl font-bold text-midnight-forest">{program.count}</div>
                        <div className="text-sm text-moss-green">Programs Available</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Massachusetts Insights */}
            <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
              <div className="card-body">
                <h2 className="card-title text-midnight-forest mb-6">Massachusetts Clean Energy Insights</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-moss-green mb-3">Market Overview</h3>
                    <ul className="space-y-2 text-sm text-midnight-forest">
                      <li>• {analyticsData.totalJobs} active job opportunities</li>
                      <li>• {analyticsData.totalPrograms} training programs available</li>
                      <li>• {analyticsData.totalResources} knowledge resources</li>
                      <li>• {analyticsData.totalUsers} registered users</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-semibold text-moss-green mb-3">Growth Opportunities</h3>
                    <ul className="space-y-2 text-sm text-midnight-forest">
                      <li>• Solar installation and maintenance</li>
                      <li>• Energy storage and battery technology</li>
                      <li>• Grid modernization and smart technology</li>
                      <li>• Offshore wind development</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="text-center">
          <Link href="/dashboard" className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
} 
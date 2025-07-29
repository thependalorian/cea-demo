'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface JobListing {
  id: string
  title: string
  description: string
  requirements: string
  responsibilities: string
  location: string
  employment_type: string
  experience_level: string
  salary_range: string
  climate_focus: string[]
  skills_required: string[]
  benefits: string[]
  application_url: string
  application_email: string
  is_active: boolean
  created_at: string
  updated_at: string
}

interface JobStats {
  totalJobs: number
  averageSalary: string
  topSkill: string
  growthRate: number
  regionalBreakdown: { [key: string]: { jobs: number; avgSalary: string } }
  topCategories: { category: string; jobs: number; salaryRange: string }[]
}

export default function JobData() {
  const [jobListings, setJobListings] = useState<JobListing[]>([])
  const [jobStats, setJobStats] = useState<JobStats>({
    totalJobs: 0,
    averageSalary: '$0',
    topSkill: 'N/A',
    growthRate: 0,
    regionalBreakdown: {},
    topCategories: []
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchJobData() {
      setLoading(true)
      setError(null)
      
      try {
        console.log('🔍 Starting to fetch job data...')
        
        // Fetch active job listings (excluding sample jobs)
        const { data: jobs, error: jobsError } = await (supabase as any)
          .from('job_listings')
          .select('*')
          .eq('is_active', true)
          .neq('title', 'Sample Clean Energy Job')
          .order('created_at', { ascending: false })

        console.log('🔍 Job data query result:', { 
          dataCount: jobs?.length || 0, 
          error: jobsError,
          sampleData: jobs?.slice(0, 2) 
        })

        if (jobsError) {
          console.error('❌ Job data query failed:', jobsError)
          setError('Failed to load job data.')
          return
        }

        const jobData = (jobs as JobListing[]) || []
        console.log('✅ Successfully loaded job data:', jobData.length, 'jobs')
        setJobListings(jobData)

        // Calculate statistics
        const totalJobs = jobData.length
        const salaries = jobData
          .map(job => {
            const salaryMatch = job.salary_range?.match(/\$(\d+)K?/g)
            if (salaryMatch) {
              return salaryMatch.map(s => parseInt(s.replace('$', '').replace('K', '000')))
            }
            return []
          })
          .flat()
          .filter(s => s > 0)

        const averageSalary = salaries.length > 0 
          ? `$${Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length / 1000)}K`
          : '$0'

        // Count skills
        const skillCounts: { [key: string]: number } = {}
        jobData.forEach(job => {
          job.skills_required?.forEach(skill => {
            skillCounts[skill] = (skillCounts[skill] || 0) + 1
          })
        })
        const topSkill = Object.entries(skillCounts)
          .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'

        // Regional breakdown
        const regionalBreakdown: { [key: string]: { jobs: number; avgSalary: string } } = {}
        jobData.forEach(job => {
          const region = job.location?.split(',')[0]?.trim() || 'Other'
          if (!regionalBreakdown[region]) {
            regionalBreakdown[region] = { jobs: 0, avgSalary: '$0' }
          }
          regionalBreakdown[region].jobs++
        })

        // Top categories - use actual job titles instead of just first word
        const categoryCounts: { [key: string]: number } = {}
        jobData.forEach(job => {
          // Extract meaningful category from title
          const title = job.title?.toLowerCase() || ''
          let category = 'Other'
          
          if (title.includes('solar')) category = 'Solar'
          else if (title.includes('clean energy')) category = 'Clean Energy'
          else if (title.includes('energy')) category = 'Energy'
          else if (title.includes('data')) category = 'Data Analytics'
          else if (title.includes('manager')) category = 'Management'
          else if (title.includes('engineer')) category = 'Engineering'
          else if (title.includes('technician')) category = 'Technical'
          else if (title.includes('operator')) category = 'Operations'
          else {
            // Use first meaningful word from title
            const words = title.split(' ').filter(word => word.length > 2)
            category = words[0]?.charAt(0).toUpperCase() + words[0]?.slice(1) || 'Other'
          }
          
          categoryCounts[category] = (categoryCounts[category] || 0) + 1
        })
        
        const topCategories = Object.entries(categoryCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 5)
          .map(([category, jobs]) => ({
            category,
            jobs,
            salaryRange: '$45K - $85K' // Placeholder
          }))

        console.log('📊 Calculated job stats:', {
          totalJobs,
          averageSalary,
          topSkill,
          regionalBreakdown: Object.keys(regionalBreakdown),
          topCategories
        })

        setJobStats({
          totalJobs,
          averageSalary,
          topSkill,
          growthRate: 23, // Placeholder
          regionalBreakdown,
          topCategories
        })

      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError('Failed to load job market data.')
      } finally {
        setLoading(false)
      }
    }

    fetchJobData()
  }, [])

  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">Massachusetts Clean Energy Job Market Data</h1>
          <p className="text-moss-green">
            Real-time insights into Massachusetts clean energy job market trends and opportunities
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center mb-8">
            <div className="loading loading-spinner loading-lg text-moss-green"></div>
            <p className="text-midnight-forest mt-4">Loading job market data...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 mb-8">
            Failed to load job market data. Please try again later.
            <br />
            <small className="text-sm text-gray-500">Error: {error}</small>
          </div>
        )}
        
        {!loading && !error && (
          <>
            {/* Key Statistics */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Open Positions</div>
                <div className="stat-value text-midnight-forest">{jobStats.totalJobs}</div>
                <div className="stat-desc text-spring-green">Active listings</div>
              </div>
              
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Average Salary</div>
                <div className="stat-value text-midnight-forest">{jobStats.averageSalary}</div>
                <div className="stat-desc text-spring-green">Based on listed ranges</div>
              </div>
              
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Top Skill</div>
                <div className="stat-value text-midnight-forest text-lg">{jobStats.topSkill}</div>
                <div className="stat-desc text-spring-green">Most in demand</div>
              </div>
              
              <div className="stat bg-white shadow-lg rounded-lg border border-spring-green/20">
                <div className="stat-title text-moss-green">Growth Rate</div>
                <div className="stat-value text-midnight-forest">{jobStats.growthRate}%</div>
                <div className="stat-desc text-spring-green">Year-over-year job growth</div>
              </div>
            </div>

            {/* Regional Breakdown */}
            {Object.keys(jobStats.regionalBreakdown).length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Massachusetts Regional Job Distribution</h2>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(jobStats.regionalBreakdown).map(([region, data]) => (
                      <div key={region} className="text-center p-4 bg-spring-green/10 rounded-lg">
                        <h3 className="font-bold text-midnight-forest mb-2">{region}</h3>
                        <div className="text-2xl font-bold text-midnight-forest">{data.jobs}</div>
                        <div className="text-sm text-moss-green">Jobs Available</div>
                        <div className="text-xs text-midnight-forest mt-1">Avg: {data.avgSalary}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Top Job Categories */}
            {jobStats.topCategories.length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Top Job Categories in Massachusetts</h2>
                  <div className="space-y-4">
                    {jobStats.topCategories.map((category) => (
                      <div key={category.category} className="flex justify-between items-center p-4 bg-spring-green/10 rounded-lg">
                        <div>
                          <h3 className="font-bold text-midnight-forest">{category.category}</h3>
                          <p className="text-sm text-moss-green">Various roles and positions</p>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-midnight-forest">{category.jobs}</div>
                          <div className="text-sm text-moss-green">Open Positions</div>
                          <div className="text-xs text-spring-green">{category.salaryRange}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Job Listings */}
            {jobListings.length > 0 && (
              <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
                <div className="card-body">
                  <h2 className="card-title text-midnight-forest mb-6">Recent Job Listings</h2>
                  <div className="space-y-4">
                    {jobListings.slice(0, 5).map((job) => (
                      <div key={job.id} className="p-4 bg-spring-green/10 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-bold text-midnight-forest text-lg">{job.title}</h3>
                            <p className="text-sm text-moss-green mb-2">{job.location}</p>
                            <p className="text-sm text-midnight-forest mb-2">{job.description?.substring(0, 150)}...</p>
                            <div className="flex flex-wrap gap-2">
                              {job.skills_required?.slice(0, 3).map((skill, index) => (
                                <span key={index} className="badge badge-outline badge-sm border-moss-green text-moss-green">
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-4">
                            <div className="text-sm font-bold text-midnight-forest">{job.salary_range}</div>
                            <div className="text-xs text-moss-green">{job.employment_type}</div>
                            {job.application_url && (
                              <Link href={job.application_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest mt-2" target="_blank" rel="noopener noreferrer">
                                Apply
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
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
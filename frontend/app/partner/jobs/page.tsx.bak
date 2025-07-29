"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

interface JobListing {
  id: string
  title: string
  description: string
  location: string
  employment_type: string
  experience_level: string
  salary_range: string
  skills_required: string[]
  climate_focus: string[]
  is_active: boolean
  created_at: string
  expires_at: string
  application_count: number
  view_count: number
  qualified_candidates: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const JobListingForm = dynamic(() => import('@/components/partner/JobListingForm'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-96 text-base text-gray-400">Loading job listing form...</div>
})
const JobListingCard = dynamic(() => import('@/components/partner/JobListingCard'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-48 text-base text-gray-400">Loading job listing card...</div>
})

export default function PartnerJobs() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [filteredJobs, setFilteredJobs] = useState<JobListing[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, active, draft, expired
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchJobs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [jobs, filter, searchQuery])

  const fetchJobs = async () => {
    try {
      const response = await fetch('/api/v1/partner/jobs')
      if (response.ok) {
        const data = await response.json()
        setJobs(data)
      }
    } catch (error) {
      console.error('Failed to fetch jobs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...jobs]

    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(job => {
        switch (filter) {
          case 'active':
            return job.is_active && new Date(job.expires_at) > new Date()
          case 'draft':
            return !job.is_active
          case 'expired':
            return new Date(job.expires_at) <= new Date()
          default:
            return true
        }
      })
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredJobs(filtered)
  }

  const handleJobAction = async (jobId: string, action: 'activate' | 'deactivate' | 'delete') => {
    try {
      const response = await fetch(`/api/v1/partner/jobs/${jobId}/${action}`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchJobs() // Refresh the list
      }
    } catch (error) {
      console.error(`Failed to ${action} job:`, error)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      {/* Header */}
      <div className="bg-base-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Job Listings</h1>
              <p className="text-base-content/70">
                {filteredJobs.length} jobs • {jobs.filter(j => j.is_active).length} active
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/partner/jobs/new" className="btn btn-primary">
                Post New Job
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </Link>
              <Link href="/partner/analytics" className="btn btn-outline">
                View Analytics
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search job listings..."
              className="input input-bordered w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              className="select select-bordered"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Jobs</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Jobs</div>
            <div className="stat-value text-primary">{jobs.length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Active Jobs</div>
            <div className="stat-value text-success">{jobs.filter(j => j.is_active).length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Applications</div>
            <div className="stat-value text-secondary">
              {jobs.reduce((sum, job) => sum + job.application_count, 0)}
            </div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Views</div>
            <div className="stat-value text-accent">
              {jobs.reduce((sum, job) => sum + job.view_count, 0)}
            </div>
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <h3 className="text-lg font-bold mb-2">No jobs found</h3>
            <p className="text-base-content/70 mb-4">
              {searchQuery || filter !== 'all' 
                ? 'Try adjusting your search or filters.'
                : 'Start by posting your first job listing.'
              }
            </p>
            {!searchQuery && filter === 'all' && (
              <Link href="/partner/jobs/new" className="btn btn-primary">
                Post Your First Job
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <JobListingCard
                key={job.id}
                job={job}
                onAction={handleJobAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 
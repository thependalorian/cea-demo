'use client'

import React, { useState, useEffect } from 'react'
import CandidateCard from '@/components/partner/CandidateCard'

interface Candidate {
  id: string
  full_name: string
  email: string
  current_title: string
  location: string
  experience_level: string
  skills: string[]
  climate_interests: string[]
  match_score: number
  resume_url?: string
  applied_jobs: string[]
  status: 'new' | 'reviewed' | 'contacted' | 'interviewed' | 'hired' | 'rejected'
  last_activity: string
  profile_completed: boolean
}

export default function PartnerCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: 'all',
    experience_level: '',
    climate_focus: '',
    match_score_min: 0,
    location: ''
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('match_score')

  useEffect(() => {
    fetchCandidates()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [candidates, filters, searchQuery, sortBy])

  const fetchCandidates = async () => {
    try {
      const response = await fetch('/api/v1/partner/candidates')
      if (response.ok) {
        const data = await response.json()
        setCandidates(data)
      }
    } catch (error) {
      console.error('Failed to fetch candidates:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...candidates]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(candidate =>
        candidate.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.current_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(candidate => candidate.status === filters.status)
    }

    // Experience level filter
    if (filters.experience_level) {
      filtered = filtered.filter(candidate => candidate.experience_level === filters.experience_level)
    }

    // Climate focus filter
    if (filters.climate_focus) {
      filtered = filtered.filter(candidate =>
        candidate.climate_interests.includes(filters.climate_focus)
      )
    }

    // Match score filter
    if (filters.match_score_min > 0) {
      filtered = filtered.filter(candidate => candidate.match_score >= filters.match_score_min)
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(candidate =>
        candidate.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Sort candidates
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'match_score':
          return b.match_score - a.match_score
        case 'name':
          return a.full_name.localeCompare(b.full_name)
        case 'experience':
          const experienceOrder = ['Entry Level', 'Mid Level', 'Senior Level', 'Executive']
          return experienceOrder.indexOf(b.experience_level) - experienceOrder.indexOf(a.experience_level)
        case 'activity':
          return new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime()
        default:
          return 0
      }
    })

    setFilteredCandidates(filtered)
  }

  const handleCandidateAction = async (candidateId: string, action: string, jobId?: string) => {
    try {
      const response = await fetch(`/api/v1/partner/candidates/${candidateId}/action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, job_id: jobId }),
      })

      if (response.ok) {
        fetchCandidates() // Refresh the list
      }
    } catch (error) {
      console.error(`Failed to ${action} candidate:`, error)
    }
  }

  const handleFilterChange = (key: string, value: unknown) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
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
              <h1 className="text-3xl font-bold">Candidates</h1>
              <p className="text-base-content/70">
                {filteredCandidates.length} candidates • {candidates.filter(c => c.status === 'new').length} new
              </p>
            </div>
            <div className="flex gap-3">
              <button className="btn btn-outline">
                Export List
              </button>
              <button className="btn btn-primary">
                Bulk Actions
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h3 className="card-title mb-4">Filters</h3>
                
                <div className="space-y-4">
                  {/* Search */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Search</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Name, title, skills..."
                      className="input input-bordered input-sm"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Status</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                      <option value="all">All Statuses</option>
                      <option value="new">New</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="contacted">Contacted</option>
                      <option value="interviewed">Interviewed</option>
                      <option value="hired">Hired</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  {/* Experience Level */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Experience Level</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={filters.experience_level}
                      onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                    >
                      <option value="">All Levels</option>
                      <option value="Entry Level">Entry Level</option>
                      <option value="Mid Level">Mid Level</option>
                      <option value="Senior Level">Senior Level</option>
                      <option value="Executive">Executive</option>
                    </select>
                  </div>

                  {/* Climate Focus */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Climate Focus</span>
                    </label>
                    <select
                      className="select select-bordered select-sm"
                      value={filters.climate_focus}
                      onChange={(e) => handleFilterChange('climate_focus', e.target.value)}
                    >
                      <option value="">All Areas</option>
                      <option value="Solar Energy">Solar Energy</option>
                      <option value="Wind Energy">Wind Energy</option>
                      <option value="Energy Storage">Energy Storage</option>
                      <option value="Energy Efficiency">Energy Efficiency</option>
                      <option value="Electric Vehicles">Electric Vehicles</option>
                      <option value="Green Building">Green Building</option>
                    </select>
                  </div>

                  {/* Match Score */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Minimum Match Score</span>
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      className="range range-primary"
                      value={filters.match_score_min}
                      onChange={(e) => handleFilterChange('match_score_min', parseInt(e.target.value))}
                    />
                    <div className="w-full flex justify-between text-xs px-2">
                      <span>0%</span>
                      <span>{filters.match_score_min}%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-medium">Location</span>
                    </label>
                    <input
                      type="text"
                      placeholder="City, State"
                      className="input input-bordered input-sm"
                      value={filters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                    />
                  </div>

                  {/* Clear Filters */}
                  <button
                    className="btn btn-outline btn-sm w-full"
                    onClick={() => {
                      setFilters({
                        status: 'all',
                        experience_level: '',
                        climate_focus: '',
                        match_score_min: 0,
                        location: ''
                      })
                      setSearchQuery('')
                    }}
                  >
                    Clear All Filters
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Candidates List */}
          <div className="lg:col-span-3">
            {/* Sort Controls */}
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <span className="text-sm text-base-content/70">Sort by:</span>
                <select
                  className="select select-bordered select-sm"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="match_score">Best Match</option>
                  <option value="name">Name</option>
                  <option value="experience">Experience Level</option>
                  <option value="activity">Recent Activity</option>
                </select>
              </div>
              <div className="text-sm text-base-content/70">
                Showing {filteredCandidates.length} of {candidates.length} candidates
              </div>
            </div>

            {/* Candidates Grid */}
            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-base-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-base-content/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold mb-2">No candidates found</h3>
                <p className="text-base-content/70">
                  Try adjusting your filters or search terms.
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    onAction={handleCandidateAction}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 
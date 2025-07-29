'use client'

import React, { useState, useEffect } from 'react'
import { Metadata } from 'next'

interface AnalyticsData {
  overview: {
    total_jobs: number
    total_applications: number
    total_views: number
    conversion_rate: number
    avg_time_to_hire: number
    cost_per_hire: number
  }
  job_performance: Array<{
    job_id: string
    title: string
    applications: number
    views: number
    qualified_candidates: number
    conversion_rate: number
  }>
  candidate_sources: Array<{
    source: string
    count: number
    percentage: number
  }>
  time_series: Array<{
    date: string
    applications: number
    views: number
    hires: number
  }>
}

export default function PartnerAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d') // 7d, 30d, 90d, 1y
  const [selectedMetric, setSelectedMetric] = useState('applications')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/v1/analytics?user_type=partner&time_range=${timeRange}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          const analyticsData = data.data;
          setAnalytics({
            overview: {
              total_jobs: analyticsData.overview?.total_jobs || 0,
              total_applications: analyticsData.overview?.total_applications || 0,
              total_views: analyticsData.overview?.total_views || 0,
              conversion_rate: analyticsData.overview?.conversion_rate || 0,
              avg_time_to_hire: 0, // Placeholder until implemented
              cost_per_hire: 0 // Placeholder until implemented
            },
            job_performance: analyticsData.job_performance?.map((job: unknown) => ({
              job_id: job.job_id,
              title: job.title,
              applications: job.applications || 0,
              views: job.views || 0,
              qualified_candidates: 0, // Placeholder until implemented
              conversion_rate: 0 // Placeholder until implemented
            })) || [],
            candidate_sources: [], // Placeholder until implemented
            time_series: [] // Placeholder until implemented
          });
        }
      } else {
        // Set empty analytics if API fails
        setAnalytics({
          overview: {
            total_jobs: 0,
            total_applications: 0,
            total_views: 0,
            conversion_rate: 0,
            avg_time_to_hire: 0,
            cost_per_hire: 0
          },
          job_performance: [],
          candidate_sources: [],
          time_series: []
        });
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Analytics Data</h2>
          <p className="text-base-content/70">Start posting jobs to see your analytics.</p>
        </div>
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
              <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
              <p className="text-base-content/70">
                Track your hiring performance and optimize your recruitment strategy.
              </p>
            </div>
            <div className="flex gap-3">
              <select
                className="select select-bordered"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <button className="btn btn-outline">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-primary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <div className="stat-title">Total Jobs</div>
            <div className="stat-value text-primary">{analytics.overview.total_jobs}</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-secondary">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="stat-title">Applications</div>
            <div className="stat-value text-secondary">{analytics.overview.total_applications}</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-accent">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <div className="stat-title">Total Views</div>
            <div className="stat-value text-accent">{analytics.overview.total_views.toLocaleString()}</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-info">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="stat-title">Conversion Rate</div>
            <div className="stat-value text-info">{analytics.overview.conversion_rate}%</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-success">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Avg. Time to Hire</div>
            <div className="stat-value text-success">{analytics.overview.avg_time_to_hire}d</div>
          </div>

          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-figure text-warning">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="stat-title">Cost per Hire</div>
            <div className="stat-value text-warning">${analytics.overview.cost_per_hire}</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* Job Performance Table */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Job Performance</h2>
              <div className="overflow-x-auto">
                <table className="table table-zebra">
                  <thead>
                    <tr>
                      <th>Job Title</th>
                      <th>Applications</th>
                      <th>Views</th>
                      <th>Qualified</th>
                      <th>Conversion Rate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analytics.job_performance.map((job) => (
                      <tr key={job.job_id}>
                        <td>{job.title}</td>
                        <td>{job.applications}</td>
                        <td>{job.views}</td>
                        <td>{job.qualified_candidates}</td>
                        <td>{job.conversion_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Candidate Sources Pie Chart Placeholder */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title mb-4">Candidate Sources</h2>
              <ul className="space-y-2">
                {analytics.candidate_sources.map((src) => (
                  <li key={src.source} className="flex justify-between">
                    <span>{src.source}</span>
                    <span>{src.count} ({src.percentage}%)</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-center text-base-content/60">
                [Pie chart coming soon]
              </div>
            </div>
          </div>
        </div>

        {/* Time Series Chart Placeholder */}
        <div className="card bg-base-100 shadow-xl mt-8">
          <div className="card-body">
            <h2 className="card-title mb-4">Trends Over Time</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Applications</th>
                    <th>Views</th>
                    <th>Hires</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.time_series.map((row) => (
                    <tr key={row.date}>
                      <td>{row.date}</td>
                      <td>{row.applications}</td>
                      <td>{row.views}</td>
                      <td>{row.hires}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center text-base-content/60">
              [Line chart coming soon]
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
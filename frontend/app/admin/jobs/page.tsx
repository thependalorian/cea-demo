'use client'

import React, { useState, useEffect } from 'react'

interface Job {
  id: string
  title: string
  company: string
  status: string
  posted_at: string
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Placeholder: Replace with real API call
    setTimeout(() => {
      setJobs([
        { id: '1', title: 'Solar Engineer', company: 'SunPower', status: 'active', posted_at: '2024-05-01' },
        { id: '2', title: 'Wind Analyst', company: 'WindCo', status: 'flagged', posted_at: '2024-05-10' },
        { id: '3', title: 'EV Technician', company: 'EVWorks', status: 'pending', posted_at: '2024-04-20' }
      ])
      setIsLoading(false)
    }, 800)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="bg-base-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Job Management</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Jobs</div>
            <div className="stat-value text-primary">{jobs.length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Active</div>
            <div className="stat-value text-success">{jobs.filter(j => j.status === 'active').length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Flagged</div>
            <div className="stat-value text-error">{jobs.filter(j => j.status === 'flagged').length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{jobs.filter(j => j.status === 'pending').length}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Jobs</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Company</th>
                    <th>Status</th>
                    <th>Posted</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job) => (
                    <tr key={job.id}>
                      <td>{job.title}</td>
                      <td>{job.company}</td>
                      <td>{job.status}</td>
                      <td>{job.posted_at}</td>
                      <td>
                        <button className="btn btn-xs btn-outline mr-2">Moderate</button>
                        <button className="btn btn-xs btn-error">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 
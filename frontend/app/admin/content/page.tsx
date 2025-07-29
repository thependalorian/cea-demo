'use client'

import React, { useState, useEffect } from 'react'

interface ContentFlag {
  id: string
  type: string
  description: string
  status: string
  reported_at: string
}

export default function AdminContentPage() {
  const [flags, setFlags] = useState<ContentFlag[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Placeholder: Replace with real API call
    setTimeout(() => {
      setFlags([
        { id: '1', type: 'Job', description: 'Inappropriate job posting', status: 'open', reported_at: '2024-06-01' },
        { id: '2', type: 'Profile', description: 'Fake profile', status: 'resolved', reported_at: '2024-05-28' }
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
          <h1 className="text-3xl font-bold">Content Moderation</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Flags</div>
            <div className="stat-value text-primary">{flags.length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Open</div>
            <div className="stat-value text-warning">{flags.filter(f => f.status === 'open').length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Resolved</div>
            <div className="stat-value text-success">{flags.filter(f => f.status === 'resolved').length}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Flagged Content</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Reported</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {flags.map((flag) => (
                    <tr key={flag.id}>
                      <td>{flag.type}</td>
                      <td>{flag.description}</td>
                      <td>{flag.status}</td>
                      <td>{flag.reported_at}</td>
                      <td>
                        <button className="btn btn-xs btn-outline mr-2">Review</button>
                        <button className="btn btn-xs btn-success">Resolve</button>
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
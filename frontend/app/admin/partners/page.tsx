'use client'

import React, { useState, useEffect } from 'react'

interface Partner {
  id: string
  organization_name: string
  email: string
  status: string
  joined_at: string
}

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Placeholder: Replace with real API call
    setTimeout(() => {
      setPartners([
        { id: '1', organization_name: 'GreenTech', email: 'contact@greentech.com', status: 'active', joined_at: '2024-03-15' },
        { id: '2', organization_name: 'EcoWorks', email: 'info@ecoworks.com', status: 'pending', joined_at: '2024-05-01' }
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
          <h1 className="text-3xl font-bold">Partner Management</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Partners</div>
            <div className="stat-value text-primary">{partners.length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Active</div>
            <div className="stat-value text-success">{partners.filter(p => p.status === 'active').length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{partners.filter(p => p.status === 'pending').length}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Partners</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Organization</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {partners.map((partner) => (
                    <tr key={partner.id}>
                      <td>{partner.organization_name}</td>
                      <td>{partner.email}</td>
                      <td>{partner.status}</td>
                      <td>{partner.joined_at}</td>
                      <td>
                        <button className="btn btn-xs btn-outline mr-2">Approve</button>
                        <button className="btn btn-xs btn-primary">Manage</button>
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
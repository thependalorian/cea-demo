'use client'

import React, { useState, useEffect } from 'react'

interface User {
  id: string
  full_name: string
  email: string
  role: string
  status: string
  created_at: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Placeholder: Replace with real API call
    setTimeout(() => {
      setUsers([
        { id: '1', full_name: 'Alice Smith', email: 'alice@example.com', role: 'jobseeker', status: 'active', created_at: '2024-05-01' },
        { id: '2', full_name: 'Bob Jones', email: 'bob@example.com', role: 'partner', status: 'pending', created_at: '2024-05-10' },
        { id: '3', full_name: 'Carol Lee', email: 'carol@example.com', role: 'admin', status: 'active', created_at: '2024-04-20' }
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
          <h1 className="text-3xl font-bold">User Management</h1>
          <button className="btn btn-primary">Add User</button>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Total Users</div>
            <div className="stat-value text-primary">{users.length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Active</div>
            <div className="stat-value text-success">{users.filter(u => u.status === 'active').length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Pending</div>
            <div className="stat-value text-warning">{users.filter(u => u.status === 'pending').length}</div>
          </div>
          <div className="stat bg-base-100 shadow-lg rounded-lg">
            <div className="stat-title">Admins</div>
            <div className="stat-value text-info">{users.filter(u => u.role === 'admin').length}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <h2 className="card-title mb-4">Users</h2>
            <div className="overflow-x-auto">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.full_name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>{user.status}</td>
                      <td>{user.created_at}</td>
                      <td>
                        <button className="btn btn-xs btn-outline mr-2">Edit</button>
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
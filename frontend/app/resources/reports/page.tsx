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

export default function Reports() {
  const [reports, setReports] = useState<KnowledgeResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Static test data for now
  const testReports: KnowledgeResource[] = [
    {
      id: '1',
      title: 'MassCEC Clean Energy Workforce Needs Assessment 2023',
      description: 'Comprehensive assessment of Massachusetts clean energy workforce needs through 2030',
      content: 'This report analyzes workforce needs in the clean energy sector.',
      tags: ['MassCEC', 'workforce assessment', 'clean energy jobs'],
      categories: ['reports'],
      topics: [],
      climate_sectors: [],
      career_stages: [],
      skill_categories: [],
      source_url: 'https://www.masscec.com/workforce-development/clean-energy-workforce-needs-assessment-2023',
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    },
    {
      id: '2',
      title: 'NECEC Annual Report 2023',
      description: 'Northeast Clean Energy Council annual report highlighting industry growth, regional initiatives, and workforce trends',
      content: 'This annual report covers industry growth and trends.',
      tags: ['NECEC', 'industry report', 'clean energy economy'],
      categories: ['reports'],
      topics: [],
      climate_sectors: [],
      career_stages: [],
      skill_categories: [],
      source_url: 'https://www.necec.org/annual-report-2023',
      created_at: '2023-01-01',
      updated_at: '2023-01-01'
    }
  ]

  useEffect(() => {
    // For now, use static data to test the UI
    console.log('🔍 Loading static test data...')
    setTimeout(() => {
      setReports(testReports)
      setLoading(false)
    }, 1000)
  }, [])

  // Check if we have MassCEC and NECEC reports
  const masscecReport = reports.find(r => r.tags?.includes('MassCEC'))
  const nececReport = reports.find(r => r.tags?.includes('NECEC'))

  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">Massachusetts Clean Energy Industry Reports</h1>
          <p className="text-moss-green">
            Comprehensive research, analysis, and market insights for Massachusetts clean energy sector
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center mb-8">
            <div className="loading loading-spinner loading-lg text-moss-green"></div>
            <p className="text-midnight-forest mt-4">Loading industry reports...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 mb-8">
            Failed to load reports. Please try again later.
            <br />
            <small className="text-sm text-gray-500">Error: {error}</small>
          </div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="text-center text-midnight-forest mb-8">No industry reports found.</div>
        )}

        {!loading && !error && reports.length > 0 && (
          <>
            {/* Featured Massachusetts Reports */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-midnight-forest mb-6">Featured Massachusetts Reports</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {masscecReport && (
                  <div className="card bg-white shadow-xl border border-spring-green/20">
                    <div className="card-body">
                      <div className="badge badge-success mb-2">MassCEC</div>
                      <h3 className="card-title text-lg text-midnight-forest">{masscecReport.title}</h3>
                      <p className="text-sm text-moss-green mb-4">
                        {masscecReport.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {masscecReport.tags && masscecReport.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {masscecReport.tags.slice(0, 4).map((tag, index) => (
                              <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-moss-green">
                          {new Date(masscecReport.created_at).toLocaleDateString()}
                        </span>
                        {masscecReport.source_url && (
                          <Link href={masscecReport.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest" target="_blank" rel="noopener noreferrer">
                            View Report
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {nececReport && (
                  <div className="card bg-white shadow-xl border border-spring-green/20">
                    <div className="card-body">
                      <div className="badge badge-success mb-2">NECEC</div>
                      <h3 className="card-title text-lg text-midnight-forest">{nececReport.title}</h3>
                      <p className="text-sm text-moss-green mb-4">
                        {nececReport.description}
                      </p>
                      <div className="space-y-2 mb-4">
                        {nececReport.tags && nececReport.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {nececReport.tags.slice(0, 4).map((tag, index) => (
                              <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-moss-green">
                          {new Date(nececReport.created_at).toLocaleDateString()}
                        </span>
                        {nececReport.source_url && (
                          <Link href={nececReport.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest" target="_blank" rel="noopener noreferrer">
                            View Report
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* All Reports Grid */}
            {reports.length > 2 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-midnight-forest mb-6">All Industry Reports</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {reports.map((report) => (
                    <div key={report.id} className="card bg-white shadow-xl border border-spring-green/20">
                      <div className="card-body">
                        <div className="badge badge-success mb-2">
                          {report.categories?.[0] || 'Report'}
                        </div>
                        <h3 className="card-title text-lg text-midnight-forest">{report.title}</h3>
                        <p className="text-sm text-moss-green mb-4">
                          {report.description?.substring(0, 120)}...
                        </p>
                        <div className="space-y-2 mb-4">
                          {report.climate_sectors && report.climate_sectors.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {report.climate_sectors.slice(0, 3).map((sector, index) => (
                                <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                  {sector}
                                </span>
                              ))}
                            </div>
                          )}
                          {report.tags && report.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {report.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-moss-green">
                            {new Date(report.created_at).toLocaleDateString()}
                          </span>
                          {report.source_url && (
                            <Link href={report.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest" target="_blank" rel="noopener noreferrer">
                              View Report
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research Partners */}
            <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
              <div className="card-body">
                <h2 className="card-title text-midnight-forest mb-6">Research Partners</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">MassCEC</h3>
                    <p className="text-sm text-moss-green">Clean energy research and market analysis</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">NECEC</h3>
                    <p className="text-sm text-moss-green">Northeast Clean Energy Council reports</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">MIT Energy Initiative</h3>
                    <p className="text-sm text-moss-green">Technology and policy research</p>
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
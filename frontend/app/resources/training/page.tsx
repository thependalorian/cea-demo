'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

interface EducationProgram {
  id: string
  partner_id: string
  program_name: string
  description: string
  program_type?: string
  duration?: string
  format?: string
  cost?: string
  prerequisites?: string
  climate_focus?: string[]
  skills_taught?: string[]
  certification_offered?: string
  application_deadline?: string
  start_date?: string
  end_date?: string
  contact_info?: any
  application_url?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export default function Training() {
  const [programs, setPrograms] = useState<EducationProgram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPrograms() {
      try {
        console.log('🔍 Starting to fetch training programs...')
        console.log('🔍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
        console.log('🔍 Supabase Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
        
        setLoading(true)
        setError(null)

        const { data, error: fetchError } = await (supabase as any) // Type assertion
          .from('education_programs')
          .select('*')
          .eq('is_active', true)
          .order('start_date', { ascending: true })

        console.log('🔍 Supabase response:', { data, error: fetchError })

        if (fetchError) {
          console.error('❌ Error fetching training programs:', fetchError)
          setError(fetchError.message)
        } else {
          console.log('✅ Successfully fetched programs:', data?.length || 0)
          setPrograms((data as EducationProgram[]) || []) // Type assertion
        }
      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError('Failed to load training programs')
      } finally {
        console.log('🔍 Setting loading to false')
        setLoading(false)
      }
    }
    fetchPrograms()
  }, [])

  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">Massachusetts Clean Energy Training Programs</h1>
          <p className="text-moss-green">
            Comprehensive training and certification programs to advance your clean energy career in Massachusetts
          </p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center mb-8">
            <div className="loading loading-spinner loading-lg text-moss-green"></div>
            <p className="text-midnight-forest mt-4">Loading training programs...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 mb-8">
            Failed to load training programs. Please try again later.
            <br />
            <small className="text-sm text-gray-500">Error: {error}</small>
          </div>
        )}
        
        {!loading && !error && programs.length === 0 && (
          <div className="text-center text-midnight-forest mb-8">No training programs found.</div>
        )}
        
        {!loading && !error && programs.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {programs.map((program) => (
              <div key={program.id} className="card bg-white shadow-xl border border-spring-green/20">
                <div className="card-body">
                  <h3 className="card-title text-lg text-midnight-forest">{program.program_name}</h3>
                  <p className="text-sm text-moss-green mb-4">{program.description}</p>
                  <div className="space-y-2 mb-4">
                    {program.duration && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Duration:</span>
                        <span className="text-moss-green">{program.duration}</span>
                      </div>
                    )}
                    {program.format && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Format:</span>
                        <span className="text-moss-green">{program.format}</span>
                      </div>
                    )}
                    {program.program_type && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Type:</span>
                        <span className="text-moss-green">{program.program_type}</span>
                      </div>
                    )}
                    {program.certification_offered && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Certification:</span>
                        <span className="text-moss-green">{program.certification_offered}</span>
                      </div>
                    )}
                    {program.skills_taught && program.skills_taught.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Skills:</span>
                        <span className="text-moss-green">{program.skills_taught.join(', ')}</span>
                      </div>
                    )}
                    {program.climate_focus && program.climate_focus.length > 0 && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Focus:</span>
                        <span className="text-moss-green">{program.climate_focus.join(', ')}</span>
                      </div>
                    )}
                    {program.cost && (
                      <div className="flex justify-between text-sm">
                        <span className="text-midnight-forest">Cost:</span>
                        <span className="text-moss-green">{program.cost}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center">
                    {program.application_url && (
                      <Link 
                        href={program.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest"
                      >
                        Apply Now
                      </Link>
                    )}
                    {program.contact_info && (
                      <div className="text-xs text-midnight-forest">
                        <p>Contact: {program.contact_info.contact_person}</p>
                        <p>Email: {program.contact_info.email}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        <div className="text-center">
          <Link 
            href="/resources" 
            className="btn btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
          >
            Back to Resources
          </Link>
        </div>
      </div>
    </div>
  )
} 
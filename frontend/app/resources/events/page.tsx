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

export default function Events() {
  const [events, setEvents] = useState<KnowledgeResource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      
      try {
        console.log('🔍 Starting to fetch events...')
        
        // Fetch all knowledge resources and filter on client side
        const { data: allData, error: fetchError } = await (supabase as any)
          .from('knowledge_resources')
          .select('*')
          .order('created_at', { ascending: false })

        console.log('🔍 All data query result:', { data: allData, error: fetchError })

        if (fetchError) {
          console.error('❌ Events query failed:', fetchError)
          setError('Failed to load events.')
          return
        }

        // Filter for events on client side
        const eventsData = allData?.filter((item: any) => {
          const hasEventCategory = item.categories?.includes('events')
          const hasEventTags = item.tags?.some((tag: string) => 
            ['event', 'webinar', 'workshop', 'conference'].includes(tag)
          )
          return hasEventCategory || hasEventTags
        }) || []

        console.log('✅ Successfully filtered events:', eventsData.length)
        setEvents(eventsData as KnowledgeResource[])

      } catch (err) {
        console.error('❌ Unexpected error:', err)
        setError('Failed to load events and webinars.')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Group events by category
  const eventsByCategory = events.reduce((acc, event) => {
    const category = event.categories?.[0] || 'General'
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(event)
    return acc
  }, {} as { [key: string]: KnowledgeResource[] })

  return (
    <div className="min-h-screen bg-sand-gray">
      <div className="bg-white shadow-sm border-b border-spring-green/20">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-midnight-forest">Massachusetts Clean Energy Events & Webinars</h1>
          <p className="text-moss-green">
            Networking opportunities, professional development, and industry insights for Massachusetts clean energy professionals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading && (
          <div className="text-center mb-8">
            <div className="loading loading-spinner loading-lg text-moss-green"></div>
            <p className="text-midnight-forest mt-4">Loading events and webinars...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-600 mb-8">
            Failed to load events. Please try again later.
            <br />
            <small className="text-sm text-gray-500">Error: {error}</small>
          </div>
        )}
        
        {!loading && !error && events.length === 0 && (
          <div className="text-center text-midnight-forest mb-8">No events or webinars found.</div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            {/* Upcoming Events */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-midnight-forest mb-6">Upcoming Massachusetts Events</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.slice(0, 6).map((event) => (
                  <div key={event.id} className="card bg-white shadow-xl border border-spring-green/20">
                    <div className="card-body">
                      <div className="badge badge-success mb-2">
                        {event.categories?.[0] || 'Event'}
                      </div>
                      <h3 className="card-title text-lg text-midnight-forest">{event.title}</h3>
                      <p className="text-sm text-moss-green mb-4">
                        {event.description?.substring(0, 120)}...
                      </p>
                      <div className="space-y-2 mb-4">
                        {event.climate_sectors && event.climate_sectors.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {event.climate_sectors.slice(0, 3).map((sector, index) => (
                              <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                {sector}
                              </span>
                            ))}
                          </div>
                        )}
                        {event.topics && event.topics.length > 0 && (
                          <div className="text-xs text-midnight-forest">
                            Topics: {event.topics.slice(0, 2).join(', ')}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-moss-green">
                          {new Date(event.created_at).toLocaleDateString()}
                        </span>
                        {event.source_url && (
                          <Link href={event.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest" target="_blank" rel="noopener noreferrer">
                            Register
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Events by Category */}
            {Object.keys(eventsByCategory).length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-midnight-forest mb-6">Events by Category</h2>
                <div className="space-y-8">
                  {Object.entries(eventsByCategory).map(([category, categoryEvents]) => (
                    <div key={category} className="card bg-white shadow-xl border border-spring-green/20">
                      <div className="card-body">
                        <h3 className="card-title text-midnight-forest mb-4">{category} Events</h3>
                        <div className="space-y-4">
                          {categoryEvents.map((event) => (
                            <div key={event.id} className="p-4 bg-spring-green/10 rounded-lg">
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <h4 className="font-bold text-midnight-forest">{event.title}</h4>
                                  <p className="text-sm text-moss-green mb-2">
                                    {event.description?.substring(0, 100)}...
                                  </p>
                                  {event.tags && event.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                      {event.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="badge badge-outline badge-xs border-moss-green text-moss-green">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                                <div className="text-right ml-4">
                                  <div className="text-xs text-moss-green">
                                    {new Date(event.created_at).toLocaleDateString()}
                                  </div>
                                  {event.source_url && (
                                    <Link href={event.source_url} className="btn btn-primary btn-sm bg-moss-green border-moss-green hover:bg-midnight-forest mt-2" target="_blank" rel="noopener noreferrer">
                                      Register
                                    </Link>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Partners */}
            <div className="card bg-white shadow-xl border border-spring-green/20 mb-8">
              <div className="card-body">
                <h2 className="card-title text-midnight-forest mb-6">Event Partners</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">MassCEC</h3>
                    <p className="text-sm text-moss-green">Clean energy events and workshops</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Clean Energy Center</h3>
                    <p className="text-sm text-moss-green">Professional development events</p>
                  </div>
                  <div className="text-center p-4 bg-spring-green/10 rounded-lg">
                    <h3 className="font-bold text-midnight-forest mb-2">Industry Associations</h3>
                    <p className="text-sm text-moss-green">Networking and industry events</p>
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
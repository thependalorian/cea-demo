// Next.js API route for advanced job search
// Location: app/api/v1/jobs/search/route.ts
// Handles AI-powered job search with semantic matching
// High Priority Fix: Advanced job search capabilities

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError 
} from '@/lib/api-response'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

// POST /api/v1/jobs/search - Advanced job search with AI matching
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    const body = await request.json()
    
    // Get user profile for enhanced matching
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select(`
        climate_interests,
        preferred_locations,
        skills,
        experience_level,
        desired_roles,
        remote_work_preference,
        salary_range_min,
        salary_range_max
      `)
      .eq('id', session.user.id)
      .single()

    // Enhanced search payload with user context
    const searchPayload = {
      ...body,
      user_id: session.user.id,
      user_profile: userProfile,
      enable_semantic_search: body.enable_semantic_search !== false,
      enable_ai_matching: body.enable_ai_matching !== false,
      match_threshold: body.match_threshold || 0.6
    }

    // Proxy to backend advanced search
    const response = await fetch(`${BACKEND_API_URL}/api/v1/jobs/search`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(searchPayload)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Job search failed', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Job search completed successfully')
    )

  } catch (error) {
    console.error('Job search error:', error)
    return handleApiError(error)
  }
}

// GET /api/v1/jobs/search - Quick search with query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createServerClient()
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    // Build search parameters
    const params = new URLSearchParams()
    
    // Advanced search parameters
    const searchParams_list = [
      'q', 'title', 'location', 'skills', 'climate_focus',
      'employment_type', 'experience_level', 'salary_min', 'salary_max',
      'remote_friendly', 'limit', 'offset', 'sort_by',
      'semantic_search', 'match_threshold'
    ]
    
    searchParams_list.forEach(param => {
      const value = searchParams.get(param)
      if (value) params.append(param, value)
    })

    // Add user context
    params.append('user_id', session.user.id)

    // Proxy to backend search endpoint
    const backendUrl = `${BACKEND_API_URL}/api/v1/jobs/search?${params.toString()}`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Job search failed', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Job search completed successfully')
    )

  } catch (error) {
    console.error('Job search error:', error)
    return handleApiError(error)
  }
}
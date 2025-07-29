// Next.js API route for jobs management
// Location: app/api/v1/jobs/route.ts
// Handles comprehensive job operations (GET, POST)
// High Priority Fix: Jobs Management (missing advanced operations)

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

// GET /api/v1/jobs - Enhanced job listings with backend integration
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

    // Build comprehensive query parameters
    const params = new URLSearchParams()
    
    // Advanced filtering parameters
    const allowedParams = [
      'title', 'location', 'employment_type', 'experience_level', 'climate_focus',
      'skills_required', 'salary_range', 'partner_id', 'is_active',
      'limit', 'offset', 'sort_by', 'sort_order', 'search',
      'remote_friendly', 'application_deadline', 'created_after'
    ]
    
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) params.append(param, value)
    })

    // Get user preferences for enhanced matching
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select('climate_interests, preferred_locations, skills, experience_level')
      .eq('id', session.user.id)
      .single()

    // Add user context for personalized results
    if (userProfile) {
      params.append('user_id', session.user.id)
      params.append('personalize', 'true')
    }

    // Proxy to backend with enhanced job search
    const backendUrl = `${BACKEND_API_URL}/api/v1/jobs${params.toString() ? '?' + params.toString() : ''}`
    
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
        createErrorResponse(errorData.error || 'Failed to fetch jobs', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Jobs retrieved successfully')
    )

  } catch (error) {
    console.error('Jobs API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/jobs - Create new job listing (Partner/Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Authentication and authorization
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    // Check user permissions
    const { data: profile } = await supabase
      .from('consolidated_profiles')
      .select('profile_type, organization_name, id')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['partner', 'admin'].includes(profile.profile_type)) {
      return NextResponse.json(
        createErrorResponse('Insufficient permissions. Partner or Admin role required.', 'FORBIDDEN'),
        { status: 403 }
      )
    }

    const body = await request.json()

    // Validation
    const requiredFields = ['title', 'description', 'location', 'employment_type']
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '')
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400),
        { status: 400 }
      )
    }

    // Enhance job data with partner context
    const jobData = {
      ...body,
      partner_id: session.user.id,
      created_by: session.user.id,
      organization_name: profile.organization_name,
      is_active: body.is_active !== undefined ? body.is_active : true,
      created_at: new Date().toISOString(),
      payment_status: 'pending' // Jobs require payment for premium placement
    }

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(jobData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to create job listing', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Job listing created successfully'),
      { status: 201 }
    )

  } catch (error) {
    console.error('Job creation error:', error)
    return handleApiError(error)
  }
} 
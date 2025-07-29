// Next.js API route for knowledge resources
// Location: app/api/v1/resources/route.ts
// Handles knowledge base resources with semantic search
// High Priority Fix: Knowledge Resources (0% frontend coverage -> Critical Gap)

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

// GET /api/v1/resources - Get knowledge resources with filtering
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
    
    // Knowledge resource filtering parameters
    const allowedParams = [
      'categories', 'climate_sectors', 'content_type', 'content_difficulty',
      'target_audience', 'skill_categories', 'topics', 'domain',
      'is_published', 'partner_id', 'search', 'limit', 'offset',
      'sort_by', 'sort_order', 'semantic_search', 'embedding_search'
    ]
    
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) params.append(param, value)
    })

    // Get user interests for personalized recommendations
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select('climate_interests, experience_level, skills')
      .eq('id', session.user.id)
      .single()

    // Add user context for personalized results
    if (userProfile) {
      params.append('user_id', session.user.id)
      params.append('personalize', 'true')
    }

    // Proxy to backend resources endpoint
    const backendUrl = `${BACKEND_API_URL}/api/v1/resources/knowledge${params.toString() ? '?' + params.toString() : ''}`
    
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
        createErrorResponse(errorData.error || 'Failed to fetch knowledge resources', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Knowledge resources retrieved successfully')
    )

  } catch (error) {
    console.error('Knowledge resources API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/resources - Create knowledge resource (Partner/Admin only)
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
    const requiredFields = ['title', 'content', 'content_type']
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '')
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400),
        { status: 400 }
      )
    }

    // Enhance resource data with partner context
    const resourceData = {
      ...body,
      partner_id: session.user.id,
      created_by: session.user.id,
      organization_name: profile.organization_name,
      is_published: body.is_published !== undefined ? body.is_published : true,
      created_at: new Date().toISOString(),
      view_count: 0
    }

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/resources/knowledge`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(resourceData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to create knowledge resource', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Knowledge resource created successfully'),
      { status: 201 }
    )

  } catch (error) {
    console.error('Knowledge resource creation error:', error)
    return handleApiError(error)
  }
}
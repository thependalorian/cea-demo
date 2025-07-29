// Next.js API route for individual job operations
// Location: app/api/v1/jobs/[id]/route.ts
// Handles GET, PUT, DELETE for specific job listings
// High Priority Fix: Jobs Management individual operations

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

// GET /api/v1/jobs/[id] - Get specific job listing
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const jobId = params.id
    
    if (!jobId) {
      return NextResponse.json(
        createErrorResponse('Job ID is required', 400),
        { status: 400 }
      )
    }

    // Authentication check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    // Include user context for personalized job view
    const { searchParams } = new URL(request.url)
    const includeMatching = searchParams.get('include_matching') === 'true'
    
    let backendUrl = `${BACKEND_API_URL}/api/v1/jobs/${jobId}`
    
    if (includeMatching) {
      backendUrl += `?user_id=${session.user.id}&include_matching=true`
    }

    // Proxy to backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          createErrorResponse('Job listing not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch job listing', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Job listing retrieved successfully')
    )

  } catch (error) {
    console.error('Job fetch error:', error)
    return handleApiError(error)
  }
}

// PUT /api/v1/jobs/[id] - Update job listing
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const jobId = params.id
    
    if (!jobId) {
      return NextResponse.json(
        createErrorResponse('Job ID is required', 400),
        { status: 400 }
      )
    }

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
      .select('profile_type')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['partner', 'admin'].includes(profile.profile_type)) {
      return NextResponse.json(
        createErrorResponse('Insufficient permissions. Partner or Admin role required.', 'FORBIDDEN'),
        { status: 403 }
      )
    }

    const body = await request.json()

    // Add update metadata
    const updateData = {
      ...body,
      updated_by: session.user.id,
      updated_at: new Date().toISOString()
    }

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/jobs/${jobId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          createErrorResponse('Job listing not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to update job listing', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Job listing updated successfully')
    )

  } catch (error) {
    console.error('Job update error:', error)
    return handleApiError(error)
  }
}

// DELETE /api/v1/jobs/[id] - Delete job listing
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const jobId = params.id
    
    if (!jobId) {
      return NextResponse.json(
        createErrorResponse('Job ID is required', 400),
        { status: 400 }
      )
    }

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
      .select('profile_type')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['partner', 'admin'].includes(profile.profile_type)) {
      return NextResponse.json(
        createErrorResponse('Insufficient permissions. Partner or Admin role required.', 'FORBIDDEN'),
        { status: 403 }
      )
    }

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/jobs/${jobId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          createErrorResponse('Job listing not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to delete job listing', 500),
        { status: response.status }
      )
    }

    return NextResponse.json(
      createSuccessResponse({ id: jobId }, 'Job listing deleted successfully')
    )

  } catch (error) {
    console.error('Job deletion error:', error)
    return handleApiError(error)
  }
} 
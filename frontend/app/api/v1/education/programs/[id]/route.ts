// Next.js API route for individual education program operations
// Location: app/api/v1/education/programs/[id]/route.ts
// Handles GET, PUT, DELETE for specific education programs
// High Priority Fix: Education & Credentials individual operations

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

// GET /api/v1/education/programs/[id] - Get specific education program
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const programId = params.id
    
    if (!programId) {
      return NextResponse.json(
        createErrorResponse('Program ID is required', 400),
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

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/education/programs/${programId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          createErrorResponse('Education program not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch education program', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Education program retrieved successfully')
    )

  } catch (error) {
    console.error('Education program fetch error:', error)
    return handleApiError(error)
  }
}

// PUT /api/v1/education/programs/[id] - Update education program
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const programId = params.id
    
    if (!programId) {
      return NextResponse.json(
        createErrorResponse('Program ID is required', 400),
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
      .select('profile_type, organization_name')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['partner', 'admin'].includes(profile.profile_type)) {
      return NextResponse.json(
        createErrorResponse('Insufficient permissions. Partner or Admin role required.', 'FORBIDDEN'),
        { status: 403 }
      )
    }

    const body = await request.json()

    // Add user context
    const updateData = {
      ...body,
      updated_by: session.user.id,
      updated_at: new Date().toISOString()
    }

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/education/programs/${programId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          createErrorResponse('Education program not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to update education program', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Education program updated successfully')
    )

  } catch (error) {
    console.error('Education program update error:', error)
    return handleApiError(error)
  }
}

// DELETE /api/v1/education/programs/[id] - Delete education program
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const programId = params.id
    
    if (!programId) {
      return NextResponse.json(
        createErrorResponse('Program ID is required', 400),
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

    // Check user permissions - only admin or program owner can delete
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
    const response = await fetch(`${BACKEND_API_URL}/api/v1/education/programs/${programId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          createErrorResponse('Education program not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to delete education program', 500),
        { status: response.status }
      )
    }

    return NextResponse.json(
      createSuccessResponse({ id: programId }, 'Education program deleted successfully')
    )

  } catch (error) {
    console.error('Education program deletion error:', error)
    return handleApiError(error)
  }
} 
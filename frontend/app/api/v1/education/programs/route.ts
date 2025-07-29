// Next.js API route for individual education programs
// Location: app/api/v1/education/programs/route.ts
// Handles detailed education program operations
// High Priority Fix: Education & Credentials detailed management

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

// GET /api/v1/education/programs - Get all education programs with filtering
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

    // Build query parameters
    const params = new URLSearchParams()
    
    // Common filtering parameters
    const allowedParams = [
      'climate_focus', 'program_type', 'format', 'certification_offered',
      'cost', 'duration', 'is_active', 'partner_id', 'limit', 'offset',
      'search', 'skills_taught', 'location'
    ]
    
    allowedParams.forEach(param => {
      const value = searchParams.get(param)
      if (value) params.append(param, value)
    })

    // Proxy to backend
    const backendUrl = `${BACKEND_API_URL}/api/v1/education/programs${params.toString() ? '?' + params.toString() : ''}`
    
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch education programs', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Education programs retrieved successfully')
    )

  } catch (error) {
    console.error('Education programs API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/education/programs - Create new education program
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
    const requiredFields = ['program_name', 'description']
    const missingFields = requiredFields.filter(field => !body[field] || body[field].trim() === '')
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400),
        { status: 400 }
      )
    }

    // Enhance data with user context
    const programData = {
      ...body,
      partner_id: session.user.id,
      created_by: session.user.id,
      organization_name: profile.organization_name,
      is_active: body.is_active !== undefined ? body.is_active : true
    }

    // Proxy to backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/education/programs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(programData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to create education program', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Education program created successfully'),
      { status: 201 }
    )

  } catch (error) {
    console.error('Education program creation error:', error)
    return handleApiError(error)
  }
} 
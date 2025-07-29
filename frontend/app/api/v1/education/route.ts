// Next.js API route for education programs
// Location: app/api/v1/education/route.ts
// Handles GET/POST requests for education programs with backend proxy
// High Priority Fix: Education & Credentials (0% frontend coverage -> Critical Gap)

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

// GET /api/v1/education - List education programs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createServerClient()
    
    // Get current user session for authentication
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    // Build query parameters for backend
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      params.append(key, value)
    })

    // Proxy to backend education endpoint
    const backendUrl = `${BACKEND_API_URL}/api/v1/education/programs${params.toString() ? '?' + params.toString() : ''}`
    
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
        createErrorResponse(errorData.error || 'Failed to fetch education programs', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Education programs retrieved successfully')
    )

  } catch (error) {
    console.error('Education API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/education - Create education program (Partner/Admin only)
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    // Check user role - only partners and admins can create education programs
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

    // Validate required fields
    const requiredFields = ['program_name', 'description']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400),
        { status: 400 }
      )
    }

    // Add user context to the request
    const programData = {
      ...body,
      created_by: session.user.id,
      organization_name: profile.organization_name
    }

    // Proxy to backend education creation endpoint
    const response = await fetch(`${BACKEND_API_URL}/api/v1/education/programs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
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
    console.error('Education creation error:', error)
    return handleApiError(error)
  }
} 
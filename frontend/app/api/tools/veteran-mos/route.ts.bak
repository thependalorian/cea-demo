// Next.js API route for MOS translation tool
// Location: app/api/tools/veteran-mos/route.ts
// Handles Military Occupational Specialty to civilian job translation
// High Priority Fix: Veterans can't access MOS translation (Backend only -> Frontend accessible)

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

// POST /api/tools/veteran-mos - Translate MOS to civilian careers
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
    const { mos_code, branch_of_service, include_related_roles = true, detail_level = 'standard' } = body

    // Validation
    if (!mos_code || !branch_of_service) {
      return NextResponse.json(
        createErrorResponse('MOS code and branch of service are required', 400),
        { status: 400 }
      )
    }

    // Validate branch of service
    const validBranches = ['army', 'navy', 'air_force', 'marines', 'coast_guard', 'space_force']
    if (!validBranches.includes(branch_of_service.toLowerCase())) {
      return NextResponse.json(
        createErrorResponse(`Invalid branch of service. Must be one of: ${validBranches.join(', ')}`, 400),
        { status: 400 }
      )
    }

    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select('military_service, experience_level, preferred_locations, salary_range_min, salary_range_max')
      .eq('id', session.user.id)
      .single()

    // Enhanced translation request with user context
    const translationRequest = {
      mos_code: mos_code.toUpperCase(),
      branch_of_service: branch_of_service.toLowerCase(),
      include_related_roles,
      detail_level,
      user_context: userProfile,
      user_id: session.user.id,
      timestamp: new Date().toISOString()
    }

    // Proxy to backend MOS translation service
    const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/veteran-mos/translate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(translationRequest)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'MOS translation service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to translate MOS', 500),
        { status: response.status }
      )
    }

    const data = await response.json()

    // Log the translation for analytics
    await supabase
      .from('user_activities')
      .insert({
        id: crypto.randomUUID(),
        user_id: session.user.id,
        activity_type: 'mos_translation',
        details: {
          mos_code,
          branch_of_service,
          result_count: data.mapped_skills.length
        },
        created_at: new Date().toISOString()
      })
    
    return NextResponse.json(
      createSuccessResponse(data, 'MOS translation completed successfully')
    )

  } catch (error) {
    console.error('MOS translation error:', error)
    return handleApiError(error)
  }
}

// GET /api/tools/veteran-mos - Get MOS information and search
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

    const mosCode = searchParams.get('mos_code')
    const branch = searchParams.get('branch')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '10')

    // Build query parameters for backend
    const params = new URLSearchParams()
    if (mosCode) params.append('mos_code', mosCode)
    if (branch) params.append('branch', branch)
    if (search) params.append('search', search)
    params.append('limit', limit.toString())

    // Get MOS data from backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/veteran-mos?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'MOS lookup service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to lookup MOS data', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'MOS data retrieved successfully')
    )

  } catch (error) {
    console.error('MOS lookup error:', error)
    return handleApiError(error)
  }
} 
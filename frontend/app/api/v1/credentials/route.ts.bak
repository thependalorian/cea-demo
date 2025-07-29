// Next.js API route for credential validation
// Location: app/api/v1/credentials/route.ts
// Handles credential evaluation and African framework validation
// High Priority Fix: Credentials (0% frontend coverage -> Critical Gap)

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

// GET /api/v1/credentials - Get credential evaluations and frameworks
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

    const endpoint = searchParams.get('endpoint') || 'evaluations'

    // Build query parameters
    const params = new URLSearchParams()
    searchParams.forEach((value, key) => {
      if (key !== 'endpoint') {
        params.append(key, value)
      }
    })

    let backendUrl = ''
    
    // Route to appropriate backend endpoint
    switch (endpoint) {
      case 'evaluations':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/evaluations`
        break
      case 'frameworks':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/frameworks`
        break
      case 'african-frameworks':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/african-frameworks`
        break
      case 'regional-frameworks':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/regional-frameworks`
        break
      default:
        return NextResponse.json(
          createErrorResponse('Invalid endpoint. Use: evaluations, frameworks, african-frameworks, regional-frameworks', 400),
          { status: 400 }
        )
    }

    if (params.toString()) {
      backendUrl += '?' + params.toString()
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
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch credentials data', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, `Credentials ${endpoint} retrieved successfully`)
    )

  } catch (error) {
    console.error('Credentials API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/credentials - Submit credential for evaluation
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
    const { action, ...credentialData } = body

    // Validate required fields based on action
    if (action === 'evaluate') {
      const requiredFields = ['credential_type', 'issuing_country']
      const missingFields = requiredFields.filter(field => !credentialData[field])
      
      if (missingFields.length > 0) {
        return NextResponse.json(
          createErrorResponse(`Missing required fields: ${missingFields.join(', ')}`, 400),
          { status: 400 }
        )
      }
    }

    // Add user context
    const requestData = {
      ...credentialData,
      user_id: session.user.id,
      submitted_at: new Date().toISOString()
    }

    let backendUrl = ''
    
    // Route based on action
    switch (action) {
      case 'evaluate':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/evaluate`
        break
      case 'framework-lookup':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/framework-lookup`
        break
      case 'african-framework-match':
        backendUrl = `${BACKEND_API_URL}/api/v1/credentials/african-framework-match`
        break
      default:
        return NextResponse.json(
          createErrorResponse('Invalid action. Use: evaluate, framework-lookup, african-framework-match', 400),
          { status: 400 }
        )
    }

    // Proxy to backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(requestData)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to process credential request', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, `Credential ${action} completed successfully`),
      { status: 201 }
    )

  } catch (error) {
    console.error('Credential submission error:', error)
    return handleApiError(error)
  }
}
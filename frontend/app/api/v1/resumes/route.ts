// Next.js API route for advanced resume processing
// Location: app/api/v1/resumes/route.ts
// Handles AI-powered resume analysis and processing
// High Priority Fix: Resume Processing (20% -> 100% coverage)

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

// GET /api/v1/resumes - Get user resumes with analysis
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

    const includeChunks = searchParams.get('include_chunks') === 'true'
    const includeSkills = searchParams.get('include_skills') === 'true'
    const analysisStatus = searchParams.get('analysis_status')

    // Build query to get resumes with related data
    let select = 'id, filename, file_path, file_size, upload_date, analysis_status, analysis_results, created_at, updated_at'
    
    if (includeChunks) {
      select += ', resume_chunks(*)'
    }
    
    if (includeSkills) {
      select += ', skills_mapping(*)'
    }

    let query = supabase
      .from('resumes')
      .select(select)
      .eq('user_id', session.user.id)

    if (analysisStatus) {
      query = query.eq('analysis_status', analysisStatus)
    }

    const { data: resumes, error } = await query.order('upload_date', { ascending: false })

    if (error) {
      console.error('Error fetching resumes:', error)
      return NextResponse.json(
        createErrorResponse('Failed to fetch resumes', 500),
        { status: 500 }
      )
    }

    // Enhance resumes with additional analysis if available
    const enhancedResumes = await Promise.all(
      (resumes || []).map(async (resume) => {
        // Get skills analysis if not included in main query
        if (!includeSkills && resume.analysis_status === 'completed') {
          const { data: skills } = await supabase
            .from('skills_mapping')
            .select('skill_name, skill_category, confidence_score, context')
            .eq('resume_id', resume.id)
            .order('confidence_score', { ascending: false })
            .limit(10)

          resume.top_skills = skills || []
        }

        // Calculate analysis completeness
        if (resume.resume_chunks && Array.isArray(resume.resume_chunks)) {
          resume.chunk_count = resume.resume_chunks.length
        }

        return resume
      })
    )

    return NextResponse.json(
      createSuccessResponse(enhancedResumes, 'Resumes retrieved successfully')
    )

  } catch (error) {
    console.error('Resumes API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/resumes - Upload and process resume
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

    const contentType = request.headers.get('content-type')
    
    if (!contentType?.includes('multipart/form-data')) {
      return NextResponse.json(
        createErrorResponse('Content-Type must be multipart/form-data', 400),
        { status: 400 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const enableAIAnalysis = formData.get('enable_ai_analysis') === 'true'
    const extractSkills = formData.get('extract_skills') === 'true'
    const generateChunks = formData.get('generate_chunks') === 'true'

    if (!file) {
      return NextResponse.json(
        createErrorResponse('No file provided', 400),
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        createErrorResponse('Invalid file type. Only PDF and Word documents are allowed.', 400),
        { status: 400 }
      )
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        createErrorResponse('File size too large. Maximum 10MB allowed.', 400),
        { status: 400 }
      )
    }

    // Check user's subscription limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        id,
        tier_name,
        subscription_features!inner(*)
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .eq('subscription_features.feature_name', 'resume_analysis')
      .single()

    if (enableAIAnalysis && !subscription) {
      return NextResponse.json(
        createErrorResponse('AI resume analysis requires an active subscription', 'SUBSCRIPTION_REQUIRED'),
        { status: 402 }
      )
    }

    // Create FormData for backend
    const backendFormData = new FormData()
    backendFormData.append('file', file)
    backendFormData.append('user_id', session.user.id)
    backendFormData.append('enable_ai_analysis', enableAIAnalysis.toString())
    backendFormData.append('extract_skills', extractSkills.toString())
    backendFormData.append('generate_chunks', generateChunks.toString())

    // Forward to backend processing
    const response = await fetch(`${BACKEND_API_URL}/api/v1/resumes/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: backendFormData
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to process resume', 500),
        { status: response.status }
      )
    }

    const data = await response.json()

    // Track usage if AI analysis was used
    if (enableAIAnalysis && subscription) {
      await fetch(`${new URL(request.url).origin}/api/v1/subscriptions/usage`, {
        method: 'POST',
        headers: {
          'Authorization': request.headers.get('authorization') || '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          feature_name: 'resume_analysis',
          usage_increment: 1,
          metadata: {
            filename: file.name,
            file_size: file.size,
            analysis_type: 'full'
          }
        })
      })
    }
    
    return NextResponse.json(
      createSuccessResponse(data, 'Resume uploaded and processing initiated'),
      { status: 201 }
    )

  } catch (error) {
    console.error('Resume upload error:', error)
    return handleApiError(error)
  }
} 
// Next.js API route for resume analysis
// Location: app/api/v1/resumes/[id]/analysis/route.ts
// Handles AI-powered resume analysis and insights
// High Priority Fix: Advanced resume analysis capabilities

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError 
} from '@/lib/api-response'
import type { Database } from '@/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

type ResumeChunk = Database['public']['Tables']['resume_chunks']['Row'];
type Skill = Database['public']['Tables']['skills_mapping']['Row'];

interface AnalysisData {
  resume_id: string;
  filename: string | null;
  analysis_status: string | null;
  analysis_results: unknown; // Keeping this as unknown for now as the shape is unknown
  chunks: ResumeChunk[];
  skills: Skill[];
  created_at: string | null;
  updated_at: string | null;
  insights?: {
    total_skills_found: number;
    skills_by_category: Record<string, Skill[]>;
    top_skills: Skill[];
    skill_categories: string[];
  };
  content_analysis?: {
    total_chunks: number;
    sections_identified: (string | null)[];
    total_content_length: number;
  };
}

// GET /api/v1/resumes/[id]/analysis - Get resume analysis results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const resumeId = params.id
    
    if (!resumeId) {
      return NextResponse.json(
        createErrorResponse('Resume ID is required', 400),
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

    // Get resume with analysis data
    const { data: resume, error } = await supabase
      .from('resumes')
      .select(`
        id,
        filename,
        analysis_status,
        analysis_results,
        created_at,
        updated_at,
        resume_chunks(*),
        skills_mapping(*)
      `)
      .eq('id', resumeId)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          createErrorResponse('Resume not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      console.error('Error fetching resume analysis:', error)
      return NextResponse.json(
        createErrorResponse('Failed to fetch resume analysis', 500),
        { status: 500 }
      )
    }

    // If analysis is not complete, check backend for updates
    if (resume.analysis_status !== 'completed') {
      try {
        const response = await fetch(`${BACKEND_API_URL}/api/v1/resumes/${resumeId}/analysis`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        })

        if (response.ok) {
          const backendData = await response.json()
          // Update local database with latest analysis
          if (backendData.analysis_status !== resume.analysis_status) {
            await supabase
              .from('resumes')
              .update({
                analysis_status: backendData.analysis_status,
                analysis_results: backendData.analysis_results,
                updated_at: new Date().toISOString()
              })
              .eq('id', resumeId)

            resume.analysis_status = backendData.analysis_status
            resume.analysis_results = backendData.analysis_results
          }
        }
      } catch (backendError) {
        console.warn('Failed to fetch updated analysis from backend:', backendError)
      }
    }

    // Process and enhance analysis data
    const analysisData: AnalysisData = {
      resume_id: resume.id,
      filename: resume.filename,
      analysis_status: resume.analysis_status,
      analysis_results: resume.analysis_results,
      chunks: (resume.resume_chunks as unknown as ResumeChunk[]) || [],
      skills: (resume.skills_mapping as unknown as Skill[]) || [],
      created_at: resume.created_at,
      updated_at: resume.updated_at
    }

    // Add computed insights
    if (analysisData.skills && analysisData.skills.length > 0) {
      const skillsByCategory = analysisData.skills.reduce((acc: Record<string, Skill[]>, skill) => {
        const category = skill.skill_category || 'Other'
        if (!acc[category]) acc[category] = []
        acc[category].push(skill)
        return acc
      }, {})

      const topSkills = [...analysisData.skills]
        .sort((a, b) => (b.confidence_score || 0) - (a.confidence_score || 0))
        .slice(0, 10)

      analysisData.insights = {
        total_skills_found: analysisData.skills.length,
        skills_by_category: skillsByCategory,
        top_skills: topSkills,
        skill_categories: Object.keys(skillsByCategory)
      }
    }

    if (analysisData.chunks && analysisData.chunks.length > 0) {
      analysisData.content_analysis = {
        total_chunks: analysisData.chunks.length,
        sections_identified: analysisData.chunks.map(chunk => chunk.section_type).filter(Boolean),
        total_content_length: analysisData.chunks.reduce((sum, chunk) => sum + (chunk.content?.length || 0), 0)
      }
    }
    
    return NextResponse.json(
      createSuccessResponse(analysisData, 'Resume analysis retrieved successfully')
    )

  } catch (error) {
    console.error('Resume analysis fetch error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/resumes/[id]/analysis - Trigger resume analysis
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const resumeId = params.id
    
    if (!resumeId) {
      return NextResponse.json(
        createErrorResponse('Resume ID is required', 400),
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

    const body = await request.json()
    const { analysis_type = 'full', extract_skills = true, generate_chunks = true } = body

    // Verify resume exists and belongs to user
    const { data: resume, error: fetchError } = await supabase
      .from('resumes')
      .select('id, filename, analysis_status')
      .eq('id', resumeId)
      .eq('user_id', session.user.id)
      .single()

    if (fetchError || !resume) {
      return NextResponse.json(
        createErrorResponse('Resume not found', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    // Check subscription limits
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

    if (!subscription) {
      return NextResponse.json(
        createErrorResponse('Resume analysis requires an active subscription', 'SUBSCRIPTION_REQUIRED'),
        { status: 402 }
      )
    }

    // Check if already processing
    if (resume.analysis_status === 'processing') {
      return NextResponse.json(
        createErrorResponse('Resume analysis already in progress', 'CONFLICT'),
        { status: 409 }
      )
    }

    // Update status to processing
    await supabase
      .from('resumes')
      .update({
        analysis_status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', resumeId)

    // Trigger backend analysis
    const analysisRequest = {
      resume_id: resumeId,
      user_id: session.user.id,
      analysis_type,
      extract_skills,
      generate_chunks,
      subscription_tier: subscription.tier_name
    }

    const response = await fetch(`${BACKEND_API_URL}/api/v1/resumes/${resumeId}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(analysisRequest)
    })

    if (!response.ok) {
      // Reset status on failure
      await supabase
        .from('resumes')
        .update({
          analysis_status: 'failed',
          updated_at: new Date().toISOString()
        })
        .eq('id', resumeId)

      const errorData = await response.json().catch(() => ({ error: 'Backend service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to start resume analysis', 500),
        { status: response.status }
      )
    }

    const data = await response.json()

    // Track usage
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
          resume_id: resumeId,
          analysis_type,
          filename: resume.filename
        }
      })
    })
    
    return NextResponse.json(
      createSuccessResponse(data, 'Resume analysis started successfully'),
      { status: 202 }
    )

  } catch (error) {
    console.error('Resume analysis trigger error:', error)
    return handleApiError(error)
  }
}
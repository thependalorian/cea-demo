// Next.js API route for MOS skills mapping
// Location: app/api/tools/veteran-mos/skills/route.ts
// Handles detailed military skills to civilian skills mapping
// High Priority Fix: Military skills translation capabilities

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

// POST /api/tools/veteran-mos/skills - Map military skills to civilian equivalents
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
    const { 
      military_skills, 
      mos_code, 
      branch_of_service, 
      target_industries = [], 
      skill_level = 'intermediate',
      include_certifications = true 
    } = body

    // Validation
    if (!military_skills || !Array.isArray(military_skills) || military_skills.length === 0) {
      return NextResponse.json(
        createErrorResponse('Military skills array is required', 400),
        { status: 400 }
      )
    }

    // Get user profile for enhanced matching
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select(`
        military_service,
        experience_level,
        climate_interests,
        desired_roles,
        skills
      `)
      .eq('id', session.user.id)
      .single()

    // Enhanced skills mapping request
    const skillsRequest = {
      military_skills,
      mos_code,
      branch_of_service,
      target_industries,
      skill_level,
      include_certifications,
      user_context: userProfile,
      user_id: session.user.id,
      mapping_type: 'detailed',
      timestamp: new Date().toISOString()
    }

    // Proxy to backend skills mapping service
    const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/veteran-mos/skills-mapping`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(skillsRequest)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Skills mapping service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to map military skills', 500),
        { status: response.status }
      )
    }

    const data = await response.json()

    // Store skills mapping for user profile enhancement
    if (data.mapped_skills && data.mapped_skills.length > 0) {
              const skillsData = data.mapped_skills.map((skill: unknown) => ({
          user_id: session.user.id,
          skill_name: (skill as Record<string, unknown>).civilian_skill as string,
          skill_category: ((skill as Record<string, unknown>).category as string) || 'General',
          confidence_score: ((skill as Record<string, unknown>).confidence as number) || 0.8,
          context: `Mapped from military skill: ${(skill as Record<string, unknown>).military_skill as string}`,
          source: 'mos_translation',
          created_at: new Date().toISOString()
        }))

      // Insert mapped skills (ignore duplicates)
      await supabase
        .from('skills_mapping')
        .upsert(skillsData, { 
          onConflict: 'user_id,skill_name',
          ignoreDuplicates: false 
        })
    }

    // Log the skills mapping for analytics
    await supabase
      .from('user_activities')
      .insert({
        id: crypto.randomUUID(),
        user_id: session.user.id,
        activity_type: 'skills_mapping',
        details: {
          skills_count: military_skills.length,
          mapped_count: data.mapped_skills.length // Assuming data.mapped_skills is available here
        },
        created_at: new Date().toISOString()
      })
    
    return NextResponse.json(
      createSuccessResponse(data, 'Military skills mapped successfully')
    )

  } catch (error: unknown) {
    console.error('Military skills mapping error:', error)
    return handleApiError(error)
  }
}

// GET /api/tools/veteran-mos/skills - Get skills mapping suggestions
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

    const skill = searchParams.get('skill')
    const mosCode = searchParams.get('mos_code')
    const branch = searchParams.get('branch')
    const industry = searchParams.get('industry')
    const limit = parseInt(searchParams.get('limit') || '20')

    // Build query parameters for backend
    const params = new URLSearchParams()
    if (skill) params.append('skill', skill)
    if (mosCode) params.append('mos_code', mosCode)
    if (branch) params.append('branch', branch)
    if (industry) params.append('industry', industry)
    params.append('limit', limit.toString())
    params.append('user_id', session.user.id)

    // Get skills suggestions from backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/veteran-mos/skills-suggestions?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Skills suggestions service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to get skills suggestions', 500),
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(
      createSuccessResponse(data, 'Skills suggestions retrieved successfully')
    )

  } catch (error: unknown) {
    console.error('Skills suggestions error:', error)
    return handleApiError(error)
  }
}
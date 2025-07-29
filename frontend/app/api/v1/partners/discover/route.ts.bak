// Next.js API route for partner discovery
// Location: app/api/v1/partners/discover/route.ts
// Handles partner organization discovery and browsing
// Final Phase: Partner Discovery (Backend complete -> Frontend accessible)

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

type Partner = Database['public']['Tables']['partner_profiles']['Row'];

interface EnhancedPartner extends Partner {
  compatibility_score: number;
  active_job_count: number;
  interaction_data: {
    views: number;
    applications_sent: number;
    response_rate: number | null;
  };
  quick_stats: {
    employees_range: string;
    founded_year: number | null;
    website_status: string;
  };
}

// GET /api/v1/partners/discover - Discover partner organizations
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

    // Extract search and filter parameters
    const organizationType = searchParams.get('organization_type')
    const climateFocus = searchParams.get('climate_focus')
    const location = searchParams.get('location')
    const hiringActively = searchParams.get('hiring_actively')
    const verifiedOnly = searchParams.get('verified_only') === 'true'
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    const search = searchParams.get('search')

    // Get user profile for personalized matching
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select('climate_interests, experience_level, preferred_locations, desired_roles')
      .eq('id', session.user.id)
      .single()

    // Build backend request parameters
    const params = new URLSearchParams()
    if (organizationType) params.append('organization_type', organizationType)
    if (climateFocus) params.append('climate_focus', climateFocus)
    if (location) params.append('location', location)
    if (hiringActively) params.append('hiring_actively', hiringActively)
    if (verifiedOnly) params.append('verified_only', 'true')
    params.append('limit', limit.toString())
    params.append('offset', offset.toString())

    // Get partners from backend profiles endpoint
    const response = await fetch(`${BACKEND_API_URL}/api/v1/profiles/partners?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Partner discovery service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to discover partners', 500),
        { status: response.status }
      )
    }

    const partnersData: { partners: Partner[] } = await response.json()

    // Enhance partner data with matching scores and additional info
    const enhancedPartners: EnhancedPartner[] = await Promise.all(
      (partnersData.partners || []).map(async (partner) => {
        // Calculate compatibility score based on user profile
        let compatibilityScore = 0
        
        if (userProfile) {
          // Climate focus alignment
          if (userProfile.climate_interests && Array.isArray(userProfile.climate_interests) && partner.climate_focus && Array.isArray(partner.climate_focus)) {
            const commonInterests = userProfile.climate_interests.filter((interest: string) =>
              (partner.climate_focus as string[]).includes(interest)
            )
            compatibilityScore += userProfile.climate_interests.length > 0 ? (commonInterests.length / userProfile.climate_interests.length) * 40 : 0;
          }

          // Location preference alignment
          if (userProfile.preferred_locations && Array.isArray(userProfile.preferred_locations) && partner.location) {
            const locationMatch = userProfile.preferred_locations.some((loc: string) =>
              partner.location!.toLowerCase().includes(loc.toLowerCase())
            )
            if (locationMatch) compatibilityScore += 20
          }

          // Experience level alignment
          if (partner.hiring_experience_levels && Array.isArray(partner.hiring_experience_levels) && userProfile.experience_level) {
            if (partner.hiring_experience_levels.includes(userProfile.experience_level)) {
              compatibilityScore += 25
            }
          }

          // Base score for verified partners
          if (partner.verified) compatibilityScore += 15
        }

        // Get active job listings count for this partner
        const { count } = await supabase
          .from('job_listings')
          .select('id', { count: 'exact', head: true })
          .eq('partner_id', partner.id)
          .eq('status', 'active')

        return {
          ...partner,
          compatibility_score: Math.round(compatibilityScore),
          active_job_count: count || 0,
          interaction_data: {
            views: 0, // Would come from analytics in real implementation
            applications_sent: 0,
            response_rate: null
          },
          quick_stats: {
            employees_range: partner.employees_count || 'Not specified',
            founded_year: partner.founded_year,
            website_status: partner.website ? 'available' : 'not_provided'
          }
        }
      })
    )

    // Apply text search filter if provided
    let filteredPartners = enhancedPartners
    if (search) {
      const searchLower = search.toLowerCase()
      filteredPartners = enhancedPartners.filter((partner) =>
        partner.organization_name?.toLowerCase().includes(searchLower) ||
        partner.description?.toLowerCase().includes(searchLower) ||
        (Array.isArray(partner.climate_focus) && partner.climate_focus.some((focus: string) => focus.toLowerCase().includes(searchLower)))
      )
    }

    // Sort by compatibility score and verification status
    filteredPartners.sort((a, b) => {
      if (b.verified !== a.verified) {
        return (b.verified ? 1 : 0) - (a.verified ? 1 : 0);
      }
      return (b.compatibility_score || 0) - (a.compatibility_score || 0)
    })

    // Log discovery activity
    // await supabase
    //   .from('user_activities')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     user_id: session.user.id,
    //     activity_type: 'partner_discovery',
    //     details: {
    //       partners_found: filteredPartners.length,
    //       filters_applied: {
    //         organization_type: organizationType,
    //         climate_focus: climateFocus,
    //         location,
    //         search
    //       }
    //     },
    //     created_at: new Date().toISOString()
    //   })

    const responseData = {
      partners: filteredPartners,
      total_count: filteredPartners.length,
      pagination: {
        limit,
        offset,
        has_more: filteredPartners.length === limit
      },
      filters_applied: {
        organization_type: organizationType,
        climate_focus: climateFocus,
        location,
        verified_only: verifiedOnly,
        hiring_actively: hiringActively,
        search
      },
      user_profile_match: Boolean(userProfile)
    }

    return NextResponse.json(
      createSuccessResponse(responseData, 'Partners discovered successfully')
    )
  } catch (error) {
    console.error('Partner discovery error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/partners/discover - Advanced partner matching
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
      preferences = {}, 
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      include_job_listings = true,
      matching_algorithm = 'comprehensive' 
    } = body

    // Get user profile for context
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    if (!userProfile) {
      return NextResponse.json(
        createErrorResponse('User profile required for advanced matching', 'PROFILE_REQUIRED'),
        { status: 400 }
      )
    }

    // Use backend partner matching if available
    try {
      const response = await fetch(`${BACKEND_API_URL}/api/v1/individual-tools/partner-search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'CEA-Frontend/1.0'
        },
        body: JSON.stringify({
          parameters: {
            organization_type: preferences.organization_type,
            climate_focus: preferences.climate_focus,
            user_profile: userProfile
          }
        })
      })

      if (response.ok) {
        const backendData = await response.json()
        
        // Log advanced matching usage
        await supabase
          // .from('user_activities')
          .insert({
            id: crypto.randomUUID(),
            user_id: session.user.id,
            activity_type: 'advanced_partner_matching',
            details: {
              algorithm: matching_algorithm,
              matches_found: backendData.result?.partners?.length || 0,
              preferences
            },
            created_at: new Date().toISOString()
          })

        return NextResponse.json(
          createSuccessResponse(backendData.result, 'Advanced partner matching completed')
        )
      }
    } catch (backendError) {
      console.warn('Backend matching unavailable, using fallback:', backendError)
    }

    // Fallback: Basic partner matching using direct database queries
    let query = supabase
      .from('partner_profiles')
      .select('*')
      .eq('verified', true)

    // Apply preferences
    if (preferences.organization_type) {
      query = query.eq('organization_type', preferences.organization_type)
    }
    if (preferences.climate_focus) {
      query = query.overlaps('climate_focus', [preferences.climate_focus])
    }
    if (preferences.location) {
      query = query.ilike('location', `%${preferences.location}%`)
    }

    const { data: partners, error } = await query.limit(50)

    if (error) {
      return NextResponse.json(
        createErrorResponse('Failed to query partners', 500),
        { status: 500 }
      )
    }

    const fallbackResult = {
      partners: partners || [],
      matching_algorithm: 'basic_fallback',
      total_matches: partners?.length || 0
    }
    
    return NextResponse.json(
      createSuccessResponse(fallbackResult, 'Basic partner matching completed')
    )

  } catch (error) {
    console.error('Advanced partner matching error:', error)
    return handleApiError(error)
  }
}
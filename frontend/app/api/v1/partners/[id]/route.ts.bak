// Next.js API route for individual partner details
// Location: app/api/v1/partners/[id]/route.ts
// Handles specific partner organization information and job listings
// Final Phase: Individual partner showcase

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

interface CompatibilityDetails {
  climate_alignment?: { score: number; common_interests: string[]; total_user_interests: number };
  location_match?: boolean;
  experience_match?: boolean;
  verification_bonus?: boolean;
}

// GET /api/v1/partners/[id] - Get specific partner details
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createServerClient()
    const partnerId = params.id
    
    if (!partnerId) {
      return NextResponse.json(
        createErrorResponse('Partner ID is required', 400),
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

    const { searchParams } = new URL(request.url)
    const includeJobs = searchParams.get('include_jobs') !== 'false' // Default true
    const includeAnalytics = searchParams.get('include_analytics') === 'true'

    // Get partner details directly from database
    const { data: partner, error: partnerError } = await supabase
      .from('partner_profiles')
      .select('*')
      .eq('id', partnerId)
      .single()

    if (partnerError) {
      if (partnerError.code === 'PGRST116') {
        return NextResponse.json(
          createErrorResponse('Partner not found', 'NOT_FOUND'),
          { status: 404 }
        )
      }
      console.error('Error fetching partner:', partnerError)
      return NextResponse.json(
        createErrorResponse('Failed to fetch partner details', 500),
        { status: 500 }
      )
    }

    // Get user profile for compatibility calculation
    const { data: userProfile } = await supabase
      .from('consolidated_profiles')
      .select('climate_interests, experience_level, preferred_locations, desired_roles')
      .eq('id', session.user.id)
      .single()

    // Calculate compatibility score
    let compatibilityScore = 0
    const compatibilityDetails: CompatibilityDetails = {}

    if (userProfile && partner) {
      // Climate focus alignment
      if (userProfile.climate_interests && Array.isArray(userProfile.climate_interests) && partner.climate_focus && Array.isArray(partner.climate_focus)) {
        const commonInterests = userProfile.climate_interests.filter((interest: string) =>
          (partner.climate_focus as string[]).includes(interest)
        )
        const climateFocusScore = userProfile.climate_interests.length > 0 ? (commonInterests.length / userProfile.climate_interests.length) * 40 : 0;
        compatibilityScore += climateFocusScore
        compatibilityDetails.climate_alignment = {
          score: Math.round(climateFocusScore),
          common_interests: commonInterests,
          total_user_interests: userProfile.climate_interests.length
        }
      }

      // Location preference alignment
      if (userProfile.preferred_locations && Array.isArray(userProfile.preferred_locations) && partner.location) {
        const locationMatch = userProfile.preferred_locations.some((loc: string) =>
          partner.location!.toLowerCase().includes(loc.toLowerCase())
        )
        if (locationMatch) {
          compatibilityScore += 25
          compatibilityDetails.location_match = true
        } else {
          compatibilityDetails.location_match = false
        }
      }

      // Experience level alignment
      if (partner.hiring_experience_levels && Array.isArray(partner.hiring_experience_levels) && userProfile.experience_level) {
        if (partner.hiring_experience_levels.includes(userProfile.experience_level)) {
          compatibilityScore += 20
          compatibilityDetails.experience_match = true
        } else {
          compatibilityDetails.experience_match = false
        }
      }

      // Verification bonus
      if (partner.verified) {
        compatibilityScore += 15
        compatibilityDetails.verification_bonus = true
      }
    }

    // Get job listings if requested
    let jobListings: Database['public']['Tables']['job_listings']['Row'][] = []
    let jobStats = {}
    
    if (includeJobs) {
      const { data: jobs, error: jobsError } = await supabase
        .from('job_listings')
        .select(`
          id,
          title,
          description,
          location,
          employment_type,
          experience_level,
          salary_range_min,
          salary_range_max,
          climate_keywords,
          posted_date,
          application_deadline,
          status
        `)
        .eq('partner_id', partnerId)
        .eq('status', 'active')
        .order('posted_date', { ascending: false })

      if (!jobsError && jobs) {
        jobListings = jobs;
        
        // Calculate job statistics
        const validSalariesMin = jobListings.map(job => job.salary_range_min).filter(s => s !== null) as number[];
        const validSalariesMax = jobListings.map(job => job.salary_range_max).filter(s => s !== null) as number[];

        jobStats = {
          total_active_jobs: jobListings.length,
          experience_levels: [...new Set(jobListings.map(job => job.experience_level).filter(Boolean))],
          employment_types: [...new Set(jobListings.map(job => job.employment_type).filter(Boolean))],
          locations: [...new Set(jobListings.map(job => job.location).filter(Boolean))],
          salary_range: {
            min: validSalariesMin.length > 0 ? Math.min(...validSalariesMin) : null,
            max: validSalariesMax.length > 0 ? Math.max(...validSalariesMax) : null
          }
        }
      }
    }

    // Get analytics data if requested
    let analyticsData = {}
    
    if (includeAnalytics) {
      // Get partner activity metrics
      const { data: partnerActivities } = await supabase
        .from('partner_activities')
        .select('activity_type, created_at')
        .eq('partner_id', partnerId)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days

      // Get application statistics
      const { data: applications } = await supabase
        // .from('job_applications')
        .select('status, created_at')
        .in('job_listing_id', jobListings.map(job => job.id))

      analyticsData = {
        recent_activity_count: partnerActivities?.length || 0,
        application_stats: {
          total_applications: applications?.length || 0,
          applications_by_status: applications?.reduce((acc: Record<string, number>, app) => {
            if(app.status) acc[app.status] = (acc[app.status] || 0) + 1
            return acc
          }, {}) || {}
        },
        profile_views: 0, // Would be tracked in real implementation
        last_active: partner.updated_at
      }
    }

    // Prepare enhanced partner data
    const enhancedPartner = {
      ...partner,
      compatibility_score: Math.round(compatibilityScore),
      compatibility_details: compatibilityDetails,
      job_listings: jobListings,
      job_statistics: jobStats,
      ...(includeAnalytics && { analytics: analyticsData }),
      social_links: {
        website: partner.website,
        linkedin: partner.linkedin_url,
        twitter: partner.twitter_url
      },
      contact_info: {
        email: partner.contact_email,
        phone: partner.contact_phone,
        address: partner.office_address
      }
    }

    // Log partner view
    // await supabase
    //   .from('user_activities')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     user_id: session.user.id,
    //     activity_type: 'partner_viewed',
    //     details: {
    //       partner_id: partnerId,
    //       organization_name: partner.organization_name,
    //       compatibility_score: Math.round(compatibilityScore),
    //       jobs_available: jobListings.length
    //     },
    //     created_at: new Date().toISOString()
    //   })

    // Track partner activity (partner profile views)
    // await supabase
    //   .from('partner_activities')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     partner_id: partnerId,
    //     activity_type: 'profile_viewed',
    //     details: {
    //       viewer_user_id: session.user.id,
    //       compatibility_score: Math.round(compatibilityScore)
    //     },
    //     created_at: new Date().toISOString()
    //   })

    return NextResponse.json(
      createSuccessResponse(enhancedPartner, 'Partner details retrieved successfully')
    )
  } catch (error) {
    console.error('Partner details fetch error:', error)
    return handleApiError(error)
  }
}
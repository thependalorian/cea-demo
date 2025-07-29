// Next.js API route for job listings
// Location: app/api/v1/job-listings/route.ts
// Handles GET requests for job listings with standardized responses
//
// NOTE: Requires 'target': 'es2015' or higher in tsconfig.json for Set iteration to work.

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError,
  createPagination 
} from '@/lib/api-response'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Get search parameters
    const { searchParams } = new URL(request.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 50) // Cap at 50
    const offset = Math.max(parseInt(searchParams.get('offset') || '0'), 0)
    const active_only = searchParams.get('active') !== 'false' // Default to active jobs only
    const location = searchParams.get('location')
    const experience_level = searchParams.get('experience_level')
    const climate_focus = searchParams.get('climate_focus')
    const search = searchParams.get('search') // Add search functionality
    
    // Build query with proper column selection
    let query = supabase
      .from('job_listings')
      .select(`
        id,
        title,
        description,
        location,
        salary_range,
        employment_type,
        experience_level,
        requirements,
        responsibilities,
        benefits,
        skills_required,
        climate_focus,
        application_url,
        application_email,
        expires_at,
        payment_status,
        created_at,
        updated_at,
        partner_id,
        is_active
      `)
      .eq('is_active', active_only)
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (location) {
      query = query.ilike('location', `%${location}%`)
    }
    if (experience_level) {
      query = query.eq('experience_level', experience_level)
    }
    if (climate_focus) {
      query = query.contains('climate_focus', [climate_focus])
    }
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }
    
    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('job_listings')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', active_only)
    
    if (countError) {
      console.error('Error getting job count:', countError)
      return NextResponse.json(
        createErrorResponse('Failed to get job count', countError.message),
        { status: 500 }
      )
    }
    
    // Apply pagination
    query = query.range(offset, offset + limit - 1)
    
    const { data: jobs, error } = await query
    
    if (error) {
      console.error('Error fetching jobs:', error)
      return NextResponse.json(
        createErrorResponse('Failed to fetch jobs', error.message),
        { status: 500 }
      )
    }
    
    // Get partner information for company names efficiently
    const partnerIds = [...new Set((jobs || []).map(job => job.partner_id).filter(Boolean))]
    let partners = {}
    
    if (partnerIds.length > 0) {
      const { data: partnerData, error: partnerError } = await supabase
        .from('partner_profiles')
        .select('id, organization_name')
        .in('id', partnerIds)
      
      if (partnerError) {
        console.warn('Error fetching partner data:', partnerError)
        // Continue without partner data rather than failing
      } else {
        partners = (partnerData || []).reduce((acc, partner) => {
          acc[partner.id] = partner.organization_name
          return acc
        }, {})
      }
    }
    
    // Transform data to match expected format with null safety
    const transformedJobs = (jobs || []).map(job => ({
      id: job.id,
      title: job.title || 'Untitled Position',
      company: partners[job.partner_id] || 'Climate Company',
      location: job.location || 'Remote',
      salary_range: job.salary_range || 'Competitive',
      employment_type: job.employment_type || 'Full-time',
      experience_level: job.experience_level || 'Mid-level',
      description: job.description || 'No description available',
      requirements: job.requirements || '',
      skills_required: job.skills_required || [],
      climate_focus: job.climate_focus || [],
      application_url: job.application_url || '#',
      responsibilities: job.responsibilities || '',
      benefits: job.benefits || '',
      application_email: job.application_email || null,
      expires_at: job.expires_at || null,
      payment_status: job.payment_status || 'pending',
      created_at: job.created_at,
      updated_at: job.updated_at,
      is_active: job.is_active,
      is_saved: false // Will be determined by saved jobs on frontend
    }))
    
    const pagination = createPagination(limit, offset, totalCount || 0)
    
    return NextResponse.json(
      createSuccessResponse(
        transformedJobs,
        `Found ${transformedJobs.length} job listings`,
        pagination
      )
    )
    
  } catch (error) {
    console.error('Job listings API error:', error)
    return NextResponse.json(
      handleApiError(error),
      { status: 500 }
    )
  }
} 
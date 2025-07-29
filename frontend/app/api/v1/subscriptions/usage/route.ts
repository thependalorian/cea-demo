// Next.js API route for subscription usage tracking
// Location: app/api/v1/subscriptions/usage/route.ts
// Handles usage monitoring and limits enforcement
// High Priority Fix: Subscription usage management

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError 
} from '@/lib/api-response'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// GET /api/v1/subscriptions/usage - Get current usage statistics
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

    const featureName = searchParams.get('feature')
    const includeHistory = searchParams.get('include_history') === 'true'

    // Get user's active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        id,
        tier_name,
        status,
        subscription_features(*),
        subscription_usage(*)
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single()

    if (!subscription) {
      return NextResponse.json(
        createErrorResponse('No active subscription found', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    // Get current usage
    let usageQuery = supabase
      .from('subscription_usage')
      .select('*')
      .eq('subscription_id', subscription.id)

    if (featureName) {
      usageQuery = usageQuery.eq('feature_name', featureName)
    }

    const { data: usageData, error: usageError } = await usageQuery

    if (usageError) {
      console.error('Error fetching usage data:', usageError)
      return NextResponse.json(
        createErrorResponse('Failed to fetch usage data', 500),
        { status: 500 }
      )
    }

    // Calculate usage statistics
    const features = subscription.subscription_features || []
    const usage = usageData || []

    const usageStats = features.map(feature => {
      const featureUsage = usage.find(u => u.feature_name === feature.feature_name) || {
        usage_count: 0,
        last_reset_date: new Date().toISOString()
      }

      const utilizationPercentage = feature.feature_limit > 0 
        ? Math.round((featureUsage.usage_count / feature.feature_limit) * 100)
        : 0

      return {
        feature_name: feature.feature_name,
        current_usage: featureUsage.usage_count,
        limit: feature.feature_limit,
        remaining: Math.max(0, feature.feature_limit - featureUsage.usage_count),
        utilization_percentage: utilizationPercentage,
        is_enabled: feature.is_enabled,
        last_reset: featureUsage.last_reset_date,
        status: utilizationPercentage >= 100 ? 'limit_reached' : 
                utilizationPercentage >= 80 ? 'approaching_limit' : 'normal'
      }
    })

    // Get usage history if requested
    let usageHistory = null
    if (includeHistory) {
      const { data: historyData } = await supabase
        .from('subscription_usage')
        .select('*')
        .eq('subscription_id', subscription.id)
        .order('created_at', { ascending: false })
        .limit(30) // Last 30 records

      usageHistory = historyData
    }

    const response = {
      subscription_id: subscription.id,
      tier_name: subscription.tier_name,
      features: usageStats,
      ...(usageHistory && { usage_history: usageHistory })
    }
    
    return NextResponse.json(
      createSuccessResponse(response, 'Usage statistics retrieved successfully')
    )

  } catch (error) {
    console.error('Usage API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/subscriptions/usage - Track feature usage
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
    const { feature_name, usage_increment = 1, metadata = {} } = body

    if (!feature_name) {
      return NextResponse.json(
        createErrorResponse('Feature name is required', 400),
        { status: 400 }
      )
    }

    // Get user's active subscription
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select(`
        id,
        tier_name,
        status,
        subscription_features!inner(*)
      `)
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .eq('subscription_features.feature_name', feature_name)
      .single()

    if (!subscription) {
      return NextResponse.json(
        createErrorResponse('No active subscription found for this feature', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    const feature = subscription.subscription_features[0]
    
    if (!feature.is_enabled) {
      return NextResponse.json(
        createErrorResponse('Feature is not enabled for your subscription', 'FEATURE_DISABLED'),
        { status: 403 }
      )
    }

    // Get current usage
    const { data: currentUsage } = await supabase
      .from('subscription_usage')
      .select('*')
      .eq('subscription_id', subscription.id)
      .eq('feature_name', feature_name)
      .single()

    const currentCount = currentUsage?.usage_count || 0
    const newCount = currentCount + usage_increment

    // Check if usage would exceed limit
    if (feature.feature_limit > 0 && newCount > feature.feature_limit) {
      return NextResponse.json(
        createErrorResponse(
          `Usage limit exceeded. Current: ${currentCount}/${feature.feature_limit}`, 
          'USAGE_LIMIT_EXCEEDED'
        ),
        { status: 429 }
      )
    }

    // Update or create usage record
    const usageData = {
      subscription_id: subscription.id,
      user_id: session.user.id,
      feature_name,
      usage_count: newCount,
      metadata,
      updated_at: new Date().toISOString()
    }

    if (currentUsage) {
      // Update existing usage
      const { data: updatedUsage, error: updateError } = await supabase
        .from('subscription_usage')
        .update(usageData)
        .eq('id', currentUsage.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating usage:', updateError)
        return NextResponse.json(
          createErrorResponse('Failed to update usage', 500),
          { status: 500 }
        )
      }

      return NextResponse.json(
        createSuccessResponse(updatedUsage, 'Usage tracked successfully')
      )
    } else {
      // Create new usage record
      const { data: newUsage, error: createError } = await supabase
        .from('subscription_usage')
        .insert({
          ...usageData,
          last_reset_date: new Date().toISOString(),
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating usage record:', createError)
        return NextResponse.json(
          createErrorResponse('Failed to create usage record', 500),
          { status: 500 }
        )
      }

      return NextResponse.json(
        createSuccessResponse(newUsage, 'Usage tracking initialized'),
        { status: 201 }
      )
    }

  } catch (error) {
    console.error('Usage tracking error:', error)
    return handleApiError(error)
  }
} 
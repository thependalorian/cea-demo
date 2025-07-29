// Next.js API route for subscription management
// Location: app/api/v1/subscriptions/route.ts
// Handles comprehensive subscription operations
// High Priority Fix: Subscription Management (17% -> 100% coverage)

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError 
} from '@/lib/api-response'
import Stripe from 'stripe'
import { Database } from '@/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

// Initialize Stripe client with fallback for demo mode
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecretKey ? new Stripe(stripeSecretKey, {
  apiVersion: '2024-06-20'
}) : null;

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type SubscriptionFeature = Database['public']['Tables']['subscription_features']['Row'];

// GET /api/v1/subscriptions - Get user subscriptions
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

    const status = searchParams.get('status')

    // Get user subscriptions from database
    let query = supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_features(*),
        subscription_usage(*)
      `)
      .eq('user_id', session.user.id)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: subscriptions, error } = await query.order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching subscriptions:', error)
      return NextResponse.json(
        createErrorResponse('Failed to fetch subscriptions', 500),
        { status: 500 }
      )
    }

    // Enhance subscription data with Stripe information
    const enhancedSubscriptions = await Promise.all(
      (subscriptions || []).map(async (subscription) => {
        let stripeSubscription = null
        
        if (subscription.stripe_subscription_id && stripe) {
          try {
            stripeSubscription = await stripe.subscriptions.retrieve(subscription.stripe_subscription_id)
          } catch (stripeError) {
            console.warn(`Failed to fetch Stripe subscription ${subscription.stripe_subscription_id}:`, stripeError)
          }
        }

        return {
          ...subscription,
          stripe_data: stripeSubscription ? {
            current_period_start: new Date(stripeSubscription.current_period_start * 1000),
            current_period_end: new Date(stripeSubscription.current_period_end * 1000),
            cancel_at_period_end: stripeSubscription.cancel_at_period_end,
            billing_cycle_anchor: stripeSubscription.billing_cycle_anchor ? new Date(stripeSubscription.billing_cycle_anchor * 1000) : null
          } : null
        }
      })
    )

    return NextResponse.json(
      createSuccessResponse(enhancedSubscriptions, 'Subscriptions retrieved successfully')
    )

  } catch (error) {
    console.error('Subscriptions API error:', error)
    return handleApiError(error)
  }
}

// POST /api/v1/subscriptions - Create or update subscription
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
    const { subscription_type, stripe_subscription_id, tier_name, features } = body

    // Validation
    if (!subscription_type || !tier_name) {
      return NextResponse.json(
        createErrorResponse('Missing required fields: subscription_type, tier_name', 400),
        { status: 400 }
      )
    }

    // Get user profile to determine user type
    const { data: profile } = await supabase
      .from('consolidated_profiles')
      .select('profile_type, email')
      .eq('id', session.user.id)
      .single()

    if (!profile) {
      return NextResponse.json(
        createErrorResponse('User profile not found', 'NOT_FOUND'),
        { status: 404 }
      )
    }

    // Prepare subscription data
    const subscriptionData: Omit<Subscription, 'id'> = {
      user_id: session.user.id,
      subscription_type,
      tier_name,
      status: 'active',
      stripe_subscription_id,
      user_type: profile.profile_type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      billing_interval: null,
      cancel_at: null,
      canceled_at: null,
      currency: null,
      current_period_end: null,
      current_period_start: null,
      plan_id: null,
      price_in_cents: null,
      stripe_customer_id: null,
      trial_end: null,
      trial_start: null
    }

    // Check if user already has an active subscription
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('id, status')
      .eq('user_id', session.user.id)
      .eq('status', 'active')
      .single()

    let result

    if (existingSubscription) {
      // Update existing subscription
      result = await supabase
        .from('subscriptions')
        .update({
          subscription_type,
          tier_name,
          stripe_subscription_id,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingSubscription.id)
        .select()
        .single()
    } else {
      // Create new subscription
      result = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
        .single()
    }

    if (result.error) {
      console.error('Error managing subscription:', result.error)
      return NextResponse.json(
        createErrorResponse('Failed to manage subscription', 500),
        { status: 500 }
      )
    }

    // Create or update subscription features if provided
    if (features && result.data) {
      const featureData: Omit<SubscriptionFeature, 'id'>[] = features.map((feature: { name: string; limit: number; enabled: boolean; }) => ({
        subscription_id: result.data!.id,
        feature_name: feature.name,
        feature_limit: feature.limit,
        is_enabled: feature.enabled !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))

      // Delete existing features and insert new ones
      await supabase
        .from('subscription_features')
        .delete()
        .eq('subscription_id', result.data!.id)

      await supabase
        .from('subscription_features')
        .insert(featureData)
    }

    // Initialize usage tracking
    await supabase
      .from('subscription_usage')
      .upsert({
        subscription_id: result.data!.id,
        user_id: session.user.id,
        usage_count: 0,
        last_reset_date: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    return NextResponse.json(
      createSuccessResponse(result.data, 'Subscription managed successfully'),
      { status: existingSubscription ? 200 : 201 }
    )

  } catch (error) {
    console.error('Subscription creation error:', error)
    return handleApiError(error)
  }
}
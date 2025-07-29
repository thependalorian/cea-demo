/**
 * Stripe Webhook Handler for Climate Economy Assistant
 * Handles subscriptions for both job seekers and partners
 */

import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  getStripeClient, 
  getStripeWebhookSecret, 
  verifyWebhookSignature,
  WEBHOOK_EVENTS 
} from '@/lib/stripe-config';
import { Database } from '@/types/database';

// Initialize Supabase client
const getSupabase = (): SupabaseClient<Database> => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  return createClient<Database>(supabaseUrl, supabaseKey);
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const headersList = headers();
    const sig = headersList.get('stripe-signature');

    if (!sig) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      const endpointSecret = getStripeWebhookSecret();
      event = verifyWebhookSignature(body, sig, endpointSecret);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Webhook signature verification failed:', errorMessage);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const supabase = getSupabase();

    switch (event.type) {
      case WEBHOOK_EVENTS.CHECKOUT_SESSION_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.mode === 'payment') {
          await handleJobPostingPayment(session, supabase);
        } else if (session.mode === 'subscription') {
          await handleSubscriptionCreated(session, supabase);
        }
        break;
      }

      case WEBHOOK_EVENTS.INVOICE_PAYMENT_SUCCEEDED: {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice, supabase);
        break;
      }

      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_UPDATED: {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription, supabase);
        break;
      }

      case WEBHOOK_EVENTS.CUSTOMER_SUBSCRIPTION_DELETED: {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCanceled(subscription, supabase);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleJobPostingPayment(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient<Database>
) {
  const { metadata } = session;
  
  if (metadata?.type === 'job_posting') {
    const partnerId = metadata.partner_id;
    const jobListingId = metadata.job_listing_id;
    
    // Update job listing to active status
    const { error: jobError } = await supabase
      .from('job_listings')
      .update({
        is_active: true,
        payment_status: 'paid',
        stripe_payment_intent: session.payment_intent as string,
        updated_at: new Date().toISOString(),
      })
      .eq('id', jobListingId);

    if (jobError) {
      console.error('Error updating job listing:', jobError);
      return;
    }

    // Record payment transaction
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        id: crypto.randomUUID(),
        partner_id: partnerId,
        job_listing_id: jobListingId,
        stripe_session_id: session.id,
        amount: session.amount_total || 0,
        currency: session.currency || 'usd',
        status: 'completed',
        payment_type: 'job_posting',
        created_at: new Date().toISOString(),
      });

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
    }

    console.log(`Job posting payment completed for partner ${partnerId}`);
  }
}

async function handleSubscriptionCreated(
  session: Stripe.Checkout.Session,
  supabase: SupabaseClient<Database>
) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  
  // Get customer information and metadata
  const stripe = getStripeClient();
  const customer = await stripe.customers.retrieve(customerId);
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Extract metadata from subscription
  const userId = (customer as Stripe.Customer).metadata?.user_id;
  const userType = (customer as Stripe.Customer).metadata?.user_type || 
                  subscription.metadata?.user_type;
  const tier = subscription.metadata?.tier || 
              subscription.items.data[0]?.price.metadata?.tier;
  
  if (!userId) {
    console.error('No user ID found for customer:', customerId);
    return;
  }

  // Create subscription record
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .upsert({
      user_id: userId,
      stripe_subscription_id: subscriptionId,
      stripe_customer_id: customerId,
      plan_id: subscription.items.data[0]?.price.id || '',
      status: subscription.status,
      current_period_start: subscription.current_period_start ? 
        new Date(subscription.current_period_start * 1000).toISOString() : null,
      current_period_end: subscription.current_period_end ? 
        new Date(subscription.current_period_end * 1000).toISOString() : null,
      cancel_at: subscription.cancel_at ? 
        new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? 
        new Date(subscription.canceled_at * 1000).toISOString() : null,
      trial_start: subscription.trial_start ? 
        new Date(subscription.trial_start * 1000).toISOString() : null,
      trial_end: subscription.trial_end ? 
        new Date(subscription.trial_end * 1000).toISOString() : null,
      user_type: userType || 'job_seeker',
      tier: tier || 'pro',
      billing_interval: subscription.items.data[0]?.plan.interval || 'month',
      price_in_cents: subscription.items.data[0]?.price.unit_amount || 0,
      currency: subscription.currency || 'usd',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });

  if (subscriptionError) {
    console.error('Error creating subscription record:', subscriptionError);
    return;
  }

  // Get the subscription ID from the database
  const { data: subscriptionData } = await supabase
    .from('subscriptions')
    .select('id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();
  
  if (!subscriptionData) {
    console.error('Could not find subscription record for:', subscriptionId);
    return;
  }

  // Update consolidated_profiles with subscription information
  const { error: profileError } = await supabase
    .from('consolidated_profiles')
    .update({
      subscription_tier: tier || 'pro',
      subscription_status: subscription.status,
      subscription_id: subscriptionData.id,
      stripe_customer_id: customerId,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId);

  if (profileError) {
    console.error('Error updating profile with subscription info:', profileError);
  }

  // If this is a partner subscription, also update partner_subscriptions table
  if (userType === 'partner') {
    const { error: partnerSubError } = await supabase
      .from('partner_subscriptions')
      .upsert({
        id: crypto.randomUUID(),
        partner_id: userId,
        stripe_subscription_id: subscriptionId,
        stripe_customer_id: customerId,
        status: subscription.status,
        pricing_tier: tier || 'regular',
        current_period_start: subscription.current_period_start ? 
          new Date(subscription.current_period_start * 1000).toISOString() : null,
        current_period_end: subscription.current_period_end ? 
          new Date(subscription.current_period_end * 1000).toISOString() : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (partnerSubError) {
      console.error('Error updating partner subscription:', partnerSubError);
    }
    
    // Update early access slots if applicable
    if (tier === 'partner_early_access' || tier === 'early_access') {
      const { error: slotError } = await supabase.rpc('increment_early_access_slot_usage', {
        tier_id_param: 'partner_early_access'
      });
      
      if (slotError) {
        console.error('Error updating early access slots:', slotError);
      }
    }
  }

  console.log(`Subscription created for ${userType} ${userId}`);
}

async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  supabase: SupabaseClient<Database>
) {
  const subscriptionId = invoice.subscription as string;
  if (!subscriptionId) {
    console.error('No subscription ID found on invoice:', invoice.id);
    return;
  }
  
  // Get subscription details
  const stripe = getStripeClient();
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  
  // Update main subscriptions table
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: subscription.current_period_start ? 
        new Date(subscription.current_period_start * 1000).toISOString() : null,
      current_period_end: subscription.current_period_end ? 
        new Date(subscription.current_period_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (subError) {
    console.error('Error updating subscription:', subError);
  }
  
  // Get user info from subscription
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id, user_type')
    .eq('stripe_subscription_id', subscriptionId)
    .single();
  
  if (!subData) {
    console.error('Could not find subscription record for:', subscriptionId);
    return;
  }
  
  // Update consolidated_profiles
  const { error: profileError } = await supabase
    .from('consolidated_profiles')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', subData.user_id);

  if (profileError) {
    console.error('Error updating profile subscription status:', profileError);
  }
  
  // If partner subscription, update partner_subscriptions table
  if (subData.user_type === 'partner') {
  const { error } = await supabase
    .from('partner_subscriptions')
    .update({
      last_payment_date: new Date().toISOString(),
        status: subscription.status,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
      console.error('Error updating partner subscription payment:', error);
    }
  }

  console.log(`Payment succeeded for subscription ${subscriptionId}`);
}

async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  supabase: SupabaseClient<Database>
) {
  // Update main subscriptions table
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: subscription.current_period_start ? 
        new Date(subscription.current_period_start * 1000).toISOString() : null,
      current_period_end: subscription.current_period_end ? 
        new Date(subscription.current_period_end * 1000).toISOString() : null,
      cancel_at: subscription.cancel_at ? 
        new Date(subscription.cancel_at * 1000).toISOString() : null,
      canceled_at: subscription.canceled_at ? 
        new Date(subscription.canceled_at * 1000).toISOString() : null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (subError) {
    console.error('Error updating subscription:', subError);
  }
  
  // Get user info from subscription
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id, user_type')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (!subData) {
    console.error('Could not find subscription record for:', subscription.id);
    return;
  }
  
  // Update consolidated_profiles
  const { error: profileError } = await supabase
    .from('consolidated_profiles')
    .update({
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', subData.user_id);

  if (profileError) {
    console.error('Error updating profile subscription status:', profileError);
  }
  
  // If partner subscription, update partner_subscriptions table
  if (subData.user_type === 'partner') {
    const { error } = await supabase
      .from('partner_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: subscription.current_period_start ? 
          new Date(subscription.current_period_start * 1000).toISOString() : null,
        current_period_end: subscription.current_period_end ? 
          new Date(subscription.current_period_end * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
      console.error('Error updating partner subscription:', error);
    }
  }

  console.log(`Subscription updated: ${subscription.id}`);
}

async function handleSubscriptionCanceled(
  subscription: Stripe.Subscription,
  supabase: SupabaseClient<Database>
) {
  // Update main subscriptions table
  const { error: subError } = await supabase
    .from('subscriptions')
    .update({
      status: 'canceled',
      canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id);

  if (subError) {
    console.error('Error updating subscription:', subError);
  }
  
  // Get user info from subscription
  const { data: subData } = await supabase
    .from('subscriptions')
    .select('user_id, user_type')
    .eq('stripe_subscription_id', subscription.id)
    .single();
  
  if (!subData) {
    console.error('Could not find subscription record for:', subscription.id);
    return;
  }
  
  // Update consolidated_profiles
  const { error: profileError } = await supabase
    .from('consolidated_profiles')
    .update({
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('id', subData.user_id);

  if (profileError) {
    console.error('Error updating profile subscription status:', profileError);
  }
  
  // If partner subscription, update partner_subscriptions table
  if (subData.user_type === 'partner') {
    const { error } = await supabase
      .from('partner_subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
      console.error('Error canceling partner subscription:', error);
    }
  }

  console.log(`Subscription canceled: ${subscription.id}`);
}
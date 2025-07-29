import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

interface BookingPostBody {
  datetime: string;
  team_id?: string;
  agent_id?: string;
  duration_minutes?: number;
  note?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse request body
    const body: BookingPostBody = await request.json();
    
    // Validate required fields
    if (!body.datetime) {
      return NextResponse.json(
        { error: 'Date and time is required' },
        { status: 400 }
      );
    }
    
    if (!body.team_id && !body.agent_id) {
      return NextResponse.json(
        { error: 'Either team_id or agent_id must be provided' },
        { status: 400 }
      );
    }
    
    if (body.team_id && body.agent_id) {
      return NextResponse.json(
        { error: 'Only one of team_id or agent_id should be provided' },
        { status: 400 }
      );
    }
    
    // Prepare booking data
    const bookingData = {
      user_id: user.id,
      team_id: body.team_id || null,
      agent_id: body.agent_id || null,
      datetime: body.datetime,
      duration_minutes: body.duration_minutes || 30,
      note: body.note || null,
      status: 'pending' as const
    };
    
    // Insert booking into Supabase
    const { data, error } = await supabase
      .from('bookings')
      .insert(bookingData)
      .select()
      .single();
    
    if (error) {
      console.error('Booking creation error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data, { status: 201 });
    
  } catch (error: unknown) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to create booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });

    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    
    // Build query
    let query = supabase
      .from('bookings')
      .select('*')
      .eq('user_id', user.id);
    
    // Apply filters if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    if (fromDate) {
      query = query.gte('datetime', fromDate);
    }
    
    if (toDate) {
      query = query.lte('datetime', toDate);
    }
    
    // Execute query
    const { data, error } = await query.order('datetime', { ascending: true });
    
    if (error) {
      console.error('Booking fetch error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ bookings: data || [] });
    
  } catch (error: unknown) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookings';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
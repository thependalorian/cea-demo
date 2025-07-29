import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

// Define the shape of the data for updating a booking
interface BookingUpdateData {
  datetime?: string;
  duration_minutes?: number;
  note?: string;
  status?: 'cancelled';
}

// GET a specific booking
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Fetch booking
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();
    
    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error: unknown) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// UPDATE a booking
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
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
    const body = await request.json();
    
    // Verify booking exists and belongs to user
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }
    
    // Prepare update data
    const updateData: BookingUpdateData = {};
    
    if (body.datetime) {
      // Check if date is in the future
      const bookingDate = new Date(body.datetime);
      if (bookingDate <= new Date()) {
        return NextResponse.json(
          { error: 'Booking time must be in the future' },
          { status: 400 }
        );
      }
      updateData.datetime = body.datetime;
    }
    
    if (body.duration_minutes) {
      updateData.duration_minutes = body.duration_minutes;
    }
    
    if (body.note !== undefined) {
      updateData.note = body.note;
    }
    
    // Users can only cancel their bookings, not change to other statuses
    if (body.status) {
      if (body.status === 'cancelled') {
        updateData.status = 'cancelled';
      } else {
        return NextResponse.json(
          { error: 'Users can only cancel bookings, not change to other statuses' },
          { status: 403 }
        );
      }
    }
    
    // If no fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(existingBooking);
    }
    
    // Update booking
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(data);
    
  } catch (error: unknown) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE a booking
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id;
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get authenticated user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verify booking exists and belongs to user before deleting
    const { error: fetchError } = await supabase
      .from('bookings')
      .select('id')
      .eq('id', bookingId)
      .eq('user_id', user.id)
      .single();
    
    if (fetchError) {
      if (fetchError.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { error: fetchError.message },
        { status: 500 }
      );
    }
    
    // Delete booking
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId)
      .eq('user_id', user.id);
    
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return new NextResponse(null, { status: 204 });
    
  } catch (error: unknown) {
    console.error('Booking API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to delete booking';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
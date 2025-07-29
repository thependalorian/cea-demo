import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerComponentClient({ cookies });
    
    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get the new profile type from request body
    const { profile_type } = await request.json();
    
    // Validate profile type
    const validTypes = ['job_seeker', 'partner', 'admin'];
    if (!profile_type || !validTypes.includes(profile_type)) {
      return NextResponse.json(
        { error: 'Invalid profile type. Must be one of: job_seeker, partner, admin' },
        { status: 400 }
      );
    }

    // Call the database function to update profile type
    const { data, error } = await supabase
      .rpc('update_user_profile_type', {
        new_profile_type: profile_type
      });

    if (error) {
      console.error('Error updating profile type:', error);
      return NextResponse.json(
        { error: 'Failed to update profile type' },
        { status: 500 }
      );
    }

    // Parse the result
    const result = typeof data === 'string' ? JSON.parse(data) : data;
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to update profile type' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      profile_type: result.new_profile_type
    });

  } catch (error) {
    console.error('Exception in update profile type:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
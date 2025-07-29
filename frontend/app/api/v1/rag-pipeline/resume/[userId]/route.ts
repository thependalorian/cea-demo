// Next.js API route for getting user resume info
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase as createServerClient } from '@/lib/supabase-server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-utils';

// Set dynamic rendering for this route
export const dynamic = 'force-dynamic';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    const supabase = createServerClient();
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      );
    }
    
    // Check if user has permission to view this resume
    if (session.user.id !== userId) {
      // Check if user is admin or partner
      const { data: profile } = await supabase
        .from('consolidated_profiles')
        .select('profile_type')
        .eq('id', session.user.id)
        .single();
        
      if (!profile || !['admin', 'partner'].includes(profile.profile_type)) {
        return NextResponse.json(
          createErrorResponse('Not authorized to view this resume', 'FORBIDDEN'),
          { status: 403 }
        );
      }
    }
    
    // Forward to backend RAG pipeline API
    const response = await fetch(`${BACKEND_API_URL}/resume/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        createErrorResponse(error.detail || 'Failed to fetch resume', 500),
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(
      createSuccessResponse(result, 'Resume fetched successfully')
    );
    
  } catch (error) {
    console.error('Resume fetch error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch resume', 500),
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const resumeId = params.userId; // In this case, userId is actually resume_id
    const supabase = createServerClient();
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      );
    }
    
    // Forward to backend RAG pipeline API
    const response = await fetch(`${BACKEND_API_URL}/resume/${resumeId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        createErrorResponse(error.detail || 'Failed to delete resume', 500),
        { status: response.status }
      );
    }
    
    return NextResponse.json(
      createSuccessResponse({}, 'Resume deleted successfully')
    );
    
  } catch (error) {
    console.error('Resume deletion error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to delete resume', 500),
      { status: 500 }
    );
  }
} 
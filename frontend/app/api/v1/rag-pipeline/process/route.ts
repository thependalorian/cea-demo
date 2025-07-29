// Next.js API route for RAG pipeline processing
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase as createServerClient } from '@/lib/supabase-server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-utils';

// Set dynamic rendering for this route
export const dynamic = 'force-dynamic';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      );
    }
    
    // Check user permissions
    const { data: profile } = await supabase
      .from('consolidated_profiles')
      .select('profile_type')
      .eq('id', session.user.id)
      .single();
      
    if (!profile || !['admin', 'partner'].includes(profile.profile_type)) {
      return NextResponse.json(
        createErrorResponse('Insufficient permissions', 'FORBIDDEN'),
        { status: 403 }
      );
    }
    
    // Get form data
    const formData = await request.formData();
    
    // Forward to backend RAG pipeline API
    const response = await fetch(`${BACKEND_API_URL}/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        createErrorResponse(error.detail || 'Failed to process document', 500),
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(
      createSuccessResponse(result, 'Document processing started')
    );
    
  } catch (error) {
    console.error('RAG pipeline error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to process document', 500),
      { status: 500 }
    );
  }
} 
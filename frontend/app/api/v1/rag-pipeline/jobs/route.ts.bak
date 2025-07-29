// Next.js API route for RAG pipeline job status
import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase as createServerClient } from '@/lib/supabase-server';
import { createSuccessResponse, createErrorResponse } from '@/lib/api-utils';

// Set dynamic rendering for this route
export const dynamic = 'force-dynamic';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
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
    
    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = searchParams.get('limit') || '10';
    const offset = searchParams.get('offset') || '0';
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    if (status) queryParams.append('status', status);
    queryParams.append('limit', limit);
    queryParams.append('offset', offset);
    
    // Forward to backend RAG pipeline API
    const response = await fetch(
      `${BACKEND_API_URL}/jobs?${queryParams.toString()}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        }
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        createErrorResponse(error.detail || 'Failed to fetch jobs', 500),
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(
      createSuccessResponse(result, 'Jobs fetched successfully')
    );
    
  } catch (error) {
    console.error('RAG pipeline error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to fetch jobs', 500),
      { status: 500 }
    );
  }
} 
// Next.js API route for resume uploads
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
    
    // Get form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        createErrorResponse('No file provided', 400),
        { status: 400 }
      );
    }
    
    // Validate file type
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      return NextResponse.json(
        createErrorResponse('Only PDF files are accepted', 400),
        { status: 400 }
      );
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        createErrorResponse('File size cannot exceed 5MB', 400),
        { status: 400 }
      );
    }
    
    // Forward to backend RAG pipeline API
    const response = await fetch(`${BACKEND_API_URL}/resume/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      },
      body: formData
    });
    
    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        createErrorResponse(error.detail || 'Failed to upload resume', 500),
        { status: response.status }
      );
    }
    
    const result = await response.json();
    
    return NextResponse.json(
      createSuccessResponse(result, 'Resume upload started')
    );
    
  } catch (error) {
    console.error('Resume upload error:', error);
    return NextResponse.json(
      createErrorResponse('Failed to upload resume', 500),
      { status: 500 }
    );
  }
} 
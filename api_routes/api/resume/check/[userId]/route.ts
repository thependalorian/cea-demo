import { NextRequest, NextResponse } from 'next/server';

// Backend API configuration
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8002/api/resume/check';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;
    
    // Get authentication header
    const authHeader = request.headers.get('Authorization');
    
    // If no auth header, return error
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
    
    // Forward the request to the backend
    const response = await fetch(`${AGENT_API_URL}/${userId}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      },
    });
    
    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Resume check failed: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    // Return the response data
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Resume Check API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
import { NextRequest, NextResponse } from 'next/server';

// Backend API configuration
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8002/api/resume/search';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('query');
    const userId = searchParams.get('user_id');
    const limit = searchParams.get('limit') || '5';
    
    // Validate query
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }
    
    // Get authentication header
    const authHeader = request.headers.get('Authorization');
    
    // If no auth header, return error
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Unauthorized - Authentication required' },
        { status: 401 }
      );
    }
    
    // Construct backend URL with query parameters
    const backendUrl = new URL(AGENT_API_URL);
    backendUrl.searchParams.append('query', query);
    if (userId) backendUrl.searchParams.append('user_id', userId);
    backendUrl.searchParams.append('limit', limit);
    
    // Forward the request to the backend
    const response = await fetch(backendUrl.toString(), {
      method: 'GET',
      headers: {
        'Authorization': authHeader
      }
    });
    
    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Resume search failed: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }
    
    // Return the response data
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Resume Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
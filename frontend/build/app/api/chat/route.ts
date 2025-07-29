import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// Get agent endpoint from environment variables
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8002/api/pendo-agent';

export async function POST(request: NextRequest): Promise<Response> {
  try {
    // Parse the request body
    const body = await request.json();
    const { content, user_id, request_id, session_id, files } = body;
    
    // Get authentication headers
    const authHeader = request.headers.get('Authorization');
    const apiKey = request.headers.get('X-OpenAI-API-Key') || 
                  (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);
    
    // If no content is provided, return an error
    if (!content) {
      return NextResponse.json(
        { error: 'No message content provided' },
        { status: 400 }
      );
    }

    // Prepare the request to the agent API
    const requestData = {
      query: content,
      user_id: user_id || 'demo_user',
      request_id: request_id || randomUUID(),
      session_id: session_id || randomUUID(),
      files: files || []
    };

    // Set up headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add API key if available
    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Call the agent API
    const response = await fetch(AGENT_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
      // Pass timeout if supported
      ...(AbortSignal.timeout ? { signal: AbortSignal.timeout(60000) } : {})
    });

    // Handle streaming response if supported
    if (response.headers.get('content-type')?.includes('text/event-stream')) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    // Handle non-streaming response
    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Agent API error: ${response.status} - ${errorText}` },
        { status: response.status }
      ) as Response;
    }

    // Return the successful response
    const responseData = await response.json();
    return NextResponse.json(responseData) as Response;

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    ) as Response;
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8001/api/pendo-agent';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, user_id, request_id, session_id, files } = body;
    
    // Get API key from headers
    const authHeader = request.headers.get('Authorization');
    const apiKey = request.headers.get('X-OpenAI-API-Key') ||
                  (authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null);

    if (!message) {
      return NextResponse.json(
        { error: 'No message content provided' },
        { status: 400 }
      );
    }

    // Enhanced features - add context and capabilities flags
    const requestData = {
      query: message,
      user_id: user_id || 'demo_user',
      request_id: request_id || randomUUID(),
      session_id: session_id || randomUUID(),
      files: files || [],
      // Enhanced features
      enhanced: true,
      capabilities: {
        web_search: true,
        code_execution: true,
        data_analysis: true,
        voice_enabled: true
      },
      context: {
        location: 'Massachusetts',
        domain: 'climate_economy',
        previous_topics: []
      }
    };

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    const response = await fetch(AGENT_API_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify(requestData),
      ...(AbortSignal.timeout ? { signal: AbortSignal.timeout(60000) } : {})
    });

    // Handle streaming responses
    if (response.headers.get('content-type')?.includes('text/event-stream')) {
      return new Response(response.body, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive'
        }
      });
    }

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Agent API error: ${response.status} - ${errorText}` },
        { status: response.status }
      );
    }

    const responseData = await response.json();
    return NextResponse.json(responseData);

  } catch (error) {
    console.error('Enhanced Chat API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
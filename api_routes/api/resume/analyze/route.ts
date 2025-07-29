import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// Backend API configuration - support both options
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8002/api/pendo-agent';
const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8000/resume/upload';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const apiKey = formData.get('api_key') as string | null;
    const userId = formData.get('user_id') as string || 'demo_user';

    // Get the authorization header
    const authHeader = request.headers.get('Authorization');

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Check authentication
    if (!authHeader && !apiKey) {
      return NextResponse.json(
        { error: 'Unauthorized - Please provide your API key or login' },
        { status: 401 }
      );
    }

    // Validate file type
    const fileType = file.type;
    if (
      fileType !== 'application/pdf' && 
      fileType !== 'application/msword' && 
      fileType !== 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF or Word documents only.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const fileBuffer = await file.arrayBuffer();
    const fileBase64 = Buffer.from(fileBuffer).toString('base64');

    // Set up headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add authorization
    if (authHeader) {
      headers['Authorization'] = authHeader;
    } else if (apiKey) {
      headers['Authorization'] = `Bearer ${apiKey}`;
    }

    // Determine which API to use (try RAG API first)
    try {
      // Try to use the RAG API for direct file upload
      const ragFormData = new FormData();
      ragFormData.append('file', file);
      ragFormData.append('user_id', userId);
      
      const ragResponse = await fetch(`${RAG_API_URL}`, {
        method: 'POST',
        headers: {
          'Authorization': headers['Authorization']
        },
        body: ragFormData,
      });
      
      if (!ragResponse.ok) {
        const errorBody = await ragResponse.text();
        console.error('Resume API error response:', errorBody);
        throw new Error(`Resume upload failed: ${ragResponse.status} ${ragResponse.statusText}`);
      }
      
      const ragData = await ragResponse.json();
      return NextResponse.json(ragData);
    } catch (uploadError) {
      console.info('RAG API upload failed, falling back to agent API:', uploadError);
      
      // Fall back to the agent API with base64 encoding
      const requestData = {
        query: "Analyze this resume and extract all relevant information",
        user_id: userId,
        request_id: randomUUID(),
        session_id: randomUUID(),
        files: [
          {
            name: file.name,
            type: file.type,
            content: fileBase64
          }
        ]
      };
      
      const agentResponse = await fetch(AGENT_API_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData),
      });
      
      if (!agentResponse.ok) {
        const errorBody = await agentResponse.text();
        console.error('Resume API error response:', errorBody);
        return NextResponse.json(
          { error: `Resume analysis failed: ${agentResponse.status} ${agentResponse.statusText}` },
          { status: agentResponse.status }
        );
      }
      
      const agentData = await agentResponse.json();
      return NextResponse.json({
        status: "success",
        message: "Resume analyzed successfully",
        data: agentData
      });
    }
  } catch (error) {
    console.error('Resume Analysis API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
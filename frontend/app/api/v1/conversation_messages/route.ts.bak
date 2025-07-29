import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError 
} from '@/lib/api-response';
import type { Database } from '@/types/database';
import { randomUUID } from 'crypto';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse("Authentication required", 401),
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();

    // Validate required fields
    if (!body.conversation_id || !body.message) {
      return NextResponse.json(
        createErrorResponse("Missing required fields: conversation_id and message are required", 400),
        { status: 400 }
      );
    }

    // Create message ID if not provided
    const messageId = body.message_id || randomUUID();
    
    // Prepare the request body
    const messageData = {
      message_id: messageId,
      conversation_id: body.conversation_id,
      content: body.message,
      role: body.role || "user",
      metadata: body.metadata || {},
      user_id: session.user.id
    };

    // Send to backend API
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:8889";
    // Use endpoint without trailing slash to avoid redirects
    const response = await fetch(`${apiUrl}/api/v1/conversations/${body.conversation_id}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(messageData)
    });
    
    if (!response.ok) {
      return handleApiError(response);
    }
    
    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error("Error sending message:", error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      createErrorResponse(`Error sending message: ${message}`, 500),
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies });
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversationId = searchParams.get('conversation_id');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    if (conversationId) {
      // Verify the conversation belongs to the current user
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('id, user_id')
        .eq('id', conversationId)
        .eq('user_id', session.user.id)
        .single();

      if (convError || !conversation) {
        return NextResponse.json(
          createErrorResponse('Conversation not found or access denied', 403),
          { status: 404 }
        );
      }

      // Get messages for the conversation
      const { data: messages, error } = await supabase
        .from('conversation_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
          createErrorResponse('Failed to fetch messages', 500, error.message),
          { status: 500 }
        );
      }

      // Get total count for pagination
      const { count } = await supabase
        .from('conversation_messages')
        .select('*', { count: 'exact', head: true })
        .eq('conversation_id', conversationId);

      return NextResponse.json(
        createSuccessResponse(
          messages || [],
          'Messages retrieved successfully',
          {
            limit,
            offset,
            total: count || 0,
            hasMore: (count || 0) > offset + limit
          }
        )
      );
      
    } else {
      // Get all messages for user's conversations
      const { data: messages, error } = await supabase
        .from('conversation_messages')
        .select(`
          *,
          conversations!inner(user_id)
        `)
        .eq('conversations.user_id', session.user.id)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
          createErrorResponse('Failed to fetch messages', 500, error.message),
          { status: 500 }
        );
      }

      return NextResponse.json(
        createSuccessResponse(
          messages || [],
          'All messages retrieved successfully',
          {
            limit,
            offset,
            total: messages?.length || 0
          }
        )
      );
    }
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      handleApiError(error, "Failed to fetch messages"),
      { status: 500 }
    );
  }
}
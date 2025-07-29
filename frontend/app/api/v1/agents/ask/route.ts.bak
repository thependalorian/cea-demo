// SSE fully removed. All streaming is now via WebSockets.

import { NextRequest, NextResponse } from 'next/server';

// Helper function to create SSE response
const createSSEResponse = (handler: (send: (data: string, event?: string) => void) => Promise<void>) => {
  const encoder = new TextEncoder();
  const customReadable = new ReadableStream({
    async start(controller) {
      const send = (data: string, event?: string) => {
        let sseFormattedData = '';
        if (event) {
          sseFormattedData += `event: ${event}\n`;
        }
        sseFormattedData += `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(sseFormattedData));
      };

      try {
        await handler(send);
        controller.close();
      } catch (error) {
        console.error('SSE Error:', error);
        send(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), 'error');
        controller.close();
      }
    },
  });

  return new NextResponse(customReadable, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const message = searchParams.get('message');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversationId = searchParams.get('conversation_id');
  const messageId = searchParams.get('message_id');

  if (!message) {
    return NextResponse.json({ error: 'Message is required' }, { status: 400 });
  }

  // Stream response from LangGraph backend
  return createSSEResponse(async (send) => {
    try {
      // Log the request
      console.log(`Processing message: "${message}" for conversation: ${conversationId}`);

      // Initial processing notification
      send(JSON.stringify({ content: "" }), 'update');

      // Create fetch request to Python backend
      const backendUrl = process.env.BACKEND_URL || 'http://localhost:8000';
      const streamUrl = `${backendUrl}/api/v1/langgraph/stream`;
      
      // Prepare the request to the Python backend
      const response = await fetch(streamUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          conversation_id: conversationId,
          message_id: messageId
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend responded with status: ${response.status}`);
      }

      // Check if the response body is readable
      if (!response.body) {
        throw new Error('No response body from backend');
      }

      // Process the stream from the Python backend
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      // Process the stream chunk by chunk
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          // Process any remaining data in the buffer
          if (buffer.trim()) {
            try {
              const lines = buffer.split('\n\n');
              for (const line of lines) {
                if (line.trim().startsWith('data:')) {
                  const jsonStr = line.trim().substring(5).trim();
                  if (jsonStr) {
                    const data = JSON.parse(jsonStr);
                    if (data.content) {
                      send(JSON.stringify({ content: data.content }));
                    }
                  }
                }
              }
            } catch (e) {
              console.error('Error processing final buffer:', e);
            }
          }
          break;
        }

        // Decode the chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete SSE messages in the buffer
        let boundary = buffer.indexOf('\n\n');
        while (boundary !== -1) {
          const chunk = buffer.substring(0, boundary);
          buffer = buffer.substring(boundary + 2);
          
          // Process the SSE message
          if (chunk.trim().startsWith('data:')) {
            try {
              const jsonStr = chunk.trim().substring(5).trim();
              if (jsonStr) {
                const data = JSON.parse(jsonStr);
                
                // Forward the content to the client
                if (data.content) {
                  send(JSON.stringify({ content: data.content }));
                }
                
                // Handle special events
                if (data.event) {
                  send(JSON.stringify(data), data.event);
                }
              }
            } catch (e) {
              console.error('Error parsing SSE data:', e);
            }
          }
          
          boundary = buffer.indexOf('\n\n');
        }
      }
      
      // Send completion event
      send(JSON.stringify({ status: 'complete' }), 'end');
      
    } catch (error) {
      console.error('Error streaming from backend:', error);
      send(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), 'error');
    }
  });
}

// Ensure this route is always dynamically evaluated
export const dynamic = 'force-dynamic'; 
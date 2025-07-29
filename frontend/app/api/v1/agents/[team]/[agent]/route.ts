// Next.js API route for individual agent details
// Location: app/api/v1/agents/[team]/[agent]/route.ts
// Handles specific agent information and capabilities
// Final Phase: Individual agent showcase

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'
import { 
  createSuccessResponse, 
  createErrorResponse, 
  handleApiError 
} from '@/lib/api-response'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000'

// GET /api/v1/agents/[team]/[agent] - Get specific agent details
export async function GET(
  request: NextRequest,
  { params }: { params: { team: string; agent: string } }
) {
  try {
    const supabase = createServerClient()
    const { team, agent } = params
    
    if (!team || !agent) {
      return NextResponse.json(
        createErrorResponse('Team and agent parameters are required', 400),
        { status: 400 }
      )
    }

    // Authentication check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    // Get specific agent information from backend
    const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/agents/${team}/${agent}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Agent service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch agent details', 500),
        { status: response.status }
      )
    }

    const agentData = await response.json()

    // Get agent tools
    let tools = []
    try {
      const toolsResponse = await fetch(`${BACKEND_API_URL}/api/v1/agent-tools/agents/${agent}/tools`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (toolsResponse.ok) {
        const toolsData = await toolsResponse.json()
        tools = toolsData.data?.tools || []
      }
    } catch (toolError) {
      console.warn(`Failed to fetch tools for agent ${agent}:`, toolError)
    }

    // Enhanced agent data with tools and sample conversations
    const enhancedAgentData = {
      ...agentData,
      tools,
      sample_conversations: [
        {
          user: "Help me transition to a climate career",
          agent: `I'd be happy to help you transition to a climate career! As a ${agentData.specialization}, I can guide you through the process.`
        },
        {
          user: "What skills do I need?",
          agent: "Let me analyze your background and recommend the most relevant skills for your climate career goals."
        }
      ],
      interaction_stats: {
        total_conversations: 0, // Would come from database in real implementation
        average_rating: 4.8,
        specialization_match: 95
      }
    }

    // Log agent view
    // await supabase
    //   .from('user_activities')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     user_id: session.user.id,
    //     activity_type: 'agent_viewed',
    //     details: {
    //       agent_id: agent,
    //       team_id: team,
    //       agent_name: agentData.name
    //     },
    //     created_at: new Date().toISOString()
    //   })

    return NextResponse.json(
      createSuccessResponse(enhancedAgentData, 'Agent details retrieved successfully')
    )
  } catch (error) {
    console.error('Agent details fetch error:', error)
    return handleApiError(error)
  }
}
// 
// // POST /api/v1/agents/[team]/[agent] - Chat with specific agent
// export async function POST(
//   request: NextRequest,
//   { params }: { params: { team: string; agent: string } }
// ) {
//   try {
//     const supabase = createServerClient()
//     const { team, agent } = params
//     
//     if (!team || !agent) {
//       return NextResponse.json(
//         createErrorResponse('Team and agent parameters are required', 400),
//         { status: 400 }
//       )
//     }
// 
//     // Authentication check
//     const { data: { session } } = await supabase.auth.getSession()
//     
//     if (!session?.user) {
//       return NextResponse.json(
//         createErrorResponse('Authentication required', 401),
//         { status: 401 }
//       )
//     }
// 
//     const body = await request.json()
//     const { message, conversation_id, metadata = {} } = body
// 
//     // Validation
//     if (!message || !message.trim()) {
//       return NextResponse.json(
//         createErrorResponse('Message is required', 400),
//         { status: 400 }
//       )
//     }
// 
//     // Prepare specific agent chat request
//     const chatRequest = {
//       message: message.trim(),
//       agent_id: agent,
//       team,
//       metadata: {
//         ...metadata,
//         user_id: session.user.id,
//         conversation_id: conversation_id || `conv_${session.user.id}_${Date.now()}`,
//         frontend_source: 'cea-frontend',
//         specific_agent_request: true
//       }
//     }
// 
//     // Forward to backend agents chat endpoint
//     const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/agents/chat`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${session.access_token}`,
//         'Content-Type': 'application/json',
//         'User-Agent': 'CEA-Frontend/1.0'
//       },
//       body: JSON.stringify(chatRequest)
//     })
// 
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({ error: 'Agent chat service unavailable' }))
//       return NextResponse.json(
//         createErrorResponse(errorData.error || 'Failed to chat with agent', 500),
//         { status: response.status }
//       )
//     }
// 
//     const data = await response.json()
// 
//     // Log the specific agent interaction
//     await supabase
//       // .from('user_activities')
//       .insert({
//         id: crypto.randomUUID(),
//         user_id: session.user.id,
//         activity_type: 'specific_agent_chat',
//         details: {
//           agent_id: agent,
//           team_id: team,
//           message_length: message.length,
//           conversation_id: chatRequest.metadata.conversation_id
//         },
//         created_at: new Date().toISOString()
//       })
//     
//     return NextResponse.json(
//       createSuccessResponse(data, `Chat with ${agent} completed successfully`)
//     )
// 
//   } catch (error) {
//     console.error('Specific agent chat error:', error)
//     return handleApiError(error)
//   }
// } 
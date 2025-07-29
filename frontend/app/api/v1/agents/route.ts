// Next.js API route for AI agents showcase
// Location: app/api/v1/agents/route.ts
// Handles agent discovery and showcase functionality
// Final Phase: AI Agent Showcase (Backend complete -> Frontend accessible)

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

// GET /api/v1/agents - Get all available agents organized by teams
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const supabase = createServerClient()
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    const team = searchParams.get('team')
    const includeTools = searchParams.get('include_tools') === 'true'
    const includeCapabilities = searchParams.get('include_capabilities') === 'true'

    // Build backend request URL
    const params = new URLSearchParams()
    if (team) params.append('team', team)

    // Get agents from backend
    const agentsResponse = await fetch(`${BACKEND_API_URL}/api/v1/tools/agents?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!agentsResponse.ok) {
      const errorData = await agentsResponse.json().catch(() => ({ error: 'Agents service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch agents', 500),
        { status: agentsResponse.status }
      )
    }

    const agentsData = await agentsResponse.json()

    // Enhance agent data with additional information if requested
    if (includeTools || includeCapabilities) {
      const enhancedAgents = await Promise.all(
        Object.entries(agentsData.all_teams || {}).map(async ([teamId, teamData]: [string, unknown]) => {
          const enhancedTeamAgents = await Promise.all(
            Object.entries((teamData as Record<string, unknown>).agents || {}).map(async ([agentId, agentInfo]: [string, unknown]) => {
              let tools = []
              
              if (includeTools) {
                try {
                  const toolsResponse = await fetch(`${BACKEND_API_URL}/api/v1/agent-tools/agents/${agentId}/tools`, {
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
                  console.warn(`Failed to fetch tools for agent ${agentId}:`, toolError)
                }
              }

              return {
                id: agentId,
                ...(agentInfo as Record<string, unknown>),
                team_id: teamId,
                ...(includeTools && { tools }),
                ...(includeCapabilities && { 
                  capabilities: [
                    'Climate career guidance',
                    'Personalized recommendations',
                    'Resource connections',
                    'Strategic planning'
                  ]
                })
              }
            })
          )

          return {
            id: teamId,
            name: (teamData as Record<string, unknown>).name || teamId,
            description: agentsData.summary?.[teamId] || '',
            agents: enhancedTeamAgents
          }
        })
      )

      const responseData = {
        teams: enhancedAgents,
        total_agents: enhancedAgents.reduce((total, team) => total + team.agents.length, 0),
        total_teams: enhancedAgents.length,
        metadata: {
          include_tools: includeTools,
          include_capabilities: includeCapabilities,
          filtered_team: team
        }
      }

      return NextResponse.json(
        createSuccessResponse(responseData, 'Agents retrieved successfully')
      )
    }

    // Return basic agent data
    const basicResponse = {
      teams: agentsData.all_teams,
      summary: agentsData.summary,
      total_teams: Object.keys(agentsData.all_teams || {}).length,
      filtered_team: team
    }
    
    return NextResponse.json(
      createSuccessResponse(basicResponse, 'Agents retrieved successfully')
    )

  } catch (error: unknown) {
    console.error('Error fetching agents:', error);
    return handleApiError(error)
  }
}

// POST /api/v1/agents - Chat with agents
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    
    // Authentication check
    const { data: { session } } = await supabase.auth.getSession()
    
    if (!session?.user) {
      return NextResponse.json(
        createErrorResponse('Authentication required', 401),
        { status: 401 }
      )
    }

    const body = await request.json()
    const { message, agent_id, team, metadata = {} } = body

    // Validation
    if (!message || !message.trim()) {
      return NextResponse.json(
        createErrorResponse('Message is required', 400),
        { status: 400 }
      )
    }

    // Prepare chat request for backend
    const chatRequest = {
      message: message.trim(),
      agent_id,
      team,
      metadata: {
        ...metadata,
        user_id: session.user.id,
        frontend_source: 'cea-frontend'
      }
    }

    // Forward to backend agents chat endpoint
    const response = await fetch(`${BACKEND_API_URL}/api/v1/tools/agents/chat`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      },
      body: JSON.stringify(chatRequest)
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Agent chat service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to process agent chat', 500),
        { status: response.status }
      )
    }

    const data = await response.json()

    // Log the agent interaction
    await supabase
      .from('user_activities')
      .insert({
        id: crypto.randomUUID(),
        user_id: session.user.id,
        activity_type: 'agent_chat',
        details: {
          agent_id,
          team,
          message_length: message.length,
          response_received: true
        },
        created_at: new Date().toISOString()
      })
    
    return NextResponse.json(
      createSuccessResponse(data, 'Agent chat completed successfully')
    )

  } catch (error: unknown) {
    console.error('Agent chat error:', error)
    return handleApiError(error)
  }
} 
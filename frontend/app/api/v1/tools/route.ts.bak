// Next.js API route for agent tools discovery
// Location: app/api/v1/tools/route.ts
// Handles agent tools showcase and discovery
// Final Phase: Tools showcase (Backend complete -> Frontend accessible)

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

interface Tool {
  name: string;
  description: string;
  category: string;
  usage_examples: string[];
  user_context: {
    permission_required: string;
    subscription_tier: string;
    estimated_response_time: string;
  };
  related_agents: string[];
}

// GET /api/v1/tools - Get all available agent tools
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

    const category = searchParams.get('category')
    const agentId = searchParams.get('agent_id')
    const search = searchParams.get('search')

    // Get tools from backend
    let toolsUrl = `${BACKEND_API_URL}/api/v1/agent-tools/`
    
    if (category) {
      toolsUrl = `${BACKEND_API_URL}/api/v1/agent-tools/categories/${category}`
    } else if (agentId) {
      toolsUrl = `${BACKEND_API_URL}/api/v1/agent-tools/agents/${agentId}/tools`
    }

    const response = await fetch(toolsUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
        'User-Agent': 'CEA-Frontend/1.0'
      }
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Tools service unavailable' }))
      return NextResponse.json(
        createErrorResponse(errorData.error || 'Failed to fetch tools', 500),
        { status: response.status }
      )
    }

    const toolsData = await response.json()

    // Get tool categories if not filtered
    let categoriesData = {}
    if (!category && !agentId) {
      try {
        const categoriesResponse = await fetch(`${BACKEND_API_URL}/api/v1/agent-tools/`, {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
          }
        })
        
        if (categoriesResponse.ok) {
          const catData = await categoriesResponse.json()
          categoriesData = catData.data?.categories || {}
        }
      } catch (catError) {
        console.warn('Failed to fetch tool categories:', catError)
      }
    }

    // Enhance tools with usage examples and user context
    const enhancedTools: Tool[] = (toolsData.data?.tools || toolsData.tools || []).map((tool: unknown) => {
      const examples = getToolExamples(tool.name)
      
      return {
        ...tool,
        usage_examples: examples,
        user_context: {
          permission_required: tool.name.includes('admin') ? 'admin' : 'user',
          subscription_tier: tool.name.includes('advanced') ? 'premium' : 'free',
          estimated_response_time: getEstimatedResponseTime(tool.name)
        },
        related_agents: getRelatedAgents(tool.name)
      }
    })

    // Apply search filter if provided
    let filteredTools = enhancedTools
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTools = enhancedTools.filter((tool) =>
        tool.name?.toLowerCase().includes(searchLower) ||
        tool.description?.toLowerCase().includes(searchLower) ||
        tool.category?.toLowerCase().includes(searchLower)
      )
    }

    // Group tools by category
    const toolsByCategory = filteredTools.reduce((acc: Record<string, Tool[]>, tool) => {
      const cat = tool.category || 'general'
      if (!acc[cat]) acc[cat] = []
      acc[cat].push(tool)
      return acc
    }, {})

    // Log tools discovery
    // await supabase
    //   .from('user_activities')
    //   .insert({
    //     id: crypto.randomUUID(),
    //     user_id: session.user.id,
    //     activity_type: 'tools_discovered',
    //     details: {
    //       tools_found: filteredTools.length,
    //       category_filter: category,
    //       agent_filter: agentId,
    //       search_query: search
    //     },
    //     created_at: new Date().toISOString()
    //   })

    const responseData = {
      tools: filteredTools,
      tools_by_category: toolsByCategory,
      categories: categoriesData,
      total_tools: filteredTools.length,
      filters_applied: {
        category,
        agent_id: agentId,
        search
      }
    }

    return NextResponse.json(
      createSuccessResponse(responseData, 'Tools retrieved successfully')
    )
  } catch (error) {
    console.error('Tools discovery error:', error)
    return handleApiError(error)
  }
}
// 
// // POST /api/v1/tools - Execute a tool
// export async function POST(request: NextRequest) {
//   try {
//     const supabase = createServerClient()
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
//     const { tool_name, parameters = {}, metadata = {} } = body
// 
//     // Validation
//     if (!tool_name) {
//       return NextResponse.json(
//         createErrorResponse('Tool name is required', 400),
//         { status: 400 }
//       )
//     }
// 
//     // Prepare tool execution request
//     const toolRequest = {
//       parameters: {
//         ...parameters,
//         user_id: session.user.id
//       },
//       metadata: {
//         ...metadata,
//         frontend_source: 'cea-frontend',
//         user_id: session.user.id
//       }
//     }
// 
//     // Execute tool via backend
//     const response = await fetch(`${BACKEND_API_URL}/api/v1/agent-tools/${tool_name}/invoke`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${session.access_token}`,
//         'Content-Type': 'application/json',
//         'User-Agent': 'CEA-Frontend/1.0'
//       },
//       body: JSON.stringify(toolRequest)
//     })
// 
//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({ error: 'Tool execution service unavailable' }))
//       return NextResponse.json(
//         createErrorResponse(errorData.error || 'Failed to execute tool', 500),
//         { status: response.status }
//       )
//     }
// 
//     const data = await response.json()
// 
//     // Log tool usage
//     await supabase
//       // .from('user_activities')
//       .insert({
//         id: crypto.randomUUID(),
//         user_id: session.user.id,
//         activity_type: 'tool_executed',
//         details: {
//           tool_name,
//           execution_time: data.data?.execution_time,
//           parameters_used: Object.keys(parameters),
//           success: data.success
//         },
//         created_at: new Date().toISOString()
//       })
//     
//     return NextResponse.json(
//       createSuccessResponse(data.data, `Tool '${tool_name}' executed successfully`)
//     )
// 
//   } catch (error) {
//     console.error('Tool execution error:', error)
//     return handleApiError(error)
//   }
// }
// 
// // Helper functions
// function getToolExamples(toolName: string): string[] {
//   const examples: { [key: string]: string[] } = {
//     'analyze_massachusetts_climate_data': [
//       'Analyze current renewable energy trends in Massachusetts',
//       'Get latest climate policy impact data'
//     ],
//     'translate_military_skills': [
//       'Translate Infantry MOS to climate careers',
//       'Map logistics experience to green supply chain roles'
//     ],
//     'partner_search': [
//       'Find renewable energy companies hiring veterans',
//       'Search sustainability consultancies in Boston area'
//     ],
//     'resume_analysis': [
//       'Analyze resume for climate career fit',
//       'Extract transferable skills for green jobs'
//     ]
//   }
//   
//   return examples[toolName] || [
//     `Use ${toolName} for specialized climate career guidance`,
//     `Get personalized results with ${toolName}`
//   ]
// }
// 
// function getEstimatedResponseTime(toolName: string): string {
//   if (toolName.includes('analysis') || toolName.includes('translate')) {
//     return '2-5 seconds'
//   }
//   if (toolName.includes('search') || toolName.includes('find')) {
//     return '1-3 seconds'
//   }
//   return '1-2 seconds'
// }
// 
// function getRelatedAgents(toolName: string): string[] {
//   const agentMap: { [key: string]: string[] } = {
//     'analyze_massachusetts_climate_data': ['pendo', 'lauren'],
//     'translate_military_skills': ['marcus', 'james'],
//     'partner_search': ['pendo', 'alex'],
//     'resume_analysis': ['lauren', 'jasmine']
//   }
//   
//   return agentMap[toolName] || ['pendo']
// }
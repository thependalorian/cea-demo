import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { Database } from '@/types/database'
import type { NewConversation } from '@/types/conversation'

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check auth
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get request body
    const body: NewConversation = await request.json()
    
    if (!body.conversation_type) {
      return NextResponse.json(
        { error: 'Missing conversation_type' },
        { status: 400 }
      )
    }

    // Create conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .insert({
        user_id: session.user.id,
        conversation_type: body.conversation_type,
        status: 'active',
        title: body.title,
        thread_id: body.thread_id,
        metadata: body.metadata
      })
      .select()
      .single()

    if (conversationError) {
      throw conversationError
    }

    // Track analytics
    await supabase
      .from('conversation_analytics')
      .insert({
        conversation_id: conversation.id,
        user_id: session.user.id,
        event_type: 'conversation_created',
        event_data: {
          conversation_type: body.conversation_type,
          source: 'web'
        }
      })

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Conversations API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check auth
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get query params
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Build query
    let query = supabase
      .from('conversations')
      .select('*')
      .eq('user_id', session.user.id)
      .order('updated_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    if (type) {
      query = query.eq('conversation_type', type)
    }

    const { data: conversations, error: conversationsError } = await query

    if (conversationsError) {
      throw conversationsError
    }

    return NextResponse.json(conversations)
  } catch (error) {
    console.error('Conversations API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = createRouteHandlerClient<Database>({ cookies })
    
    // Check auth
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError || !session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get conversation ID from URL
    const { pathname } = new URL(request.url)
    const id = pathname.split('/').pop()

    if (!id) {
      return NextResponse.json(
        { error: 'Missing conversation ID' },
        { status: 400 }
      )
    }

    // Get request body
    const body = await request.json()
    const { status, title, metadata } = body

    // Update conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('conversations')
      .update({
        status: status,
        title: title,
        metadata: metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('user_id', session.user.id) // Ensure user owns conversation
      .select()
      .single()

    if (conversationError) {
      throw conversationError
    }

    // Track analytics if status changed
    if (status) {
      await supabase
        .from('conversation_analytics')
        .insert({
          conversation_id: id,
          user_id: session.user.id,
          event_type: 'status_updated',
          event_data: {
            new_status: status,
            source: 'web'
          }
        })
    }

    return NextResponse.json(conversation)
  } catch (error) {
    console.error('Conversations API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 
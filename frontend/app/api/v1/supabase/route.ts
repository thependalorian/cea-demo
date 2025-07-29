/**
 * Supabase API Routes for Job Seeker App
 * Connects frontend with real Supabase data and backend agents
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Use service key if available, otherwise fall back to anon key for demo mode
const supabaseKey = supabaseServiceKey || supabaseAnonKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase configuration is missing. Please check your environment variables.');
}

const supabase: SupabaseClient<Database> = createClient<Database>(supabaseUrl, supabaseKey);

// Backend API URL
const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const userId = searchParams.get('userId');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    switch (endpoint) {
      case 'jobs':
        const { data: jobs, error: jobsError } = await supabase
          .from('job_listings')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (jobsError) throw jobsError;

        // Calculate match scores (mock algorithm)
        const jobsWithMatch = jobs.map(job => ({
          ...job,
          match_score: Math.floor(Math.random() * 30) + 70, // 70-99%
          applied: Math.random() > 0.8,
          saved: Math.random() > 0.7
        }));

        return NextResponse.json({ data: jobsWithMatch });

      case 'agents':
        const { data: agents, error: agentsError } = await supabase
          .from('agents')
          .select('*')
          .eq('status', 'active')
          .order('team', { ascending: true });

        if (agentsError) throw agentsError;

        // Group agents by team
        const agentsByTeam = agents.reduce((acc: Record<string, unknown[]>, agent: unknown) => {
          if (!acc[agent.team]) acc[agent.team] = [];
          acc[agent.team].push(agent);
          return acc;
        }, {});

        return NextResponse.json({ data: agentsByTeam });

      case 'conversations':
        const { data: conversations, error: convsError } = await supabase
          .from('conversations')
          .select(`
            *,
            conversation_messages (
              id, content, role, created_at, specialist_type
            )
          `)
          .eq('status', 'active')
          .order('updated_at', { ascending: false })
          .limit(limit);

        if (convsError) throw convsError;

        return NextResponse.json({ data: conversations });

      case 'education_programs':
        const { data: programs, error: programsError } = await supabase
          .from('education_programs')
          .select('*')
          .eq('is_active', true)
          .order('application_deadline', { ascending: true })
          .limit(limit);

        if (programsError) throw programsError;

        return NextResponse.json({ data: programs });

      case 'bookings':
        if (!userId) {
          return NextResponse.json({ error: 'User ID required' }, { status: 400 });
        }

        const { data: bookings, error: bookingsError } = await supabase
          .from('bookings')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit);

        if (bookingsError) throw bookingsError;

        return NextResponse.json({ data: bookings });

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Supabase API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');

  try {
    const body = await request.json();

    switch (endpoint) {
      case 'chat':
        // Send message to backend agent system
        const chatResponse = await fetch(`${BACKEND_API_URL}/api/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: body.message,
            agent_id: body.agent_id,
            conversation_id: body.conversation_id,
            user_context: body.user_context || {}
          }),
        });

        if (!chatResponse.ok) {
          throw new Error('Backend chat API error');
        }

        const chatData = await chatResponse.json();
        return NextResponse.json(chatData);

      case 'book_agent':
        // Create booking in Supabase
        const { data: booking, error: bookingError } = await supabase
          .from('bookings')
          .insert([{
            agent_id: body.agent_id,
            user_id: body.user_id,
            booking_type: body.booking_type,
            scheduled_date: body.scheduled_date,
            duration_minutes: body.duration_minutes || 30,
            notes: body.notes,
            status: 'confirmed'
          }])
          .select()
          .single();

        if (bookingError) throw bookingError;

        return NextResponse.json({ data: booking });

      case 'save_job':
        const { data: savedJob, error: saveError } = await supabase
          .from('saved_jobs')
          .upsert([{
            user_id: body.user_id,
            job_id: body.job_id,
            saved_at: new Date().toISOString()
          }])
          .select()
          .single();

        if (saveError) throw saveError;

        return NextResponse.json({ data: savedJob });

      case 'apply_job':
        // This would integrate with the job application system
        // For now, just log the application
        console.log('Job application:', body);
        return NextResponse.json({ 
          success: true, 
          message: 'Application submitted successfully' 
        });

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }
  } catch (error) {
    console.error('Supabase POST API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
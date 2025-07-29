import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    console.log('Testing Supabase connection...')
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Supabase Key (first 20 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20))
    
    const { data, error } = await (supabase as any)
      .from('education_programs')
      .select('*')
      .limit(1)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      }, { status: 500 })
    }

    console.log('Supabase success, data:', data)
    return NextResponse.json({ 
      success: true, 
      data: data,
      count: data?.length || 0
    })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error'
    }, { status: 500 })
  }
} 
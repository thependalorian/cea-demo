// API route to create a user profile after signup
// Location: app/api/create-profile/route.ts
// Accepts POST: { userId, role, profileData }

import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase as createServerClient } from '@/lib/supabase-server'

export async function POST(req: NextRequest) {
  try {
    const { userId, role, profileData } = await req.json()
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json({ error: 'Unauthorized: userId missing or invalid' }, { status: 401 })
    }
    if (!profileData || typeof profileData !== 'object' || !profileData.email) {
      return NextResponse.json({ error: 'Invalid profile data' }, { status: 400 })
    }
    const supabase = createServerClient()
    
    // 1. Upsert into the main 'profiles' table
    const profilesData = {
      id: userId, // The profiles table uses 'id' as primary key, not 'user_id'
      email: profileData.email,
      first_name: profileData.full_name || profileData.organization || profileData.first_name || '',
      last_name: profileData.last_name || '',
      role,
      user_type: role, // Set user_type to match role
      profile_completed: false,
      verified: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Include organization fields if they exist
      ...(profileData.organization && { organization_name: profileData.organization }),
      ...(profileData.organization_type && { organization_type: profileData.organization_type }),
      ...(profileData.website && { website: profileData.website }),
      ...(profileData.description && { description: profileData.description })
    }
    
    const { error: profilesError } = await supabase
      .from('profiles')
      .upsert([profilesData], { onConflict: 'id' })
    
    if (profilesError) {
      console.error('Profiles upsert error:', profilesError)
      return NextResponse.json({ error: profilesError.message }, { status: 500 })
    }

    // 2. Insert into the role-specific table
    let table
    let insertData
    
    if (role === 'job_seeker') {
      table = 'job_seeker_profiles'
      insertData = { 
        id: userId, // job_seeker_profiles uses 'id' as primary key
        full_name: profileData.full_name || profileData.first_name || '',
        email: profileData.email,
        profile_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Optional job seeker specific fields
        ...(profileData.phone && { phone: profileData.phone }),
        ...(profileData.location && { location: profileData.location }),
        ...(profileData.current_title && { current_title: profileData.current_title }),
        ...(profileData.experience_level && { experience_level: profileData.experience_level })
      }
    } else if (role === 'partner') {
      table = 'partner_profiles'
      insertData = { 
        id: userId, // partner_profiles uses 'id' as primary key
        organization_name: profileData.organization || profileData.organization_name || '',
        full_name: profileData.full_name || profileData.first_name || '',
        email: profileData.email,
        profile_completed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        // Required and optional partner specific fields
        ...(profileData.organization_type && { organization_type: profileData.organization_type }),
        ...(profileData.website && { website: profileData.website }),
        ...(profileData.phone && { phone: profileData.phone }),
        ...(profileData.description && { description: profileData.description })
      }
    } else if (role === 'admin') {
      table = 'admin_profiles'
      insertData = {
        id: userId, // admin_profiles now uses 'id' as primary key
        full_name: profileData.full_name || profileData.first_name || '',
        admin_level: 'standard', // Required field
        permissions: {
          can_manage_users: true,
          can_manage_content: true,
          can_manage_partners: true,
          can_manage_system: false,
          can_view_analytics: true
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    } else {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }
    
    const { error } = await supabase.from(table).upsert([insertData], { 
      onConflict: 'id' 
    })
    
    if (error) {
      console.error(`${table} upsert error:`, error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    
    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Create profile error:', err)
    const errorMessage = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
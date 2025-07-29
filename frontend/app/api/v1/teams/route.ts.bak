import { NextResponse } from "next/server";
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from "@/types/database";

/**
 * API route to fetch agent teams from the backend
 * Integrates with the Climate Teams RESTful API
 */
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const includeAgents = url.searchParams.get("include_agents") === "true";
    
    // Create Supabase client for authentication
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore });
    
    // Get session for authentication
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token;
    
    // Fetch teams from the backend API
    const apiUrl = process.env.BACKEND_API_URL || "http://localhost:8889";
    
    // Ensure we're using the endpoint without trailing slash to avoid redirects
    const endpoint = `${apiUrl}/api/v1/teams`;
    const queryParams = includeAgents ? `?include_agents=${includeAgents}` : '';
    
    const response = await fetch(
      `${endpoint}${queryParams}`,
      {
        headers: {
          "Content-Type": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` })
        },
        cache: "no-store",
      }
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Failed to fetch teams: ${response.status} ${response.statusText}${
          errorData ? ` - ${JSON.stringify(errorData)}` : ''
        }`
      );
    }
    
    const data = await response.json();
    
    // Return the data to the frontend
    return NextResponse.json(data);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error fetching agent teams:", errorMessage);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch agent teams",
        error: errorMessage,
      },
      { status: 500 }
    );
  }
}
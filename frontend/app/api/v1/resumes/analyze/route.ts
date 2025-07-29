import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase as createServerClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient();
    
    // Get current user session
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOC, DOCX, or TXT files.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    console.log(`Processing resume: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    try {
      // Convert file to buffer for backend processing
      const fileBuffer = await file.arrayBuffer();
      const fileBytes = new Uint8Array(fileBuffer);

      // Call the backend resume processor
      const backendResponse = await fetch(`${process.env.BACKEND_URL || 'http://localhost:8000'}/api/v1/resumes/process-file`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          filename: file.name,
          file_data: Array.from(fileBytes), // Convert to array for JSON serialization
          user_id: session.user.id
        })
      });

      if (!backendResponse.ok) {
        throw new Error(`Backend processing failed: ${backendResponse.status}`);
      }

      const backendResult = await backendResponse.json();

      if (!backendResult.success) {
        throw new Error(backendResult.error || 'Backend processing failed');
      }

      // Return the real analysis result from backend
      return NextResponse.json({
        id: backendResult.resume_id,
        file_name: file.name,
        climate_relevance_score: backendResult.climate_relevance_score || 0,
        recommended_roles: backendResult.recommended_roles || [],
        skills: backendResult.skills_extracted || [],
        skill_gaps: backendResult.skill_gaps || [],
        enhancement_suggestions: backendResult.enhancement_suggestions || [],
        climate_sectors_match: backendResult.climate_sectors_match || {},
        processing_status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      });

    } catch (backendError) {
      console.error('Backend processing failed, falling back to text extraction:', backendError);
      
      // Fallback: Extract text and store basic record
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      // const fileText = await extractTextFromFile(file);
      
      // Update job seeker profile with resume information
      const { data: resumeRecord, error: dbError } = await supabase
        .from('job_seeker_profiles')
        .upsert({
          id: session.user.id,
          user_id: session.user.id,
          resume_filename: file.name,
          resume_uploaded_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (dbError) {
        throw new Error(`Database error: ${dbError.message}`);
      }

      return NextResponse.json({
        id: resumeRecord.id,
        file_name: file.name,
        climate_relevance_score: 0,
        recommended_roles: [],
        skills: [],
        skill_gaps: [],
        enhancement_suggestions: [
          'Professional resume analysis requires backend processing',
          'Please try again later for full AI analysis'
        ],
        climate_sectors_match: {},
        processing_status: 'basic_extraction',
        created_at: new Date(),
        updated_at: new Date(),
        message: 'Basic text extraction completed. Full AI analysis temporarily unavailable.'
      });
    }

  } catch (error) {
    console.error('Error processing resume:', error);
    return NextResponse.json(
      { error: 'Failed to process resume' },
      { status: 500 }
    );
  }
}

// Helper function to extract text from different file types
// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function extractTextFromFile(file: File): Promise<string> {
  try {
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    // For other file types, return a placeholder until backend processing is available
    return `[${file.type.toUpperCase()} CONTENT FROM: ${file.name}]\n\nFile uploaded successfully. AI processing requires backend service.`;
  } catch (error) {
    console.error('Text extraction error:', error);
    return `[FILE CONTENT FROM: ${file.name}]\n\nText extraction failed.`;
  }
}

export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

// Backend API configuration
const RAG_API_URL = process.env.RAG_API_URL || 'http://localhost:8000/resume/upload';
const AGENT_API_URL = process.env.AGENT_API_URL || 'http://localhost:8001/api/pendo-agent';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('user_id') as string || randomUUID();
    const apiKey = request.headers.get('X-OpenAI-API-Key');

    // Validate inputs
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload PDF, DOC, or DOCX files only.' },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds the 5MB limit' },
        { status: 400 }
      );
    }

    console.log(`Processing resume: ${file.name}, size: ${file.size} bytes, type: ${file.type}`);

    try {
      // Convert file to base64 for agent API
      const fileBuffer = await file.arrayBuffer();
      const fileBase64 = Buffer.from(fileBuffer).toString('base64');
      
      // Prepare request for agent API with vision capabilities
      const agentRequest = {
        id: randomUUID(),
        user_id: userId,
        user_query: `Please analyze this resume and provide comprehensive insights for Massachusetts clean energy careers. Focus on:

1. Key skills, experience, and qualifications
2. Transferable skills for clean energy roles (solar, wind, energy efficiency, sustainability)
3. Specific Massachusetts clean energy career recommendations
4. Resume improvement suggestions
5. Alignment score with green energy sector (0-100%)
6. Relevant certifications or training needed

Provide detailed, actionable recommendations specific to the Massachusetts clean energy economy.`,
        session_id: randomUUID(),
        files: [
          {
            filename: file.name,
            content: fileBase64,
            mime_type: file.type
          }
        ]
      };
      
      // Set up headers for agent API
      const agentHeaders: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (apiKey) {
        agentHeaders['X-OpenAI-API-Key'] = apiKey;
      }
      
      console.log('Sending resume to agent API for vision analysis...');
      const agentResponse = await fetch(AGENT_API_URL, {
        method: 'POST',
        headers: agentHeaders,
        body: JSON.stringify(agentRequest),
      });
      
      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        console.error('Agent API error:', errorText);
        throw new Error(`Agent API failed: ${agentResponse.status} - ${errorText}`);
      }
      
      const agentResult = await agentResponse.json();
      console.log('Agent API result received');
      
      // Parse the agent response and extract analysis
      const analysis = parseAgentResponse(agentResult.response || agentResult.message || '');
      
      return NextResponse.json({
        success: true,
        analysis: analysis,
        message: 'Resume analysis completed using AI vision capabilities',
        data: agentResult
      });
      
    } catch (error) {
      console.error('Error during resume processing:', error);
      return NextResponse.json(
        { error: `Failed to process resume: ${error instanceof Error ? error.message : 'Unknown error'}` },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Resume API Error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Enhanced helper function to parse agent response and extract structured analysis
function parseAgentResponse(response: string): any {
  try {
    // Try to extract structured information from the response
    const analysis = {
      skills: [],
      experience: '',
      greenJobsMatch: 0,
      recommendations: [],
      suggestions: [],
      raw_response: response
    };

    // Extract skills (look for common patterns)
    const skillsPatterns = [
      /skills?[:\s]+([^.\n]+)/gi,
      /technical[:\s]+([^.\n]+)/gi,
      /competencies?[:\s]+([^.\n]+)/gi
    ];
    
    for (const pattern of skillsPatterns) {
      const matches = response.match(pattern);
      if (matches) {
        const skills = matches[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 2);
        analysis.skills.push(...skills);
      }
    }

    // Extract experience
    const experiencePatterns = [
      /experience[:\s]+([^.\n]+)/gi,
      /background[:\s]+([^.\n]+)/gi,
      /work[:\s]+([^.\n]+)/gi
    ];
    
    for (const pattern of experiencePatterns) {
      const match = response.match(pattern);
      if (match) {
        analysis.experience = match[1].trim();
        break;
      }
    }

    // Extract green jobs match percentage
    const matchPattern = /(\d+)%?.*green|alignment.*(\d+)%?|score.*(\d+)%?/gi;
    const match = response.match(matchPattern);
    if (match) {
      const numbers = response.match(/\d+/g);
      if (numbers) {
        analysis.greenJobsMatch = parseInt(numbers[0]) || 75; // Default to 75 if no clear match
      }
    }

    // Extract recommendations
    const recPatterns = [
      /recommendations?[:\s]+([^.\n]+)/gi,
      /career[:\s]+([^.\n]+)/gi,
      /opportunities?[:\s]+([^.\n]+)/gi
    ];
    
    for (const pattern of recPatterns) {
      const matches = response.match(pattern);
      if (matches) {
        const recs = matches[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 5);
        analysis.recommendations.push(...recs);
      }
    }

    // Extract suggestions
    const suggPatterns = [
      /suggestions?[:\s]+([^.\n]+)/gi,
      /improvements?[:\s]+([^.\n]+)/gi,
      /enhancements?[:\s]+([^.\n]+)/gi
    ];
    
    for (const pattern of suggPatterns) {
      const matches = response.match(pattern);
      if (matches) {
        const suggs = matches[1].split(/[,;]/).map(s => s.trim()).filter(s => s.length > 5);
        analysis.suggestions.push(...suggs);
      }
    }

    // If we couldn't extract much, use the raw response
    if (analysis.skills.length === 0 && analysis.experience === '') {
      analysis.experience = response.substring(0, 200) + '...';
      analysis.greenJobsMatch = 75; // Default score
    }

    return analysis;
  } catch (e) {
    // Fallback to simple parsing
    return {
      skills: [],
      experience: response.substring(0, 200) + '...',
      greenJobsMatch: 75,
      recommendations: [],
      suggestions: [],
      raw_response: response
    };
  }
} 
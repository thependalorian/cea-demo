import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
  const apiUrl = `${backendUrl}/api/v1/fastrtc-voice/voice/stats`

  const res = await fetch(apiUrl, {
    headers: {
      'Authorization': req.headers.get('authorization') || '',
      'Content-Type': 'application/json',
    },
  })
  const data = await res.json()
  return NextResponse.json(data)
} 
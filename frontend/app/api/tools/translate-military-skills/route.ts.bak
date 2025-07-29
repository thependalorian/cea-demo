import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8000'
  const apiUrl = `${backendUrl}/api/v1/tools/translate-military-skills`
  const body = await req.text()

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Authorization': req.headers.get('authorization') || '',
      'Content-Type': req.headers.get('content-type') || 'application/json',
    },
    body,
  })
  const data = await res.json()
  return NextResponse.json(data)
} 
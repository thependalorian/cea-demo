// Stripe checkout API is disabled for demo mode
// To re-enable, restore the original code.

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({
    error: 'Stripe checkout is disabled in demo mode.'
  }, { status: 503 });
}

export async function GET() {
  return NextResponse.json({
    error: 'Stripe checkout is disabled in demo mode.'
  }, { status: 503 });
} 
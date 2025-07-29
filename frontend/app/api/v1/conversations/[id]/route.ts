import { NextRequest, NextResponse } from 'next/server';

// This would normally interact with Supabase, but we're simulating it here
// We're using the same Map from the parent route
// eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversations = new Map();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversation = conversations.get(id);

    if (!conversation) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json(conversation);
  } catch (error) {
    console.error(`Error fetching conversation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch conversation' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const updates = await request.json();

    // Check if conversation exists
    if (!conversations.has(id)) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Get existing conversation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const conversation = conversations.get(id);

    // Update conversation
    const updatedConversation = {
      ...conversation,
      ...updates,
      updated_at: new Date().toISOString()
    };

    // Store updated conversation
    conversations.set(id, updatedConversation);

    console.log(`Updated conversation: ${id}`);
    return NextResponse.json(updatedConversation);
  } catch (error) {
    console.error(`Error updating conversation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to update conversation' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if conversation exists
    if (!conversations.has(id)) {
      return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
    }

    // Delete conversation
    conversations.delete(id);

    console.log(`Deleted conversation: ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error deleting conversation ${params.id}:`, error);
    return NextResponse.json(
      { error: 'Failed to delete conversation' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic'; 
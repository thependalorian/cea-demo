/**
 * Conversation Types
 * 
 * Type definitions for conversations and messages in the chat interface
 */

import { Json } from './database';

// Message role types
export type MessageRole = 'user' | 'assistant' | 'system' | 'function' | 'tool';

// Message structure
export interface Message {
  id?: string;
  role: MessageRole;
  content: string;
  created_at?: string;
  metadata?: MessageMetadata;
}

// Message metadata
export interface MessageMetadata {
  attachments?: Attachment[];
  toolCalls?: ToolCall[];
  [key: string]: unknown;
}

// Attachment structure
export interface Attachment {
  id: string;
  type: string;
  name: string;
  url?: string;
  data?: unknown;
}

// Tool call structure
export interface ToolCall {
  id: string;
  type: string;
  name: string;
  parameters: unknown;
  response?: unknown;
}

// Conversation structure
export interface Conversation {
  id: string;
  title?: string;
  summary?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  status: ConversationStatus;
  metadata?: ConversationMetadata;
  messages?: Message[];
}

// Conversation status
export type ConversationStatus = 'active' | 'archived' | 'deleted';

// Conversation metadata
export interface ConversationMetadata {
  tags?: string[];
  context?: unknown;
  [key: string]: unknown;
}

// New conversation request
export interface NewConversation {
  title?: string;
  initialMessage?: string;
  metadata?: ConversationMetadata;
} 
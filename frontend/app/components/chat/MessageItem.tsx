/**
 * MessageItem Component - ACT Climate Economy Assistant
 * 
 * Purpose: Individual message display with role-based styling and ACT branding
 * Location: /app/components/chat/MessageItem.tsx
 * Used by: ChatInterface for rendering user and assistant messages
 * 
 * Features:
 * - Role-based styling (user vs assistant messages)
 * - ACT brand colors and typography
 * - Message metadata display (confidence, sources)
 * - Attachment preview for uploaded files
 * - Copy message functionality
 * - Timestamp formatting
 * - Markdown rendering for rich content
 * 
 * @example
 * <MessageItem message={messageData} />
 */

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { formatRelativeTime } from '@/lib/utils';

import type { Message } from './ChatInterface';

export interface MessageItemProps {
  message: Message;
  className?: string;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, className }) => {
  const [showMetadata, setShowMetadata] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';

  // Copy message to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get role-specific styling
  const getMessageStyling = () => {
    if (isUser) {
      return {
        container: 'flex justify-end',
        bubble: 'bg-spring-green text-midnight-forest rounded-l-xl rounded-tr-xl max-w-[80%]',
        avatar: 'bg-spring-green text-midnight-forest',
        icon: '👤',
      };
    } else if (isSystem) {
      return {
        container: 'flex justify-center',
        bubble: 'bg-sand-gray/30 text-base-content/70 rounded-lg max-w-[60%] text-center',
        avatar: 'bg-moss-green text-white',
        icon: '',
      };
    } else {
      return {
        container: 'flex justify-start',
        bubble: 'bg-white border border-sand-gray/30 text-midnight-forest rounded-r-xl rounded-tl-xl max-w-[80%] shadow-sm',
        avatar: 'bg-moss-green text-white',
        icon: '🌱',
      };
    }
  };

  const styling = getMessageStyling();

  // Format message content (basic markdown support)
  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-sand-gray/20 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/\n/g, '<br />');
  };

  // Get conversation type color
  const getTypeColor = (type?: string) => {
    switch (type) {
      case 'job_search':
        return 'text-spring-green';
      case 'career_advice':
        return 'text-moss-green';
      case 'skill_assessment':
        return 'text-midnight-forest';
      default:
        return 'text-base-content/60';
    }
  };

  return (
    <div className={cn(styling.container, className)}>
      <div className="flex gap-3 max-w-full">
        {/* Avatar (for assistant and system messages) */}
        {!isUser && (
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1',
            styling.avatar
          )}>
            {styling.icon}
          </div>
        )}

        {/* Message Bubble */}
        <div className={cn('relative group', styling.bubble)}>
          <div className="p-4">
            {/* Message Content */}
            <div 
              className="leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formatContent(message.content) }}
            />

            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.attachments.map((attachment, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-2 p-2 bg-sand-gray/20 rounded-lg text-sm"
                  >
                    <svg className="w-4 h-4 text-moss-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="flex-1 truncate">{attachment.name}</span>
                    <span className="text-xs text-base-content/50">
                      {(attachment.size / 1024 / 1024).toFixed(1)}MB
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Message Metadata */}
            {message.metadata && (
              <div className="mt-3">
                {/* Conversation Type Tag */}
                {message.metadata.conversationType && (
                  <span className={cn(
                    'inline-block px-2 py-1 text-xs rounded-full bg-current/10',
                    getTypeColor(message.metadata.conversationType)
                  )}>
                    {message.metadata.conversationType.replace('_', ' ')}
                  </span>
                )}

                {/* Confidence Score */}
                {message.metadata.confidence && (
                  <div className="mt-2 text-xs text-base-content/60">
                    Confidence: {Math.round(message.metadata.confidence * 100)}%
                  </div>
                )}

                {/* Source Documents */}
                {message.metadata.sourceDocuments && message.metadata.sourceDocuments.length > 0 && (
                  <div className="mt-2">
                    <button
                      onClick={() => setShowMetadata(!showMetadata)}
                      className="text-xs text-base-content/60 hover:text-base-content underline"
                    >
                      {showMetadata ? 'Hide' : 'Show'} sources ({message.metadata.sourceDocuments.length})
                    </button>
                    {showMetadata && (
                      <div className="mt-1 space-y-1">
                        {message.metadata.sourceDocuments.map((source, index) => (
                          <div key={index} className="text-xs text-base-content/50 pl-2 border-l-2 border-sand-gray/30">
                            {source}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Message Actions (on hover) */}
          <div className={cn(
            'absolute top-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200',
            isUser ? '-left-12' : '-right-12'
          )}>
            <div className="flex flex-col gap-1">
              <button
                onClick={handleCopy}
                className="p-1 rounded text-base-content/40 hover:text-moss-green hover:bg-moss-green/10 transition-colors"
                title={copied ? 'Copied!' : 'Copy message'}
              >
                {copied ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Timestamp */}
          <div className={cn(
            'text-xs text-base-content/40 mt-1 px-4 pb-2',
            isUser ? 'text-right' : 'text-left'
          )}>
            {formatRelativeTime(message.timestamp)}
          </div>
        </div>

        {/* Avatar (for user messages) */}
        {isUser && (
          <div className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 mt-1',
            styling.avatar
          )}>
            {styling.icon}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageItem; 
/**
 * ConversationsList Component - ACT Climate Economy Assistant
 * 
 * Purpose: Chat history sidebar with conversation management and ACT branding
 * Location: /app/components/ConversationsList.tsx
 * Used by: Chat layout and dashboard for managing conversation history
 * 
 * Features:
 * - Massachusetts clean energy conversation topics
 * - ACT brand styling with glass morphism
 * - Search and filter conversations
 * - New conversation creation
 * - Conversation archiving and deletion
 * - Real-time conversation updates
 * 
 * @example
 * <ConversationsList 
 *   conversations={conversations}
 *   activeConversationId={activeId}
 *   onSelectConversation={handleSelect}
 *   onNewConversation={handleNewChat}
 * />
 */

import React, { useState, useMemo } from 'react';
import { cn } from '@/lib/utils';
import { SearchInput } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatRelativeTime, truncate } from '@/lib/utils';

// Types for conversations
export interface Conversation {
  id: string;
  title: string;
  preview: string;
  timestamp: Date;
  unreadCount?: number;
  archived?: boolean;
  tags?: string[];
  type?: 'job_search' | 'career_advice' | 'skill_assessment' | 'general';
}

export interface ConversationsListProps {
  conversations: Conversation[];
  activeConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onArchiveConversation?: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
  className?: string;
}

const ConversationsList: React.FC<ConversationsListProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewConversation,
  onArchiveConversation,
  onDeleteConversation,
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'archived' | 'unread'>('all');

  // Filter and search conversations
  const filteredConversations = useMemo(() => {
    // Ensure we have a valid array to work with
    let filtered = conversations || [];

    // Apply filter
    if (filter === 'archived') {
      filtered = filtered.filter(conv => conv.archived);
    } else if (filter === 'unread') {
      filtered = filtered.filter(conv => conv.unreadCount && conv.unreadCount > 0);
    } else {
      filtered = filtered.filter(conv => !conv.archived);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.title.toLowerCase().includes(query) ||
        conv.preview.toLowerCase().includes(query) ||
        conv.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Sort by timestamp (most recent first)
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }, [conversations, searchQuery, filter]);

  // Conversation type icons
  const getTypeIcon = (type?: Conversation['type']) => {
    switch (type) {
      case 'job_search':
        return '';
      case 'career_advice': 
        return '';
      case 'skill_assessment':
        return '';
      default:
        return '';
    }
  };

  // Conversation type colors
  const getTypeColor = (type?: Conversation['type']) => {
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
    <div className={cn('flex flex-col h-full bg-white border-r border-sand-gray/30', className)}>
      {/* Header */}
      <div className="p-4 border-b border-sand-gray/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-midnight-forest">Conversations</h2>
          <Button 
            size="sm" 
            variant="primary"
            onClick={onNewConversation}
            className="shadow-lg"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Chat
          </Button>
        </div>

        {/* Search */}
        <SearchInput
          placeholder="Search conversations..."
          value={searchQuery}
          onSearch={setSearchQuery}
          className="mb-3"
        />

        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'unread', 'archived'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={cn(
                'px-3 py-1 text-xs rounded-full transition-all duration-200 capitalize',
                filter === filterType
                  ? 'bg-spring-green text-midnight-forest shadow-sm'
                  : 'text-base-content/60 hover:text-base-content hover:bg-sand-gray/30'
              )}
            >
              {filterType}
            </button>
          ))}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-4xl mb-3">CEA</div>
            <h3 className="text-sm font-medium text-midnight-forest mb-1">
              {searchQuery ? 'No conversations found' : 'Start your clean energy journey'}
            </h3>
            <p className="text-xs text-base-content/60 mb-4">
              {searchQuery ? 'Try a different search term' : 'Begin exploring Massachusetts green careers'}
            </p>
            {!searchQuery && (
              <Button size="sm" variant="outline-primary" onClick={onNewConversation}>
                Start First Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => onSelectConversation(conversation.id)}
                className={cn(
                  'p-3 rounded-lg cursor-pointer transition-all duration-200 group relative',
                  activeConversationId === conversation.id
                    ? 'bg-spring-green/10 border border-spring-green/20 shadow-sm'
                    : 'hover:bg-sand-gray/30 hover:shadow-sm'
                )}
              >
                {/* Conversation Header */}
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className={cn('text-sm', getTypeColor(conversation.type))}>
                      {getTypeIcon(conversation.type)}
                    </span>
                    <h4 className="font-medium text-sm text-midnight-forest truncate">
                      {conversation.title}
                    </h4>
                  </div>
                  
                  {/* Unread badge */}
                  {conversation.unreadCount && conversation.unreadCount > 0 && (
                    <span className="bg-spring-green text-midnight-forest text-xs px-1.5 py-0.5 rounded-full font-medium">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>

                {/* Preview */}
                <p className="text-xs text-base-content/70 mb-2 leading-relaxed">
                  {truncate(conversation.preview, 80)}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-base-content/50">
                    {formatRelativeTime(conversation.timestamp)}
                  </span>
                  
                  {/* Tags */}
                  {conversation.tags && conversation.tags.length > 0 && (
                    <div className="flex gap-1">
                      {conversation.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-moss-green/10 text-moss-green px-1.5 py-0.5 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Menu (on hover) */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="flex gap-1">
                    {onArchiveConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onArchiveConversation(conversation.id);
                        }}
                        className="p-1 rounded text-base-content/40 hover:text-moss-green hover:bg-moss-green/10"
                        title={conversation.archived ? 'Unarchive' : 'Archive'}
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M5 8l6 6 6-6" />
                        </svg>
                      </button>
                    )}
                    {onDeleteConversation && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conversation.id);
                        }}
                        className="p-1 rounded text-base-content/40 hover:text-error hover:bg-error/10"
                        title="Delete conversation"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-3 border-t border-sand-gray/20 bg-sand-gray/10">
        <div className="flex items-center justify-between text-xs text-base-content/60">
          <span>{filteredConversations.length} conversation{filteredConversations.length !== 1 ? 's' : ''}</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-spring-green rounded-full animate-pulse"></span>
            ACT Assistant
          </span>
        </div>
      </div>
    </div>
  );
};

export default ConversationsList;
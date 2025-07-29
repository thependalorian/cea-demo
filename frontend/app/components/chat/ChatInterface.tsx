/**
 * ChatInterface Component - ACT Climate Economy Assistant
 * 
 * Purpose: Main chat interface with AI streaming, voice input, and ACT branding
 * Location: /app/components/chat/ChatInterface.tsx
 * Used by: Chat pages for the primary conversational experience
 * 
 * Features:
 * - Real-time message streaming from AI assistant
 * - Voice input and audio output capabilities
 * - Massachusetts clean energy context and suggestions
 * - ACT brand styling with glass morphism
 * - File upload for resumes and documents
 * - Accessibility compliant chat experience
 * - Smart suggestions for green career questions
 * 
 * @example
 * <ChatInterface 
 *   conversationId="conv-123"
 *   onSendMessage={handleSend}
 *   onVoiceToggle={handleVoice}
 *   isStreaming={false}
 * />
 */

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input, Textarea } from '@/components/ui/input';
import { Spinner } from '@/components/ui/loading';
import MessageItem from './MessageItem';
import TypingIndicator from './TypingIndicator';
import VoiceWave from './VoiceWave';

// Message types
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: Date;
  attachments?: {
    name: string;
    type: string;
    url: string;
    size: number;
  }[];
  metadata?: {
    conversationType?: 'job_search' | 'career_advice' | 'skill_assessment' | 'general';
    sourceDocuments?: string[];
    confidence?: number;
  };
}

export interface ChatInterfaceProps {
  conversationId?: string;
  messages: Message[];
  onSendMessage: (content: string, attachments?: File[]) => void;
  onVoiceToggle?: () => void;
  isStreaming?: boolean;
  isVoiceActive?: boolean;
  className?: string;
  disabled?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  conversationId,
  messages,
  onSendMessage,
  onVoiceToggle,
  isStreaming = false,
  isVoiceActive = false,
  className,
  disabled = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isMultiline, setIsMultiline] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when conversation changes
  useEffect(() => {
    if (textareaRef.current && !disabled) {
      textareaRef.current.focus();
    }
  }, [conversationId, disabled]);

  // Handle message sending
  const handleSend = () => {
    if (!inputValue.trim() && attachments.length === 0) return;
    if (disabled || isStreaming) return;

    onSendMessage(inputValue.trim(), attachments);
    setInputValue('');
    setAttachments([]);
    setIsMultiline(false);
  };

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Enter' && e.shiftKey) {
      setIsMultiline(true);
    }
  };

  // Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  // Remove attachment
  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  // Massachusetts green career suggestions
  const suggestions = [
    "What solar installation jobs are available in Massachusetts?",
    "How can I transition to clean energy careers?", 
    "Analyze my resume for green energy opportunities",
    "What skills do I need for wind energy jobs?",
    "Find clean transportation careers near Boston",
    "Help me prepare for energy efficiency interviews"
  ];

  const showSuggestions = messages.length === 0 && !inputValue;

  return (
    <div className={cn('flex flex-col h-full bg-gradient-to-b from-white to-sand-gray/20', className)}>
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center h-full text-center max-w-2xl mx-auto">
            <div className="mb-8">
                              <div className="text-6xl mb-4">CEA</div>
              <h1 className="text-2xl font-bold text-midnight-forest mb-3">
                Welcome to ACT Climate Assistant
              </h1>
              <p className="text-base-content/70 leading-relaxed mb-6">
                Your AI-powered guide to Massachusetts clean energy careers. 
                I can help you find green jobs, analyze your resume, translate skills, 
                and explore sustainable career paths.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8 text-sm">
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-spring-green font-bold text-lg">15K+</div>
                  <div className="text-base-content/60">Clean Energy Jobs</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-moss-green font-bold text-lg">$65K</div>
                  <div className="text-base-content/60">Average Salary</div>
                </div>
                <div className="glass-card p-4 rounded-lg">
                  <div className="text-midnight-forest font-bold text-lg">80%</div>
                  <div className="text-base-content/60">Job Growth Rate</div>
                </div>
              </div>
            </div>

            {/* Suggestions */}
            {showSuggestions && (
              <div className="w-full max-w-xl">
                <h3 className="text-sm font-medium text-midnight-forest mb-3">
                  Try asking about:
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => setInputValue(suggestion)}
                      className="p-3 text-left text-sm bg-white border border-sand-gray/30 rounded-lg hover:border-spring-green/30 hover:bg-spring-green/5 transition-all duration-200 text-base-content/80 hover:text-base-content"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          // Messages
          <>
            {messages.map((message) => (
              <MessageItem key={message.id} message={message} />
            ))}
            
            {/* Typing Indicator */}
            {isStreaming && <TypingIndicator />}
          </>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-sand-gray/30 bg-white/50">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center gap-2 bg-spring-green/10 border border-spring-green/20 rounded-lg px-3 py-1 text-sm">
                <span className="text-spring-green">📎</span>
                <span className="text-midnight-forest truncate max-w-[150px]">{file.name}</span>
                <button
                  onClick={() => removeAttachment(index)}
                  className="text-sand-gray hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-sand-gray/30 bg-white p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1 relative">
            {isMultiline ? (
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about clean energy careers in Massachusetts..."
                disabled={disabled || isStreaming}
                rows={3}
                className="resize-none"
              />
            ) : (
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about clean energy careers in Massachusetts..."
                disabled={disabled || isStreaming}
                className="pr-20"
              />
            )}
            
            {/* Switch to multiline */}
            {!isMultiline && (
              <button
                onClick={() => setIsMultiline(true)}
                className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-base-content/40 hover:text-base-content"
                title="Expand for multiline"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            )}
          </div>

          {/* File Upload Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled}
            className="p-2 rounded-lg text-moss-green hover:bg-moss-green/10 transition-colors disabled:opacity-50"
            title="Upload resume or documents for analysis"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>

          {/* Voice Input */}
          {onVoiceToggle && (
            <button
              onClick={onVoiceToggle}
              disabled={disabled}
              className={cn(
                'p-2 rounded-lg transition-all duration-200 disabled:opacity-50',
                isVoiceActive 
                  ? 'bg-spring-green text-midnight-forest shadow-lg' 
                  : 'text-moss-green hover:bg-moss-green/10'
              )}
              title={isVoiceActive ? 'Stop voice input' : 'Start voice input'}
            >
              {isVoiceActive ? (
                <VoiceWave />
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              )}
            </button>
          )}

          {/* Send Button */}
          <Button
            onClick={handleSend}
            disabled={disabled || isStreaming || (!inputValue.trim() && attachments.length === 0)}
            variant="primary"
            size="default"
            className="shadow-lg"
          >
            {isStreaming ? (
              <Spinner size="sm" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </Button>
        </div>

        {/* Helper Text */}
        <div className="mt-2 text-xs text-base-content/50 flex items-center justify-between">
          <span>
            Press Enter to send, Shift+Enter for new line
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 bg-spring-green rounded-full animate-pulse"></span>
            ACT AI Assistant
          </span>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
        onChange={handleFileSelect}
        className="hidden"
        title="Upload resume or documents for analysis"
      />
    </div>
  );
};

export default ChatInterface; 
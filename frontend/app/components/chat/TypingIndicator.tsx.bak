/**
 * TypingIndicator Component - ACT Climate Economy Assistant
 * 
 * Purpose: AI thinking animation with ACT branding and eco-themed messages
 * Location: /app/components/chat/TypingIndicator.tsx
 * Used by: ChatInterface to show when AI assistant is processing/responding
 * 
 * Features:
 * - Animated typing dots with ACT colors
 * - Rotating eco-friendly status messages
 * - Glass morphism styling
 * - Smooth entrance animations
 * - Massachusetts clean energy context
 * 
 * @example
 * <TypingIndicator />
 */

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

export interface TypingIndicatorProps {
  className?: string;
  showMessage?: boolean;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ 
  className, 
  showMessage = true 
}) => {
  const [messageIndex, setMessageIndex] = useState(0);

  // Eco-friendly thinking messages
  const thinkingMessages = [
    "Analyzing clean energy opportunities...",
    "Searching Massachusetts green jobs...",
    "Processing your sustainable career goals...",
    "Connecting you to renewable energy paths...",
    "Exploring wind and solar careers...",
    "Building your green future roadmap...",
    "Calculating clean energy potential...",
    "Discovering climate solutions careers...",
    "Powering up your eco-career search...",
    "Growing sustainable opportunities..."
  ];

  // Rotate messages
  useEffect(() => {
    if (!showMessage) return;

    const interval = setInterval(() => {
      setMessageIndex(prev => (prev + 1) % thinkingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [showMessage, thinkingMessages.length]);

  return (
    <div className={cn('flex justify-start animate-in slide-in-from-left-5 duration-300', className)}>
      <div className="flex gap-3 max-w-[80%]">
        {/* AI Avatar */}
        <div className="w-8 h-8 rounded-full bg-moss-green text-white flex items-center justify-center text-sm flex-shrink-0 mt-1">
          🌱
        </div>

        {/* Typing Bubble */}
        <div className="bg-white border border-sand-gray/30 text-midnight-forest rounded-r-xl rounded-tl-xl shadow-sm">
          <div className="p-4">
            {/* Typing Animation */}
            <div className="flex items-center gap-2">
              {/* Animated Dots */}
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-spring-green rounded-full animate-bounce" 
                     style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-moss-green rounded-full animate-bounce" 
                     style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-midnight-forest rounded-full animate-bounce" 
                     style={{ animationDelay: '300ms' }} />
              </div>

              {/* Status Message */}
              {showMessage && (
                <span className="text-sm text-base-content/70 ml-2 animate-pulse">
                  {thinkingMessages[messageIndex]}
                </span>
              )}
            </div>

            {/* Progress Indicator */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-1 bg-sand-gray/30 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-spring-green via-moss-green to-midnight-forest rounded-full animate-pulse" 
                     style={{ width: '60%' }} />
              </div>
              <span className="text-xs text-base-content/50">
                Processing...
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator; 
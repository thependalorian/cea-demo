/**
 * VoiceWave Component - ACT Climate Economy Assistant
 * 
 * Purpose: Audio input visualization with animated waveform and ACT branding
 * Location: /app/components/chat/VoiceWave.tsx
 * Used by: ChatInterface for voice input feedback and recording indication
 * 
 * Features:
 * - Animated waveform visualization
 * - ACT brand color scheme (Spring Green wave)
 * - Responsive to audio levels (when integrated with audio API)
 * - Smooth pulse animations
 * - Accessibility compliant
 * 
 * @example
 * <VoiceWave isRecording={true} audioLevel={0.7} />
 */

import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export interface VoiceWaveProps {
  isRecording?: boolean;
  audioLevel?: number; // 0-1 scale
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ 
  isRecording = true, 
  audioLevel = 0.5, 
  className,
  size = 'default'
}) => {
  const [bars, setBars] = useState<number[]>([]);

  // Generate animated bars
  useEffect(() => {
    const generateBars = () => {
      const newBars = Array.from({ length: 5 }, () => {
        // Base height with audio level influence
        const baseHeight = 0.2 + (audioLevel * 0.6);
        // Add random variation for animation
        const variation = Math.random() * 0.4 - 0.2;
        return Math.max(0.1, Math.min(1, baseHeight + variation));
      });
      setBars(newBars);
    };

    if (isRecording) {
      generateBars();
      const interval = setInterval(generateBars, 150);
      return () => clearInterval(interval);
    } else {
      setBars([0.2, 0.2, 0.2, 0.2, 0.2]);
    }
  }, [isRecording, audioLevel]);

  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'w-4 h-4',
      bar: 'w-0.5',
      maxHeight: 'h-4'
    },
    default: {
      container: 'w-5 h-5',
      bar: 'w-0.5',
      maxHeight: 'h-5'
    },
    lg: {
      container: 'w-6 h-6',
      bar: 'w-1',
      maxHeight: 'h-6'
    }
  };

  const config = sizeConfig[size];

  return (
    <div className={cn('flex items-center justify-center', config.container, className)}>
      <div className="flex items-end justify-center gap-0.5 h-full">
        {bars.map((height, index) => (
          <div
            key={index}
            className={cn(
              config.bar,
              'bg-spring-green rounded-full transition-all duration-150 ease-in-out',
              isRecording && 'animate-pulse'
            )}
            style={{
              height: `${height * 100}%`,
              animationDelay: `${index * 50}ms`,
              minHeight: '2px'
            }}
          />
        ))}
      </div>

      {/* Recording pulse overlay */}
      {isRecording && (
        <div className="absolute inset-0 rounded-full border-2 border-spring-green/30 animate-ping" />
      )}
    </div>
  );
};

export default VoiceWave; 
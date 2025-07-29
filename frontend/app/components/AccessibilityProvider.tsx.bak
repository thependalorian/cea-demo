/**
 * AccessibilityProvider - Comprehensive Accessibility Features
 * 
 * Purpose: Provides accessibility context and features for WCAG 2.1 AA compliance
 * Location: /app/components/AccessibilityProvider.tsx
 * Used by: Main layout.tsx to wrap the entire app with accessibility features
 * 
 * Features:
 * - High contrast mode toggle
 * - Font size adjustment (large, extra-large)
 * - Reduced motion preferences
 * - Screen reader announcements
 * - Keyboard navigation support
 * - Focus management
 * - ARIA live regions
 */

'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Accessibility settings interface
interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'normal' | 'large' | 'extra-large';
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
}

// Accessibility context type
interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  announce: (message: string, priority?: 'polite' | 'assertive') => void;
  focusElement: (elementId: string) => void;
  resetSettings: () => void;
}

// Default accessibility settings
const defaultSettings: AccessibilitySettings = {
  highContrast: false,
  fontSize: 'normal',
  reducedMotion: false,
  screenReader: false,
  keyboardNavigation: true,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

export function AccessibilityProvider({ children }: AccessibilityProviderProps) {
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);
  const [announcements, setAnnouncements] = useState<string[]>([]);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedSettings = localStorage.getItem('cea-accessibility-settings');
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          setSettings({ ...defaultSettings, ...parsed });
        }

        // Detect user preferences
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
        
        if (prefersReducedMotion || prefersHighContrast) {
          setSettings(prev => ({
            ...prev,
            reducedMotion: prefersReducedMotion,
            highContrast: prefersHighContrast,
          }));
        }

        // Detect screen reader usage
        const isScreenReader = window.navigator.userAgent.includes('NVDA') ||
                               window.navigator.userAgent.includes('JAWS') ||
                               window.speechSynthesis !== undefined;
        
        setSettings(prev => ({
          ...prev,
          screenReader: isScreenReader,
        }));

      } catch (error) {
        console.error('Error loading accessibility settings:', error);
      }
    }
  }, []);

  // Apply settings to document when they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const body = document.body;
      const html = document.documentElement;

      // Apply high contrast
      if (settings.highContrast) {
        body.classList.add('high-contrast');
      } else {
        body.classList.remove('high-contrast');
      }

      // Apply font size
      body.classList.remove('font-size-large', 'font-size-extra-large');
      if (settings.fontSize === 'large') {
        body.classList.add('font-size-large');
      } else if (settings.fontSize === 'extra-large') {
        body.classList.add('font-size-extra-large');
      }

      // Apply reduced motion
      if (settings.reducedMotion) {
        html.style.setProperty('--animation-duration', '0.01ms');
        html.style.setProperty('--transition-duration', '0.01ms');
      } else {
        html.style.removeProperty('--animation-duration');
        html.style.removeProperty('--transition-duration');
      }

      // Save settings to localStorage
      try {
        localStorage.setItem('cea-accessibility-settings', JSON.stringify(settings));
      } catch (error) {
        console.error('Error saving accessibility settings:', error);
      }
    }
  }, [settings]);

  // Keyboard navigation setup
  useEffect(() => {
    if (!settings.keyboardNavigation) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      // Tab navigation enhancement
      if (event.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }

      // Escape key to close modals/dropdowns
      if (event.key === 'Escape') {
        const activeDropdown = document.querySelector('.dropdown.dropdown-open');
        if (activeDropdown) {
          activeDropdown.classList.remove('dropdown-open');
        }

        const activeModal = document.querySelector('.modal.modal-open');
        if (activeModal) {
          activeModal.classList.remove('modal-open');
        }
      }

      // Alt + M for main content skip link
      if (event.altKey && event.key === 'm') {
        event.preventDefault();
        const mainContent = document.getElementById('main-content');
        if (mainContent) {
          mainContent.focus();
          mainContent.scrollIntoView();
        }
      }

      // Alt + N for navigation
      if (event.altKey && event.key === 'n') {
        event.preventDefault();
        const navigation = document.querySelector('nav, .navbar');
        if (navigation instanceof HTMLElement) {
          navigation.focus();
        }
      }
    };

    const handleMouseDown = () => {
      document.body.classList.remove('keyboard-navigation');
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, [settings.keyboardNavigation]);

  // Update a specific setting
  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  // Announce message to screen readers
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (settings.screenReader) {
      setAnnouncements(prev => [...prev, message]);
      
      // Clear announcement after a delay
      setTimeout(() => {
        setAnnouncements(prev => prev.filter(msg => msg !== message));
      }, 5000);

      // Use Web Speech API if available
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  // Focus specific element by ID
  const focusElement = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      element.focus();
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Reset all settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    announce('Accessibility settings have been reset to defaults', 'assertive');
  };

  const value: AccessibilityContextType = {
    settings,
    updateSetting,
    announce,
    focusElement,
    resetSettings,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
      
      {/* ARIA Live Region for Announcements */}
      <div
        id="accessibility-announcements"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcements.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>

      {/* Assertive Announcements */}
      <div
        id="accessibility-announcements-assertive"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Skip Links */}
      <div className="skip-links">
        <a
          href="#main-content"
          className="skip-link"
          onFocus={() => announce('Skip to main content link focused')}
        >
          Skip to main content
        </a>
        <a
          href="#navigation"
          className="skip-link"
          onFocus={() => announce('Skip to navigation link focused')}
        >
          Skip to navigation
        </a>
        <a
          href="#footer"
          className="skip-link"
          onFocus={() => announce('Skip to footer link focused')}
        >
          Skip to footer
        </a>
      </div>

      {/* Accessibility Styles */}
      <style jsx global>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }

        .skip-links {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 9999;
        }

        .skip-link {
          position: absolute;
          top: -40px;
          left: 6px;
          background: var(--spring-green);
          color: var(--midnight-forest);
          padding: 8px 12px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          transition: top 0.3s ease;
          z-index: 10000;
        }

        .skip-link:focus {
          top: 6px;
        }

        .keyboard-navigation *:focus {
          outline: 3px solid var(--spring-green) !important;
          outline-offset: 2px !important;
        }

        .high-contrast {
          filter: contrast(150%);
        }

        .high-contrast .btn {
          border: 2px solid currentColor;
        }

        .high-contrast .card {
          border: 2px solid currentColor;
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }

        @media (prefers-contrast: high) {
          .high-contrast {
            filter: contrast(200%);
          }
        }

        /* Font size scaling */
        .font-size-large {
          font-size: 1.125rem;
        }

        .font-size-large h1 { font-size: 3.5rem; }
        .font-size-large h2 { font-size: 2.5rem; }
        .font-size-large h3 { font-size: 2rem; }
        .font-size-large .btn { padding: 1rem 1.5rem; }

        .font-size-extra-large {
          font-size: 1.25rem;
        }

        .font-size-extra-large h1 { font-size: 4rem; }
        .font-size-extra-large h2 { font-size: 3rem; }
        .font-size-extra-large h3 { font-size: 2.25rem; }
        .font-size-extra-large .btn { padding: 1.25rem 2rem; }
      `}</style>
    </AccessibilityContext.Provider>
  );
}

// Custom hook to use accessibility context
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

// Export the context for direct usage if needed
export { AccessibilityContext }; 
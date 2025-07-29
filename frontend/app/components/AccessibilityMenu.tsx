/**
 * AccessibilityMenu - Floating Accessibility Controls
 * 
 * Purpose: Provides a floating menu with accessibility controls and settings
 * Location: /app/components/AccessibilityMenu.tsx
 * Used by: Main layout.tsx as a global accessibility controls overlay
 * 
 * Features:
 * - Floating toggle button for easy access
 * - High contrast mode toggle
 * - Font size adjustment controls
 * - Motion preference settings
 * - Keyboard navigation shortcuts info
 * - Screen reader announcements
 * - Settings persistence
 */

'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAccessibility } from './AccessibilityProvider';

export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  
  const { 
    settings, 
    updateSetting, 
    announce, 
    resetSettings 
  } = useAccessibility();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Alt + A to toggle accessibility menu
      if (event.altKey && event.key === 'a') {
        event.preventDefault();
        setIsOpen(!isOpen);
        announce(isOpen ? 'Accessibility menu closed' : 'Accessibility menu opened');
      }

      // Escape to close menu
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        announce('Accessibility menu closed');
        toggleRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, announce]);

  const handleToggleChange = (key: keyof typeof settings, value: unknown) => {
    updateSetting(key, value);
    
    // Provide feedback for each setting
    const feedbackMessages = {
      highContrast: value ? 'High contrast mode enabled' : 'High contrast mode disabled',
      fontSize: `Font size changed to ${value}`,
      reducedMotion: value ? 'Reduced motion enabled' : 'Reduced motion disabled',
      screenReader: value ? 'Screen reader support enabled' : 'Screen reader support disabled',
      keyboardNavigation: value ? 'Keyboard navigation enabled' : 'Keyboard navigation disabled',
    };
    
    announce(feedbackMessages[key], 'assertive');
  };

  const keyboardShortcuts = [
    { keys: 'Alt + A', description: 'Toggle accessibility menu' },
    { keys: 'Alt + M', description: 'Skip to main content' },
    { keys: 'Alt + N', description: 'Skip to navigation' },
    { keys: 'Tab', description: 'Navigate through interactive elements' },
    { keys: 'Shift + Tab', description: 'Navigate backwards' },
    { keys: 'Enter/Space', description: 'Activate buttons and links' },
    { keys: 'Escape', description: 'Close modals and menus' },
  ];

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        ref={toggleRef}
        onClick={() => {
          setIsOpen(!isOpen);
          announce(isOpen ? 'Accessibility menu closed' : 'Accessibility menu opened');
        }}
        className={`
          fixed bottom-6 right-6 z-50 
          w-14 h-14 rounded-full shadow-lg
          bg-midnight-forest text-spring-green
          hover:bg-moss-green hover:text-white
          focus:outline-none focus:ring-4 focus:ring-spring-green/50
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          ${isOpen ? 'rotate-45' : 'hover:scale-110'}
        `}
        aria-label={isOpen ? 'Close accessibility menu' : 'Open accessibility menu'}
        aria-expanded={isOpen}
        aria-controls="accessibility-menu"
        title="Accessibility Options (Alt + A)"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" 
          />
        </svg>
      </button>

      {/* Accessibility Menu Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          id="accessibility-menu"
          className="
            fixed bottom-24 right-6 z-40
            w-80 max-w-[calc(100vw-3rem)]
            bg-base-100 border border-base-300
            rounded-lg shadow-xl
            p-6 space-y-6
            max-h-[calc(100vh-8rem)] overflow-y-auto
          "
          role="dialog"
          aria-labelledby="accessibility-menu-title"
          aria-modal="true"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 
              id="accessibility-menu-title"
              className="text-lg font-bold text-midnight-forest flex items-center gap-2"
            >
              <span className="text-spring-green">A11Y</span>
              Accessibility
            </h2>
            <button
              onClick={() => {
                setIsOpen(false);
                announce('Accessibility menu closed');
              }}
              className="btn btn-ghost btn-sm btn-square"
              aria-label="Close accessibility menu"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Visual Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-moss-green flex items-center gap-2">
                              <span>VISION</span>
              Visual Settings
            </h3>
            
            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between">
              <label htmlFor="high-contrast-toggle" className="text-sm font-medium">
                High Contrast Mode
              </label>
              <input
                id="high-contrast-toggle"
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.highContrast}
                onChange={(e) => handleToggleChange('highContrast', e.target.checked)}
                aria-describedby="high-contrast-desc"
              />
            </div>
            <p id="high-contrast-desc" className="text-xs text-base-content/60">
              Increases color contrast for better visibility
            </p>

            {/* Font Size Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Font Size</label>
              <div className="flex gap-2">
                {(['normal', 'large', 'extra-large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => handleToggleChange('fontSize', size)}
                    className={`
                      btn btn-sm flex-1 normal-case
                      ${settings.fontSize === size 
                        ? 'btn-primary' 
                        : 'btn-outline border-moss-green text-moss-green hover:bg-moss-green hover:text-white'
                      }
                    `}
                    aria-pressed={settings.fontSize === size}
                  >
                    {size === 'normal' ? 'A' : size === 'large' ? 'A+' : 'A++'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Motion Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-moss-green flex items-center gap-2">
              <span>🎭</span>
              Motion Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="reduced-motion-toggle" className="text-sm font-medium">
                Reduce Motion
              </label>
              <input
                id="reduced-motion-toggle"
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.reducedMotion}
                onChange={(e) => handleToggleChange('reducedMotion', e.target.checked)}
                aria-describedby="reduced-motion-desc"
              />
            </div>
            <p id="reduced-motion-desc" className="text-xs text-base-content/60">
              Minimizes animations and transitions
            </p>
          </div>

          {/* Navigation Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-moss-green flex items-center gap-2">
                              <span>KEYBOARD</span>
              Navigation Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="keyboard-nav-toggle" className="text-sm font-medium">
                Keyboard Navigation
              </label>
              <input
                id="keyboard-nav-toggle"
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.keyboardNavigation}
                onChange={(e) => handleToggleChange('keyboardNavigation', e.target.checked)}
                aria-describedby="keyboard-nav-desc"
              />
            </div>
            <p id="keyboard-nav-desc" className="text-xs text-base-content/60">
              Enhanced keyboard navigation and focus indicators
            </p>

            <button
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              className="btn btn-outline btn-sm w-full border-moss-green text-moss-green hover:bg-moss-green hover:text-white"
              aria-expanded={showKeyboardHelp}
              aria-controls="keyboard-shortcuts"
            >
              {showKeyboardHelp ? 'Hide' : 'Show'} Keyboard Shortcuts
            </button>
          </div>

          {/* Keyboard Shortcuts Help */}
          {showKeyboardHelp && (
            <div id="keyboard-shortcuts" className="space-y-2 p-4 bg-base-200 rounded-lg">
              <h4 className="font-semibold text-sm text-midnight-forest">Keyboard Shortcuts</h4>
              <div className="space-y-1">
                {keyboardShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex justify-between text-xs">
                    <kbd className="kbd kbd-xs">{shortcut.keys}</kbd>
                    <span className="text-base-content/70">{shortcut.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Screen Reader Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-moss-green flex items-center gap-2">
              <span>🔊</span>
              Audio Settings
            </h3>
            
            <div className="flex items-center justify-between">
              <label htmlFor="screen-reader-toggle" className="text-sm font-medium">
                Audio Announcements
              </label>
              <input
                id="screen-reader-toggle"
                type="checkbox"
                className="toggle toggle-primary"
                checked={settings.screenReader}
                onChange={(e) => handleToggleChange('screenReader', e.target.checked)}
                aria-describedby="screen-reader-desc"
              />
            </div>
            <p id="screen-reader-desc" className="text-xs text-base-content/60">
              Provides audio feedback for actions and navigation
            </p>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-4 border-t border-base-300">
            <button
              onClick={() => {
                resetSettings();
                announce('All accessibility settings have been reset to defaults', 'assertive');
              }}
              className="btn btn-outline btn-sm w-full text-warning border-warning hover:bg-warning hover:text-white"
            >
              Reset All Settings
            </button>
            
            <p className="text-xs text-center text-base-content/60">
              Settings are automatically saved
            </p>
          </div>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-30 lg:hidden"
          onClick={() => {
            setIsOpen(false);
            announce('Accessibility menu closed');
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
} 
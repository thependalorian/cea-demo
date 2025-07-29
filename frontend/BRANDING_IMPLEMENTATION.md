# Alliance for Climate Transition (ACT) 
# Deep-Dive Frontend Branding Implementation Guide
## Apple-Level UX/UI Standards

---

## Executive Summary

This comprehensive guide establishes **Apple-caliber design standards** for the Alliance for Climate Transition platform, ensuring every interaction reflects the sophistication of the climate economy while maintaining accessibility and performance excellence.

**Design Philosophy**: *"Intuitive simplicity that empowers climate action"*

---

## 1. Color System: Beyond Basic Implementation

### 1.1 Color Psychology & Hierarchy

```typescript
// Color system with semantic meaning and perceptual optimization
const ACTColorSystem = {
  // Primary Palette - Perceptually uniform
  core: {
    midnightForest: {
      hex: '#001818',
      rgb: [0, 24, 24],
      hsl: [180, 100, 5],
      perceptualLightness: 9, // L* in LAB color space
      semantics: ['authority', 'depth', 'stability'],
      usage: ['primary text', 'navigation', 'headers']
    },
    springGreen: {
      hex: '#B2DE26',
      rgb: [178, 222, 38],
      hsl: [74, 73, 51],
      perceptualLightness: 82,
      semantics: ['growth', 'action', 'hope'],
      usage: ['CTAs', 'progress indicators', 'active states']
    },
    mossGreen: {
      hex: '#394816',
      rgb: [57, 72, 22],
      hsl: [78, 53, 18],
      perceptualLightness: 26,
      semantics: ['nature', 'partnership', 'reliability'],
      usage: ['secondary actions', 'partner theming']
    }
  },

  // Extended scales with mathematical precision
  scales: {
    springGreen: generatePerceptualScale('#B2DE26', 11),
    mossGreen: generatePerceptualScale('#394816', 11),
    midnightForest: generatePerceptualScale('#001818', 11)
  }
};

// Apple-style color generation function
function generatePerceptualScale(baseColor: string, steps: number): ColorScale {
  // Uses OKLCH color space for perceptually uniform scaling
  return {
    50: adjustOKLCH(baseColor, { lightness: 0.95 }),
    100: adjustOKLCH(baseColor, { lightness: 0.90 }),
    // ... generated with perceptual uniformity
    900: adjustOKLCH(baseColor, { lightness: 0.15 })
  };
}
```

### 1.2 Dynamic Color Adaptation

```css
/* Context-aware color system */
:root {
  /* Base colors */
  --act-midnight-forest: oklch(0.09 0.02 180);
  --act-spring-green: oklch(0.82 0.15 74);
  --act-moss-green: oklch(0.26 0.08 78);
  
  /* Adaptive variants */
  --act-surface-primary: light-dark(
    oklch(1.0 0 0), 
    oklch(0.12 0.02 180)
  );
  
  --act-text-primary: light-dark(
    var(--act-midnight-forest),
    oklch(0.95 0.02 180)
  );
  
  /* Elevation-based alpha channels */
  --act-elevation-1: color-mix(in oklch, var(--act-surface-primary), transparent 5%);
  --act-elevation-2: color-mix(in oklch, var(--act-surface-primary), transparent 8%);
  --act-elevation-3: color-mix(in oklch, var(--act-surface-primary), transparent 12%);
}

/* Apple-style vibrancy effects */
.glass-vibrancy {
  background: color-mix(in oklch, var(--act-surface-primary) 80%, transparent);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid color-mix(in oklch, var(--act-spring-green) 20%, transparent);
}
```

### 1.3 Accessibility & Contrast Optimization

```typescript
// WCAG AAA compliance validation
interface ColorContrastValidation {
  ratio: number;
  wcagLevel: 'AA' | 'AAA' | 'FAIL';
  recommendedFor: string[];
}

const validateContrast = (foreground: string, background: string): ColorContrastValidation => {
  const ratio = calculateOKLCHContrast(foreground, background);
  
  return {
    ratio,
    wcagLevel: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : 'FAIL',
    recommendedFor: ratio >= 7 ? ['body text', 'UI text'] : 
                   ratio >= 4.5 ? ['large text', 'icons'] : ['decorative only']
  };
};

// Auto-adjusting text colors
.text-adaptive {
  color: color-contrast(var(--background-color) vs #001818, #ffffff);
}
```

---

## 2. Typography: Information Architecture Excellence

### 2.1 Typographic Scale & Rhythm

```css
/* Apple-inspired modular scale */
:root {
  /* Base settings */
  --font-size-base: 16px;
  --line-height-base: 1.5;
  --scale-ratio: 1.25; /* Perfect fourth */
  
  /* Calculated scale */
  --font-size-xs: calc(var(--font-size-base) / var(--scale-ratio) / var(--scale-ratio));
  --font-size-sm: calc(var(--font-size-base) / var(--scale-ratio));
  --font-size-md: var(--font-size-base);
  --font-size-lg: calc(var(--font-size-base) * var(--scale-ratio));
  --font-size-xl: calc(var(--font-size-lg) * var(--scale-ratio));
  --font-size-2xl: calc(var(--font-size-xl) * var(--scale-ratio));
  --font-size-3xl: calc(var(--font-size-2xl) * var(--scale-ratio));
  
  /* Vertical rhythm */
  --spacing-base: calc(var(--font-size-base) * var(--line-height-base));
  --spacing-xs: calc(var(--spacing-base) * 0.25);
  --spacing-sm: calc(var(--spacing-base) * 0.5);
  --spacing-md: var(--spacing-base);
  --spacing-lg: calc(var(--spacing-base) * 1.5);
  --spacing-xl: calc(var(--spacing-base) * 2);
}

/* Semantic typography classes */
.text-display {
  font-family: var(--font-title);
  font-size: var(--font-size-3xl);
  line-height: 1.1;
  letter-spacing: -0.02em;
  font-weight: 700;
  font-feature-settings: 'kern' 1, 'liga' 1, 'calt' 1;
}

.text-headline {
  font-family: var(--font-title);
  font-size: var(--font-size-2xl);
  line-height: 1.2;
  letter-spacing: -0.015em;
  font-weight: 600;
  font-feature-settings: 'kern' 1, 'liga' 1;
}

.text-body {
  font-family: var(--font-body);
  font-size: var(--font-size-md);
  line-height: var(--line-height-base);
  letter-spacing: 0.01em;
  font-weight: 400;
  font-feature-settings: 'kern' 1, 'liga' 1, 'onum' 1;
}
```

### 2.2 Advanced Typography Features

```typescript
// Dynamic font loading with performance optimization
interface FontLoadingStrategy {
  preload: string[];
  fallback: string[];
  swapTimeout: number;
}

const fontStrategy: FontLoadingStrategy = {
  preload: ['Inter-Regular', 'Inter-Medium', 'Inter-SemiBold'],
  fallback: [
    'system-ui', 
    '-apple-system', 
    'BlinkMacSystemFont', 
    'Segoe UI', 
    'sans-serif'
  ],
  swapTimeout: 3000
};

// Responsive typography
const responsiveTypography = {
  display: {
    mobile: 'clamp(2rem, 8vw, 3.5rem)',
    tablet: 'clamp(2.5rem, 6vw, 4rem)',
    desktop: 'clamp(3rem, 4vw, 5rem)'
  },
  headline: {
    mobile: 'clamp(1.5rem, 6vw, 2.5rem)',
    tablet: 'clamp(2rem, 4vw, 3rem)',
    desktop: 'clamp(2.25rem, 3vw, 3.5rem)'
  }
};
```

---

## 3. Component Architecture: Apple's Design Language

### 3.1 Button System - Reimagined

```typescript
interface ACTButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'tertiary' | 'ghost' | 'glass';
  size: 'sm' | 'md' | 'lg' | 'xl';
  appearance: 'filled' | 'tinted' | 'bordered' | 'plain';
  prominence: 'default' | 'increased';
  loading?: boolean;
  hapticFeedback?: boolean;
}

const ACTButton: React.FC<ACTButtonProps> = ({
  variant = 'primary',
  size = 'md',
  appearance = 'filled',
  prominence = 'default',
  hapticFeedback = true,
  loading,
  children,
  ...props
}) => {
  const handleClick = useCallback((event: MouseEvent) => {
    // Apple-style haptic feedback simulation
    if (hapticFeedback && 'vibrate' in navigator) {
      navigator.vibrate(10);
    }
    
    // Micro-interaction animation
    const button = event.currentTarget as HTMLButtonElement;
    button.style.transform = 'scale(0.96)';
    requestAnimationFrame(() => {
      button.style.transform = '';
    });
    
    props.onClick?.(event);
  }, [hapticFeedback, props.onClick]);

  return (
    <button
      className={cn(
        // Base styles
        'relative inline-flex items-center justify-center',
        'font-medium transition-all duration-200 ease-out',
        'focus-visible:outline-none focus-visible:ring-2',
        'focus-visible:ring-spring-green/50 focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-40',
        
        // Size variants
        {
          'h-8 px-3 text-sm rounded-lg': size === 'sm',
          'h-10 px-4 py-2 text-base rounded-xl': size === 'md',
          'h-12 px-6 py-3 text-lg rounded-2xl': size === 'lg',
          'h-14 px-8 py-4 text-xl rounded-2xl': size === 'xl'
        },
        
        // Variant styles
        {
          'bg-spring-green text-midnight-forest hover:bg-spring-green/90 active:bg-spring-green/80': 
            variant === 'primary' && appearance === 'filled',
          'bg-spring-green/10 text-spring-green hover:bg-spring-green/20 active:bg-spring-green/30':
            variant === 'primary' && appearance === 'tinted',
          'border border-spring-green text-spring-green hover:bg-spring-green/10 active:bg-spring-green/20':
            variant === 'primary' && appearance === 'bordered'
        },
        
        // Prominence effects
        {
          'shadow-lg hover:shadow-xl': prominence === 'increased',
          'shadow-sm hover:shadow-md': prominence === 'default'
        }
      )}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-inherit rounded-inherit">
          <LoadingSpinner size={size} />
        </div>
      )}
      
      <span className={cn('transition-opacity duration-200', loading && 'opacity-0')}>
        {children}
      </span>
    </button>
  );
};
```

### 3.2 Card System - Material Elevation

```css
/* Apple-inspired elevation system */
.card-base {
  background: var(--act-surface-primary);
  border-radius: 16px;
  border: 0.5px solid color-mix(in oklch, var(--act-midnight-forest) 10%, transparent);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.card-elevation-1 {
  box-shadow: 
    0 1px 3px rgba(0, 0, 0, 0.05),
    0 1px 2px rgba(0, 0, 0, 0.1);
}

.card-elevation-2 {
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.06),
    0 2px 4px rgba(0, 0, 0, 0.08);
}

.card-elevation-3 {
  box-shadow: 
    0 8px 16px rgba(0, 0, 0, 0.08),
    0 4px 8px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.06);
}

/* Interactive states */
.card-interactive {
  cursor: pointer;
  transform: translateZ(0); /* Hardware acceleration */
}

.card-interactive:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.1),
    0 6px 12px rgba(0, 0, 0, 0.08),
    0 3px 6px rgba(0, 0, 0, 0.06);
}

.card-interactive:active {
  transform: translateY(-1px) scale(1.01);
  transition-duration: 0.1s;
}
```

---

## 4. Animation & Motion Design: Physics-Based Interactions

### 4.1 Spring Animation System

```typescript
// Apple-style spring physics
const SpringAnimations = {
  gentle: {
    tension: 120,
    friction: 14,
    mass: 1
  },
  wobbly: {
    tension: 180,
    friction: 12,
    mass: 1
  },
  stiff: {
    tension: 210,
    friction: 20,
    mass: 1
  }
};

// CSS spring animations using cubic-bezier
const springEasing = {
  gentle: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)'
};
```

### 4.2 Micro-Interactions

```css
/* Button press animation */
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.96); }
  100% { transform: scale(1); }
}

/* Card hover lift */
@keyframes card-lift {
  0% { 
    transform: translateY(0) scale(1);
    box-shadow: var(--shadow-sm);
  }
  100% { 
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-lg);
  }
}

/* Loading state shimmer */
@keyframes shimmer {
  0% { transform: translateX(-100%); opacity: 0; }
  50% { opacity: 1; }
  100% { transform: translateX(100%); opacity: 0; }
}

.shimmer-effect::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent,
    color-mix(in oklch, var(--act-spring-green) 20%, transparent),
    transparent
  );
  animation: shimmer 2s infinite;
}
```

### 4.3 Advanced Animation Orchestration

```typescript
// Animation sequence management
class AnimationOrchestrator {
  private timeline: Animation[] = [];
  
  sequence(animations: AnimationConfig[]): Promise<void> {
    return animations.reduce(async (prev, current) => {
      await prev;
      return this.animate(current);
    }, Promise.resolve());
  }
  
  parallel(animations: AnimationConfig[]): Promise<void[]> {
    return Promise.all(animations.map(config => this.animate(config)));
  }
  
  stagger(animations: AnimationConfig[], delay: number): Promise<void[]> {
    return Promise.all(
      animations.map((config, index) => 
        new Promise(resolve => 
          setTimeout(() => this.animate(config).then(resolve), index * delay)
        )
      )
    );
  }
}

// Usage example
const pageTransition = new AnimationOrchestrator();

await pageTransition.sequence([
  { element: '.header', animation: 'slideInDown', duration: 400 },
  { element: '.content', animation: 'fadeIn', duration: 600 },
  { element: '.footer', animation: 'slideInUp', duration: 400 }
]);
```

---

## 5. Layout & Spatial Design: Golden Ratio Implementation

### 5.1 Proportional Grid System

```css
/* Golden ratio-based grid */
:root {
  --golden-ratio: 1.618;
  --grid-unit: 8px;
  
  /* Proportional spacing */
  --space-xs: calc(var(--grid-unit) * 1);
  --space-sm: calc(var(--grid-unit) * 2);
  --space-md: calc(var(--grid-unit) * 3);
  --space-lg: calc(var(--grid-unit) * 5);
  --space-xl: calc(var(--grid-unit) * 8);
  --space-2xl: calc(var(--grid-unit) * 13);
  --space-3xl: calc(var(--grid-unit) * 21);
}

/* Responsive grid with golden ratio proportions */
.grid-golden {
  display: grid;
  grid-template-columns: 1fr var(--golden-ratio)fr;
  gap: var(--space-lg);
}

@media (max-width: 768px) {
  .grid-golden {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
}
```

### 5.2 Adaptive Layouts

```typescript
// Responsive layout hook
const useResponsiveLayout = () => {
  const [layout, setLayout] = useState<'compact' | 'regular' | 'spacious'>('regular');
  
  useEffect(() => {
    const updateLayout = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const ratio = width / height;
      
      if (width < 768) {
        setLayout('compact');
      } else if (width > 1400 && ratio > 1.5) {
        setLayout('spacious');
      } else {
        setLayout('regular');
      }
    };
    
    updateLayout();
    window.addEventListener('resize', updateLayout);
    return () => window.removeEventListener('resize', updateLayout);
  }, []);
  
  return layout;
};
```

---

## 6. Accessibility: Universal Design Principles

### 6.1 Comprehensive A11y Implementation

```typescript
// Accessibility context provider
interface AccessibilityState {
  reduceMotion: boolean;
  increaseContrast: boolean;
  fontSize: 'default' | 'large' | 'x-large';
  focusRingVisible: boolean;
  announcements: string[];
}

const AccessibilityProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AccessibilityState>({
    reduceMotion: false,
    increaseContrast: false,
    fontSize: 'default',
    focusRingVisible: false,
    announcements: []
  });
  
  // Detect system preferences
  useEffect(() => {
    const mediaQueries = {
      reduceMotion: matchMedia('(prefers-reduced-motion: reduce)'),
      increaseContrast: matchMedia('(prefers-contrast: high)'),
      darkMode: matchMedia('(prefers-color-scheme: dark)')
    };
    
    const updatePreferences = () => {
      setState(prev => ({
        ...prev,
        reduceMotion: mediaQueries.reduceMotion.matches,
        increaseContrast: mediaQueries.increaseContrast.matches
      }));
    };
    
    Object.values(mediaQueries).forEach(mq => 
      mq.addEventListener('change', updatePreferences)
    );
    
    updatePreferences();
    
    return () => {
      Object.values(mediaQueries).forEach(mq => 
        mq.removeEventListener('change', updatePreferences)
      );
    };
  }, []);
  
  return (
    <AccessibilityContext.Provider value={{ state, setState }}>
      <div 
        className={cn(
          'transition-all duration-300',
          state.reduceMotion && 'motion-reduce',
          state.increaseContrast && 'high-contrast',
          state.fontSize !== 'default' && `font-size-${state.fontSize}`
        )}
      >
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
};
```

### 6.2 Advanced Focus Management

```css
/* Apple-style focus indicators */
.focus-ring {
  position: relative;
  outline: none;
}

.focus-ring:focus-visible::before {
  content: '';
  position: absolute;
  inset: -2px;
  border: 2px solid var(--act-spring-green);
  border-radius: inherit;
  box-shadow: 
    0 0 0 4px color-mix(in oklch, var(--act-spring-green) 20%, transparent),
    inset 0 0 0 2px color-mix(in oklch, var(--act-surface-primary) 100%, transparent);
  animation: focus-ring-appear 0.2s ease-out;
}

@keyframes focus-ring-appear {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Skip navigation */
.skip-nav {
  position: absolute;
  top: -100px;
  left: 16px;
  z-index: 1000;
  padding: 8px 16px;
  background: var(--act-midnight-forest);
  color: var(--act-spring-green);
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: top 0.3s ease;
}

.skip-nav:focus {
  top: 16px;
}
```

---

## 7. Performance & Optimization: 60fps Standards

### 7.1 Critical Resource Loading

```typescript
// Progressive enhancement strategy
const CriticalResourceLoader = {
  fonts: {
    preload: ['Inter-Regular.woff2', 'Inter-Medium.woff2'],
    fallback: 'system-ui',
    timeout: 3000
  },
  
  images: {
    critical: ['hero-bg.webp', 'logo.svg'],
    lazy: true,
    formats: ['webp', 'avif', 'jpg']
  },
  
  scripts: {
    essential: ['app.js'],
    deferred: ['analytics.js', 'chat.js'],
    prefetch: ['dashboard.js']
  }
};

// Image optimization component
const OptimizedImage: React.FC<ImageProps> = ({ 
  src, 
  alt, 
  priority = false,
  sizes = "100vw",
  ...props 
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      quality={90}
      {...props}
    />
  );
};
```

### 7.2 Animation Performance

```css
/* GPU-accelerated animations */
.will-change-transform {
  will-change: transform;
}

.will-change-scroll {
  will-change: scroll-position;
}

/* Hardware acceleration triggers */
.gpu-accelerated {
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

/* Efficient transitions */
.smooth-transition {
  transition-property: transform, opacity;
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## 8. Testing & Quality Assurance

### 8.1 Visual Regression Testing

```typescript
// Component testing with accessibility checks
describe('ACT Button Component', () => {
  test('meets WCAG 2.1 AA standards', async () => {
    const { container } = render(<Button variant="primary">Test</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  test('maintains 4.5:1 contrast ratio', () => {
    const button = screen.getByRole('button');
    const styles = getComputedStyle(button);
    const contrast = calculateContrast(styles.color, styles.backgroundColor);
    expect(contrast).toBeGreaterThanOrEqual(4.5);
  });
  
  test('supports keyboard navigation', () => {
    render(<Button>Test</Button>);
    const button = screen.getByRole('button');
    
    button.focus();
    expect(button).toHaveFocus();
    
    fireEvent.keyDown(button, { key: 'Enter' });
    // Test interaction
  });
});
```

### 8.2 Performance Monitoring

```typescript
// Core Web Vitals monitoring
const performanceMonitor = {
  measureCLS: () => {
    new PerformanceObserver((entryList) => {
      for (const entry of entryList.getEntries()) {
        if (!entry.hadRecentInput) {
          // Track cumulative layout shift
          analytics.track('core_web_vital', {
            metric: 'cls',
            value: entry.value
          });
        }
      }
    }).observe({ type: 'layout-shift', buffered: true });
  },
  
  measureLCP: () => {
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      const lastEntry = entries[entries.length - 1];
      analytics.track('core_web_vital', {
        metric: 'lcp',
        value: lastEntry.startTime
      });
    }).observe({ type: 'largest-contentful-paint', buffered: true });
  }
};
```

---

## 9. Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Color system implementation with OKLCH
- [ ] Typography scale with modular proportions
- [ ] Base component library (Button, Card, Input)
- [ ] Accessibility provider setup

### Phase 2: Enhancement (Weeks 3-4)
- [ ] Advanced animation system
- [ ] Performance optimization
- [ ] Focus management system
- [ ] Responsive layout grid
- [ ] Authentication components branding 
- [ ] Admin & partner interfaces

### Phase 3: Polish (Weeks 5-6)
- [ ] Micro-interactions
- [ ] Visual regression testing
- [ ] Performance monitoring
- [ ] Documentation completion
- [ ] Resource center pages
- [ ] Notification system

---

## 10. Maintenance & Evolution

### Continuous Improvement Process
1. **Weekly Design Reviews**: Alignment with ACT brand evolution
2. **Monthly Performance Audits**: Core Web Vitals optimization
3. **Quarterly Accessibility Audits**: WCAG compliance verification
4. **Annual Brand Refresh**: Color psychology and trend analysis

### Design System Versioning
- **Major versions**: Breaking changes to design tokens
- **Minor versions**: New components or significant enhancements
- **Patch versions**: Bug fixes and minor improvements

### Quality Assurance Strategy
- **Apple-inspired QA process**: Quality checkpoints at component, page, and system levels
- **Contextual testing**: Components tested in all expected contexts (dark/light, various layouts)
- **Cross-browser validation**: Chrome, Safari, Firefox, and Edge testing on desktop and mobile
- **Accessibility scans**: Regular automated scans (axe-core) and manual testing with screen readers
- **Performance budgeting**: Component-level render time monitoring and optimization

### Data Model Consistency
- **Type synchronization**: Backend Pydantic models aligned with frontend TypeScript types
- **Single source of truth**: Generated types from database schema
- **Versioned interfaces**: API contract versioning with backward compatibility
- **Climate data taxonomy**: Standardized terminology for climate economy entities

---

**This implementation guide ensures Apple-caliber user experience while maintaining ACT's environmental mission and accessibility standards. Every interaction should feel intuitive, responsive, and purposeful.** 

---

## 11. Auth Components & User Journey

### 11.1 Login & Signup Flows

```typescript
// Authentication branding specifications
const authBrandingSystem = {
  container: {
    background: 'bg-gradient-to-br from-white to-sand-gray-100',
    formCard: 'bg-white/90 backdrop-blur-md shadow-lg border border-sand-gray-200 rounded-2xl'
  },
  logo: {
    position: 'mb-8',
    size: 'h-12 w-auto',
    animation: 'animate-gentle-breathe'
  },
  form: {
    title: {
      login: 'Sign in to ACT Climate Economy',
      register: 'Join the Climate Transition',
      reset: 'Reset your password'
    },
    fields: {
      label: 'text-midnight-forest-700 font-medium',
      input: 'border-sand-gray-300 focus:border-spring-green-400 focus:ring-spring-green-200',
      error: 'text-error-600 text-sm mt-1 font-medium'
    },
    buttons: {
      primary: 'w-full bg-spring-green shadow-button',
      social: 'w-full border border-sand-gray-300 hover:bg-sand-gray-50',
      passwordless: 'bg-moss-green text-white shadow-button'
    },
    divider: 'border-t border-sand-gray-200 my-6 relative',
    links: 'text-moss-green-600 hover:text-moss-green-700 transition'
  },
  userFlow: {
    steps: {
      initial: 'opacity-100 transition-all duration-400',
      transitioning: 'opacity-0 translate-x-4 absolute',
      complete: 'opacity-0 scale-95 absolute'
    },
    progressIndicator: {
      base: 'h-1 bg-sand-gray-200 rounded-full overflow-hidden mt-2',
      fill: 'h-full bg-spring-green animate-progress transition-all'
    }
  },
  callback: {
    success: {
      icon: 'text-spring-green-500 text-5xl mb-4',
      message: 'text-midnight-forest-700 text-xl font-medium'
    },
    error: {
      icon: 'text-error-500 text-5xl mb-4',
      message: 'text-midnight-forest-700 text-xl font-medium'
    }
  }
}
```

### 11.2 Profile Type Selection

```typescript
// Profile type selection branding
const profileTypeBranding = {
  container: 'p-6 max-w-3xl mx-auto',
  heading: 'text-midnight-forest-800 text-3xl font-bold mb-6',
  description: 'text-moss-green-700 text-lg mb-8',
  cards: {
    container: 'grid grid-cols-1 md:grid-cols-2 gap-6',
    card: {
      base: 'border-2 p-6 rounded-xl transition duration-250',
      unselected: 'border-sand-gray-300 hover:border-spring-green-300 bg-white',
      selected: 'border-spring-green-500 bg-spring-green-50/50 shadow-button'
    },
    icon: {
      job_seeker: 'text-spring-green-600 text-3xl mb-4',
      partner: 'text-moss-green-600 text-3xl mb-4',
      admin: 'text-midnight-forest-600 text-3xl mb-4'
    },
    title: 'text-xl font-bold text-midnight-forest-800 mb-2',
    description: 'text-moss-green-600 mb-4',
    features: {
      container: 'mt-4 space-y-2',
      item: 'flex items-start',
      checkmark: 'text-spring-green-500 mr-2 flex-shrink-0',
      text: 'text-midnight-forest-700'
    }
  },
  buttons: {
    container: 'mt-8 flex justify-end',
    back: 'btn btn-outline mr-4',
    continue: 'btn bg-spring-green shadow-button'
  }
}
```

## 12. Partner & Admin Experiences

### 12.1 Partner Dashboard

```typescript
// Partner dashboard branding specifications
const partnerDashboardBranding = {
  container: 'min-h-screen bg-base-200',
  header: {
    background: 'bg-moss-green-800 text-white',
    title: 'text-3xl font-bold',
    subtitle: 'text-moss-green-200 mt-2',
    actions: {
      container: 'flex space-x-4 mt-6',
      button: 'bg-spring-green text-midnight-forest-800 hover:bg-spring-green-400'
    }
  },
  stats: {
    grid: 'grid grid-cols-1 md:grid-cols-3 gap-6',
    card: {
      background: 'bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6',
      title: 'text-moss-green-600 font-medium mb-2',
      value: 'text-4xl font-bold text-midnight-forest-800',
      trend: {
        up: 'text-spring-green-600 flex items-center',
        down: 'text-error-600 flex items-center',
        neutral: 'text-sand-gray-600 flex items-center'
      }
    }
  },
  jobListings: {
    container: 'bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6',
    header: {
      title: 'text-xl font-bold text-midnight-forest-800 mb-4',
      actions: 'text-spring-green-600 hover:text-spring-green-700'
    },
    table: {
      header: 'bg-sand-gray-100 text-moss-green-700',
      row: 'border-b border-sand-gray-200 hover:bg-spring-green-50',
      title: 'font-medium text-midnight-forest-800 hover:text-spring-green-600',
      status: {
        active: 'bg-spring-green-100 text-spring-green-800 text-xs px-2 py-1 rounded-full',
        draft: 'bg-sand-gray-100 text-sand-gray-800 text-xs px-2 py-1 rounded-full',
        closed: 'bg-moss-green-100 text-moss-green-800 text-xs px-2 py-1 rounded-full',
        expired: 'bg-error-100 text-error-800 text-xs px-2 py-1 rounded-full'
      }
    }
  },
  candidateMatches: {
    container: 'bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6',
    header: {
      title: 'text-xl font-bold text-midnight-forest-800 mb-4',
      filters: 'flex space-x-4 mb-6'
    },
    card: {
      container: 'border border-sand-gray-200 rounded-lg p-4 hover:border-spring-green-300 transition',
      name: 'font-medium text-midnight-forest-800',
      skills: 'flex flex-wrap gap-2 mt-2',
      skillBadge: 'bg-spring-green-50 text-spring-green-700 text-xs px-2 py-1 rounded-full',
      matchScore: {
        high: 'text-spring-green-600 font-bold',
        medium: 'text-moss-green-600 font-bold',
        low: 'text-sand-gray-600 font-bold'
      }
    }
  }
}
```

### 12.2 Admin Interface

```typescript
// Admin interface branding specifications
const adminInterfaceBranding = {
  layout: {
    sidebar: {
      background: 'bg-midnight-forest-900',
      activeItem: 'bg-spring-green-600 text-white',
      inactiveItem: 'text-sand-gray-200 hover:bg-midnight-forest-800',
      heading: 'text-sand-gray-400 uppercase tracking-wider text-xs'
    },
    content: 'bg-base-200 min-h-screen',
    header: {
      background: 'bg-white border-b border-sand-gray-200',
      title: 'text-midnight-forest-800 text-xl font-bold',
      breadcrumbs: 'text-moss-green-600',
      userMenu: 'border border-sand-gray-200 hover:border-spring-green-300'
    }
  },
  userManagement: {
    container: 'bg-white border border-sand-gray-200 rounded-xl',
    filters: {
      container: 'p-4 border-b border-sand-gray-200 bg-sand-gray-50',
      input: 'border-sand-gray-300 focus:border-spring-green-400',
      dropdowns: 'border-sand-gray-300 bg-white text-midnight-forest-700'
    },
    table: {
      header: 'bg-sand-gray-100 text-moss-green-600 uppercase tracking-wider text-xs',
      row: 'hover:bg-spring-green-50 border-b border-sand-gray-200',
      pagination: {
        button: 'border border-sand-gray-200 hover:border-spring-green-300',
        active: 'bg-spring-green-500 text-white border-spring-green-500'
      }
    },
    userStatus: {
      active: 'bg-spring-green-100 text-spring-green-800',
      inactive: 'bg-sand-gray-100 text-sand-gray-800',
      suspended: 'bg-error-100 text-error-800'
    }
  },
  contentManagement: {
    container: 'bg-white border border-sand-gray-200 rounded-xl p-6',
    heading: 'text-midnight-forest-800 text-xl font-bold mb-4',
    tabs: {
      container: 'border-b border-sand-gray-200 mb-6',
      tab: 'px-4 py-2 text-moss-green-600 hover:text-midnight-forest-800',
      active: 'border-b-2 border-spring-green-500 text-midnight-forest-800 font-medium'
    },
    editor: {
      container: 'border border-sand-gray-200 rounded-lg',
      toolbar: 'border-b border-sand-gray-200 bg-sand-gray-50 p-2',
      content: 'p-4 min-h-[200px]',
      button: {
        active: 'bg-spring-green-100 text-spring-green-800',
        inactive: 'hover:bg-sand-gray-100'
      }
    }
  }
}
```

## 13. Resource & Learning Pages

### 13.1 Resource Center

```typescript
// Resource center branding specifications
const resourceCenterBranding = {
  hero: {
    background: 'bg-gradient-to-br from-spring-green-50 to-moss-green-50',
    pattern: 'bg-[url("/patterns/resource-dots.svg")]',
    title: 'text-5xl font-bold text-midnight-forest-800',
    subtitle: 'text-moss-green-700 text-xl max-w-3xl mx-auto',
    search: {
      container: 'max-w-2xl mx-auto relative',
      input: 'pl-12 border-moss-green-200 focus:border-spring-green-400',
      icon: 'text-moss-green-500 absolute left-4 top-1/2 transform -translate-y-1/2'
    }
  },
  categories: {
    container: 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-12',
    card: {
      container: 'bg-white border border-sand-gray-200 rounded-xl p-6 hover:border-spring-green-300 transition',
      icon: 'text-spring-green-500 text-4xl mb-4',
      title: 'text-midnight-forest-800 text-xl font-bold mb-2',
      description: 'text-moss-green-600 mb-4',
      link: 'text-spring-green-600 hover:text-spring-green-700 font-medium'
    }
  },
  featuredResources: {
    container: 'bg-moss-green-50 border border-moss-green-100 rounded-xl p-6 mb-12',
    heading: 'text-midnight-forest-800 text-2xl font-bold mb-6',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
    card: {
      container: 'bg-white border border-sand-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition',
      image: 'h-40 w-full object-cover',
      content: 'p-6',
      title: 'text-midnight-forest-800 font-bold mb-2 hover:text-spring-green-600',
      description: 'text-moss-green-600 mb-4',
      meta: 'text-sand-gray-500 text-sm',
      tag: {
        guide: 'bg-spring-green-100 text-spring-green-800',
        video: 'bg-moss-green-100 text-moss-green-800',
        webinar: 'bg-midnight-forest-100 text-midnight-forest-800',
        report: 'bg-solar-yellow-light text-solar-yellow-dark'
      }
    }
  },
  massachusetts: {
    container: 'bg-midnight-forest-800 text-white p-8 rounded-xl mb-12',
    heading: 'text-3xl font-bold mb-4',
    content: 'text-sand-gray-200 mb-6',
    stats: {
      container: 'grid grid-cols-2 md:grid-cols-4 gap-6',
      item: {
        number: 'text-spring-green-500 text-4xl font-bold mb-2',
        label: 'text-sand-gray-200'
      }
    },
    cta: 'bg-spring-green-500 text-midnight-forest-800 hover:bg-spring-green-400'
  }
}
```

### 13.2 Career Guides & Reports

```typescript
// Career guides and reports branding
const careerGuidesBranding = {
  layout: {
    sidebar: {
      container: 'w-64 bg-white border-r border-sand-gray-200 p-6 hidden md:block',
      heading: 'text-midnight-forest-800 font-bold mb-4',
      nav: {
        item: 'text-moss-green-600 py-2 hover:text-spring-green-600',
        active: 'text-spring-green-600 font-medium',
        subItem: 'pl-4 text-sm text-moss-green-500 py-1.5 hover:text-spring-green-600'
      },
      filters: {
        container: 'mt-8 border-t border-sand-gray-200 pt-6',
        label: 'text-midnight-forest-700 font-medium mb-2',
        checkboxLabel: 'text-moss-green-600 hover:text-spring-green-600'
      }
    },
    content: 'flex-1 max-w-3xl mx-auto p-6'
  },
  guideDetail: {
    header: {
      category: 'text-spring-green-600 font-medium mb-2',
      title: 'text-midnight-forest-800 text-4xl font-bold mb-4',
      meta: 'text-moss-green-600 mb-6',
      authorCard: 'flex items-center space-x-4 mb-8',
      authorAvatar: 'h-12 w-12 rounded-full object-cover',
      authorName: 'text-midnight-forest-800 font-medium',
      authorRole: 'text-moss-green-600 text-sm'
    },
    content: {
      container: 'prose prose-green max-w-none',
      h2: 'text-midnight-forest-800 text-3xl font-bold mt-12 mb-4',
      h3: 'text-moss-green-700 text-2xl font-bold mt-8 mb-3',
      paragraph: 'text-moss-green-800 mb-6',
      link: 'text-spring-green-600 hover:text-spring-green-700 font-medium',
      blockquote: 'border-l-4 border-spring-green-400 pl-4 italic text-moss-green-700',
      callout: {
        container: 'bg-spring-green-50 border-l-4 border-spring-green-500 p-6 rounded-r-lg my-8',
        title: 'text-midnight-forest-800 font-bold mb-2',
        content: 'text-moss-green-700'
      },
      table: {
        container: 'w-full border-collapse my-8',
        header: 'bg-moss-green-50 text-moss-green-700 font-medium',
        cell: 'border border-sand-gray-200 p-3',
        row: 'hover:bg-sand-gray-50'
      }
    },
    relatedGuides: {
      container: 'mt-12 border-t border-sand-gray-200 pt-8',
      heading: 'text-midnight-forest-800 text-2xl font-bold mb-6',
      grid: 'grid grid-cols-1 md:grid-cols-3 gap-6'
    }
  }
}
```

## 14. Utility Functions & Global Helpers

### 14.1 Notification System

```typescript
// Notification system branding
const notificationSystem = {
  container: 'fixed top-4 right-4 z-50 flex flex-col gap-3 max-w-md',
  animation: {
    enter: 'transform transition-all duration-300 ease-out',
    enterFrom: 'opacity-0 translate-x-4',
    enterTo: 'opacity-100 translate-x-0',
    exit: 'transform transition-all duration-200 ease-in',
    exitFrom: 'opacity-100 translate-x-0',
    exitTo: 'opacity-0 translate-x-4'
  },
  toast: {
    base: 'pointer-events-auto overflow-hidden rounded-lg shadow-lg backdrop-blur-sm border',
    success: 'bg-spring-green-50/90 border-spring-green-300 text-spring-green-800',
    error: 'bg-error-50/90 border-error-300 text-error-800',
    warning: 'bg-warning-50/90 border-warning-300 text-warning-800',
    info: 'bg-moss-green-50/90 border-moss-green-300 text-moss-green-800'
  },
  content: {
    container: 'flex p-4',
    icon: {
      container: 'flex-shrink-0 pt-0.5',
      success: 'text-spring-green-500',
      error: 'text-error-500',
      warning: 'text-warning-500',
      info: 'text-moss-green-500'
    },
    text: {
      container: 'ml-3 w-0 flex-1',
      title: 'text-sm font-medium',
      message: 'mt-1 text-sm opacity-90'
    }
  },
  actions: {
    container: 'flex border-t border-sand-gray-100',
    button: 'flex-1 flex justify-center p-3 text-sm font-medium hover:bg-opacity-10'
  },
  progress: {
    container: 'h-1 w-full bg-sand-gray-200',
    bar: {
      success: 'bg-spring-green-500',
      error: 'bg-error-500',
      warning: 'bg-warning-500',
      info: 'bg-moss-green-500'
    }
  }
}
```

### 14.2 Form & Validation Helpers

```typescript
// Form and validation styling standards
const formValidationSystem = {
  form: {
    group: 'mb-6',
    label: {
      base: 'block mb-2 font-medium',
      required: 'after:content-["*"] after:ml-1 after:text-error-500'
    },
    helper: 'text-sm text-moss-green-600 mt-1',
    error: {
      message: 'text-sm text-error-600 mt-1 font-medium',
      icon: 'text-error-500 mr-1'
    }
  },
  validation: {
    states: {
      default: 'border-sand-gray-300',
      focus: 'border-spring-green-400 ring ring-spring-green-100',
      error: 'border-error-400 ring ring-error-100',
      success: 'border-spring-green-400 ring ring-spring-green-100',
      disabled: 'bg-sand-gray-100 text-sand-gray-500'
    },
    icons: {
      error: 'text-error-500',
      success: 'text-spring-green-500',
      loading: 'text-moss-green-500 animate-spin'
    },
    indicators: {
      strength: {
        weak: 'bg-error-500',
        medium: 'bg-warning-500',
        strong: 'bg-spring-green-500'
      },
      completion: {
        container: 'h-1 bg-sand-gray-200 rounded-full overflow-hidden',
        fill: 'h-full bg-spring-green-500 transition-all'
      }
    }
  },
  masks: {
    phone: '(___) ___-____',
    date: '__/__/____',
    ssn: '___-__-____'
  }
}
```

## 15. Data Model & Type System

### 15.1 Frontend-Backend Type Consistency

The ACT platform maintains strict type consistency between its Python backend Pydantic models and TypeScript frontend interfaces. This ensures a seamless development experience and prevents bugs caused by data inconsistency.

```typescript
// TypeScript enums matching Python Pydantic enums
export enum ProfileType {
  JOB_SEEKER = "job_seeker",
  PARTNER = "partner",
  ADMIN = "admin",
  GENERAL = "general"
}

// TypeScript interfaces mirroring Pydantic models
export interface ConsolidatedProfile {
  id: string
  email: string
  profile_type: ProfileType
  // ...other fields aligned with backend
}

// Database schema types with strict typing
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          // Typed columns matching Pydantic models
          id: string
          profile_type: ProfileType | null 
          // ...
        }
      }
    }
  }
}

// Utility types for API consistency
export type ApiRequest<T> = {
  data: T;
  metadata?: Record<string, any>;
};

export type ApiResponse<T> = {
  data: T;
  metadata?: Record<string, any>;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
};
```

### 15.2 Climate Economy Taxonomy

To ensure consistency in communication about climate economy concepts across the application, we maintain a standardized taxonomy for key domain entities:

```typescript
// Climate economy industry taxonomy
export const ClimateIndustries = {
  CLEAN_ENERGY: {
    id: "clean_energy",
    label: "Clean Energy",
    subcategories: ["solar", "wind", "hydro", "geothermal", "nuclear", "biomass"],
    icon: "solar"
  },
  SUSTAINABLE_TRANSPORT: {
    id: "sustainable_transport",
    label: "Sustainable Transportation",
    subcategories: ["electric_vehicles", "public_transit", "cycling_infrastructure"],
    icon: "ev"
  },
  CIRCULAR_ECONOMY: {
    id: "circular_economy",
    label: "Circular Economy",
    subcategories: ["recycling", "upcycling", "waste_reduction", "repair_services"],
    icon: "recycle"
  },
  // Additional industries...
};

// MA-specific climate initiatives taxonomy
export const MassachusettsInitiatives = {
  CLEANTECH_HUB: {
    id: "cleantech_hub",
    label: "Massachusetts Clean Energy Center",
    description: "Public-private partnership accelerating clean energy innovation",
    website: "https://www.masscec.com/"
  },
  GLOBAL_WARMING_SOLUTIONS: {
    id: "gwsa",
    label: "Global Warming Solutions Act",
    description: "Legislative framework requiring emissions reductions",
    targets: ["50% reduction by 2030", "Net Zero by 2050"]
  },
  // Additional MA initiatives...
};
```

## 16. Comprehensive Component & Page Audit

### 16.1 Homepage (`/page.tsx`) - Landing Experience

**Current State**: Hero sections with value propositions, showcase components
**Branding Requirements**:

```typescript
// Hero Section Brand Standards
const heroSectionConfig = {
  background: 'bg-gradient-to-br from-base-100 via-base-200 to-base-300',
  overlay: 'bg-gradient-to-r from-spring-green-10 to-moss-green-60/20',
  badgeStyle: 'bg-spring-green-20 text-midnight-forest',
  headlineHierarchy: {
    primary: 'text-6xl font-title font-bold',
    accent: 'text-spring-green',
    context: 'Massachusetts Climate Economy'
  }
}

// Showcase Component Standards
const showcaseComponents = {
  ResumeAnalysisShowcase: {
    cardBg: 'bg-white/80 backdrop-blur-lg',
    border: 'border-moss-green-100',
    iconColor: 'text-spring-green-600'
  },
  MilitarySkillsTranslationShowcase: {
    militaryBadge: 'bg-midnight-forest-100 text-midnight-forest-800',
    civilianBadge: 'bg-spring-green-100 text-spring-green-800'
  },
  CredentialEvaluationShowcase: {
    progressBars: 'bg-spring-green-200',
    completedSection: 'bg-spring-green-500'
  },
  BookingFeatureShowcase: {
    calendarAccent: 'border-moss-green-300',
    timeSlotHover: 'hover:bg-spring-green-50'
  },
  AgentTeamsShowcase: {
    teamCardGradient: 'bg-gradient-to-br from-moss-green-50 to-spring-green-50',
    agentAvatar: 'ring-2 ring-spring-green-300'
  }
}
```

### 16.2 Dashboard (`/dashboard/page.tsx`) - Data Visualization

**Current State**: Stats cards, recent activity, upcoming bookings
**Branding Requirements**:

```typescript
// Dashboard Component Standards
const dashboardBranding = {
  statsCards: {
    base: 'bg-white/90 backdrop-blur-lg border border-moss-green-100',
    iconContainer: 'bg-spring-green-100 p-3 rounded-full',
    icon: 'text-spring-green-600',
    number: 'text-3xl font-bold text-midnight-forest-800',
    label: 'text-moss-green-600'
  },
  activityFeed: {
    container: 'bg-white/80 backdrop-blur-lg',
    itemBorder: 'border-l-4 border-spring-green-300',
    timestamp: 'text-moss-green-500',
    activityType: {
      conversation: 'bg-spring-green-100 text-spring-green-800',
      job_saved: 'bg-moss-green-100 text-moss-green-800',
      booking_created: 'bg-midnight-forest-100 text-midnight-forest-800',
      session_completed: 'bg-earth-tone-100 text-earth-tone-800'
    }
  },
  upcomingBookings: {
    card: 'bg-gradient-to-r from-spring-green-50 to-moss-green-50',
    agentName: 'text-midnight-forest-800 font-semibold',
    datetime: 'text-moss-green-600',
    status: {
      pending: 'bg-warning-100 text-warning-800',
      confirmed: 'bg-spring-green-100 text-spring-green-800',
      cancelled: 'bg-error-100 text-error-800'
    }
  }
}
```

### 16.3 Chat Interface (`/chat/`, `/enhanced-chat/`) - Conversational AI

**Current State**: Real-time streaming, voice input, file upload
**Branding Requirements**:

```typescript
// Chat Component Standards
const chatInterfaceBranding = {
  container: 'bg-gradient-to-br from-base-100 to-moss-green-50/30',
  messageContainer: {
    user: {
      bubble: 'bg-spring-green-500 text-white',
      timestamp: 'text-moss-green-500'
    },
    assistant: {
      bubble: 'bg-white/90 backdrop-blur-lg border border-moss-green-100',
      text: 'text-midnight-forest-700',
      accent: 'text-spring-green-600'
    },
    system: {
      bubble: 'bg-moss-green-100 text-moss-green-800',
      icon: 'text-moss-green-600'
    }
  },
  inputArea: {
    container: 'bg-white/80 backdrop-blur-lg border-t border-moss-green-200',
    textArea: 'border-moss-green-200 focus:border-spring-green-400',
    sendButton: 'bg-spring-green-500 hover:bg-spring-green-600',
    voiceButton: {
      inactive: 'border-moss-green-300 text-moss-green-600',
      recording: 'bg-error-500 text-white animate-pulse'
    }
  },
  voiceWave: {
    waveColor: 'bg-spring-green-400',
    animation: 'animate-wave-pulse'
  },
  typingIndicator: {
    dots: 'bg-moss-green-400',
    container: 'bg-moss-green-50'
  }
}
```

### 16.4 UI Components Library - Design System Implementation

#### 16.4.1 Button Component (`/components/ui/button.tsx`)

**Current State**: Multiple variants with eco-gradient effects
**Enhanced Standards**:

```typescript
const buttonBrandingStandards = {
  variants: {
    primary: {
      base: 'bg-spring-green-500 text-white',
      hover: 'hover:bg-spring-green-600 hover:shadow-lg',
      focus: 'focus:ring-spring-green-300',
      disabled: 'disabled:bg-spring-green-200'
    },
    secondary: {
      base: 'bg-moss-green-500 text-white',
      hover: 'hover:bg-moss-green-600',
      focus: 'focus:ring-moss-green-300'
    },
    ecoGradient: {
      base: 'bg-gradient-to-r from-spring-green-500 to-moss-green-500',
      hover: 'hover:from-spring-green-600 hover:to-moss-green-600',
      effect: 'shadow-lg shadow-spring-green-200/50'
    },
    outline: {
      base: 'border-2 border-spring-green-500 text-spring-green-600',
      hover: 'hover:bg-spring-green-50'
    },
    ghost: {
      base: 'text-moss-green-600',
      hover: 'hover:bg-moss-green-50'
    }
  },
  sizes: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  },
  loadingStates: {
    spinner: 'text-current',
    text: 'opacity-70'
  }
}
```

#### 16.4.2 Input Components (`/components/ui/input.tsx`)

```typescript
const inputBrandingStandards = {
  base: {
    field: 'border-moss-green-200 focus:border-spring-green-400 focus:ring-spring-green-200',
    label: 'text-midnight-forest-700 font-medium',
    helper: 'text-moss-green-600',
    error: 'text-error-600 border-error-300'
  },
  variants: {
    default: 'bg-white/90 backdrop-blur-sm',
    filled: 'bg-moss-green-50 border-transparent',
    flushed: 'border-0 border-b-2 border-moss-green-200 rounded-none'
  },
  states: {
    focus: 'ring-2 ring-spring-green-200/50 border-spring-green-400',
    error: 'ring-2 ring-error-200/50 border-error-400',
    success: 'ring-2 ring-success-200/50 border-success-400'
  }
}
```

#### 16.4.3 Card Components (`/components/ui/card.tsx`)

```typescript
const cardBrandingStandards = {
  base: 'bg-white/90 backdrop-blur-lg border border-moss-green-100 rounded-xl',
  variants: {
    default: 'shadow-sm hover:shadow-md transition-shadow',
    elevated: 'shadow-lg shadow-moss-green-100/20',
    glass: 'bg-white/60 backdrop-blur-xl border-white/20',
    gradient: 'bg-gradient-to-br from-spring-green-50 to-moss-green-50'
  },
  header: {
    title: 'text-xl font-semibold text-midnight-forest-800',
    subtitle: 'text-moss-green-600',
    action: 'text-spring-green-600 hover:text-spring-green-700'
  },
  content: 'text-midnight-forest-700',
  footer: 'border-t border-moss-green-100 bg-moss-green-25'
}
```

### 16.5 Page-Specific Implementations

#### 16.5.1 Pricing Page (`/pricing/page.tsx`)

```typescript
const pricingPageBranding = {
  hero: {
    background: 'bg-gradient-to-br from-primary/5 to-secondary/5',
    title: 'Massachusetts Clean Energy Pricing',
    accent: 'text-primary'
  },
  pricingCards: {
    basic: {
      card: 'bg-white border-moss-green-200',
      badge: 'bg-moss-green-100 text-moss-green-800',
      price: 'text-midnight-forest-800',
      features: 'text-moss-green-600'
    },
    premium: {
      card: 'bg-gradient-to-br from-spring-green-50 to-moss-green-50 border-spring-green-300',
      badge: 'bg-spring-green-500 text-white',
      popular: 'bg-spring-green-500 text-white',
      price: 'text-spring-green-700'
    },
    enterprise: {
      card: 'bg-gradient-to-br from-midnight-forest-50 to-moss-green-50 border-midnight-forest-300',
      badge: 'bg-midnight-forest-500 text-white',
      price: 'text-midnight-forest-700'
    }
  }
}
```

#### 16.5.2 Admin Interface (`/admin/`) - Internal Tool Branding

```typescript
const adminInterfaceBranding = {
  sidebar: {
    background: 'bg-midnight-forest-800',
    activeItem: 'bg-spring-green-600 text-white',
    inactiveItem: 'text-moss-green-200 hover:bg-midnight-forest-700'
  },
  dataTable: {
    header: 'bg-moss-green-100 text-moss-green-800',
    row: 'hover:bg-spring-green-50',
    alternateRow: 'bg-moss-green-25'
  },
  analytics: {
    chartColors: ['#B2DE26', '#394816', '#68A357', '#8FBC8F'],
    gridColor: '#394816',
    tooltipBg: 'bg-midnight-forest-800 text-white'
  }
}
```

#### 16.5.3 Profile & Settings Pages

```typescript
const profileSettingsBranding = {
  profileHeader: {
    avatar: 'ring-4 ring-spring-green-300',
    name: 'text-midnight-forest-800',
    role: 'text-moss-green-600',
    status: {
      active: 'bg-success-100 text-success-800',
      pending: 'bg-warning-100 text-warning-800'
    }
  },
  settingsForm: {
    section: 'border-l-4 border-spring-green-300 bg-spring-green-50',
    sectionTitle: 'text-midnight-forest-800',
    fieldGroup: 'space-y-4 p-6 bg-white/80 rounded-lg'
  },
  profileTypeSelector: {
    card: 'border-2 border-moss-green-200 hover:border-spring-green-400',
    selected: 'border-spring-green-500 bg-spring-green-50',
    icon: 'text-spring-green-600',
    title: 'text-midnight-forest-800'
  }
}
```

### 16.6 Specialized Components

#### 16.6.1 Accessibility Components

```typescript
const accessibilityBranding = {
  accessibilityMenu: {
    toggle: 'bg-spring-green-500 hover:bg-spring-green-600',
    panel: 'bg-white/95 backdrop-blur-lg border border-moss-green-200',
    option: 'hover:bg-spring-green-50 text-midnight-forest-700'
  },
  skipLinks: {
    link: 'bg-spring-green-500 text-white focus:top-4'
  },
  focusIndicators: {
    ring: 'ring-2 ring-spring-green-300 ring-offset-2'
  }
}
```

#### 16.6.2 Loading & Error States

```typescript
const feedbackStatesBranding = {
  loadingStates: {
    spinner: 'text-spring-green-500',
    skeleton: 'bg-moss-green-100 animate-pulse',
    progress: 'bg-spring-green-500'
  },
  errorBoundary: {
    container: 'bg-error-50 border border-error-200',
    icon: 'text-error-500',
    title: 'text-error-800',
    message: 'text-error-600',
    action: 'bg-error-500 hover:bg-error-600 text-white'
  },
  notifications: {
    success: 'bg-success-100 border-success-300 text-success-800',
    warning: 'bg-warning-100 border-warning-300 text-warning-800',
    error: 'bg-error-100 border-error-300 text-error-800',
    info: 'bg-spring-green-100 border-spring-green-300 text-spring-green-800'
  }
}
```

### 16.7 Implementation Checklist

**Immediate Actions Required:**

- [ ] **Homepage Hero**: Update gradient overlays and badge styling
- [ ] **Dashboard Stats**: Implement glass morphism cards with proper color hierarchy
- [ ] **Chat Interface**: Apply message bubble styling and voice wave animations
- [ ] **Button Variants**: Ensure all eco-gradient and glass effects are consistent
- [ ] **Pricing Cards**: Implement tier-specific color schemes
- [ ] **Admin Interface**: Apply internal tool color palette
- [ ] **Form Components**: Update focus states and validation styling
- [ ] **Loading States**: Standardize spinner and skeleton colors
- [ ] **Error Boundaries**: Apply consistent error state styling
- [ ] **Accessibility Menu**: Implement proper contrast and focus management
- [ ] **Auth Components**: Apply consistent branding to login/signup flows
- [ ] **Resource Pages**: Implement Massachusetts climate economy focus
- [ ] **Partner Dashboard**: Deploy eco-friendly data visualization system
- [ ] **Notification System**: Implement context-aware message styling

**Testing Requirements:**

- [ ] **Color Contrast**: Verify WCAG AA compliance across all components
- [ ] **Focus Management**: Test keyboard navigation flow
- [ ] **Responsive Design**: Verify mobile implementation of glass effects
- [ ] **Performance**: Test backdrop-blur performance on lower-end devices
- [ ] **Cross-browser**: Verify gradient and glass effect compatibility
- [ ] **Authentication Flows**: Test all sign-in, signup, and password recovery paths
- [ ] **Role-based UI**: Test partner, admin, and user-specific interfaces
- [ ] **Reduced Motion**: Test all components with reduced motion preference
- [ ] **Screen Reader**: Verify all components with VoiceOver, NVDA, and JAWS

**Documentation Updates:**

- [ ] Update component JSDoc with branding specifications
- [ ] Create Storybook entries for all variants
- [ ] Document color usage patterns for designers
- [ ] Create accessibility testing checklist
- [ ] Generate token reference documentation for developers
- [ ] Create animation timing curve reference guide
- [ ] Document Massachusetts climate economy branding guidelines

---

## Phase 3: Page Implementation Strategy

### 1. Core User Journey Implementation

#### 1.1 Homepage (`/page.tsx`)

The homepage serves as the primary entry point and must showcase the Massachusetts climate economy focus with Apple-level design quality.

**Key Implementation Requirements:**
- **Hero Section**
  - Apply eco-gradient background with subtle animation
  - Implement Massachusetts climate economy badge with spring-green accents
  - Create responsive headline hierarchy with proper font scaling
  - Implement CTA buttons with haptic feedback simulation

```tsx
// Hero section implementation
<section className="relative overflow-hidden" role="banner">
  <div className="absolute inset-0 bg-gradient-to-r from-spring-green-10 to-moss-green-60/20 animate-gentle-breathe"></div>
  <div className="relative max-w-7xl mx-auto px-4 py-20 lg:py-32">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      {/* Massachusetts-focused content */}
      <div className="space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center px-4 py-2 bg-spring-green-20 rounded-full text-midnight-forest font-medium text-sm">
            Massachusetts Climate Economy
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-title font-bold leading-tight">
            Your AI Partner for 
            <span className="text-spring-green"> Massachusetts</span> Clean Energy Careers
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-base-content/70 leading-relaxed">
            Connect with high-paying opportunities in Massachusetts' growing climate economy. 
            The clean energy workforce needs to grow by 38% by 2030 across 140+ occupations.
          </p>
        </div>
      </div>
      
      {/* Interactive demo */}
      <div className="glass-card p-6 shadow-lg">
        {/* Chat preview implementation */}
      </div>
    </div>
  </div>
</section>
```

- **Feature Showcases**
  - Resume Analysis with climate skills mapping visualization
  - Military Skills Translation with civilian equivalents in clean energy
  - Credential Evaluation with Massachusetts certification paths
  - Booking Feature with calendar integration
  - Agent Teams with specialized climate expertise

#### 1.2 Authentication Pages (`/auth/*`)

Authentication pages must reflect the ACT brand identity while maintaining security and usability.

**Key Implementation Requirements:**
- **Login/Signup Forms**
  - Implement glass-card styling with backdrop blur
  - Apply spring-green accents for focus states
  - Create smooth transitions between authentication steps
  - Implement form validation with helpful error messages

```tsx
// Authentication card styling
<div className="max-w-md w-full mx-auto">
  <div className="bg-white/90 backdrop-blur-md shadow-lg border border-sand-gray-200 rounded-2xl p-8">
    <div className="mb-8 text-center">
      <div className="h-12 w-auto mx-auto mb-4">
        <Logo className="h-full w-auto animate-gentle-breathe" />
      </div>
      <h2 className="text-2xl font-bold text-midnight-forest-900">
        {isLogin ? 'Sign in to ACT Climate Economy' : 'Join the Climate Transition'}
      </h2>
      <p className="text-moss-green-600 mt-2">
        Access Massachusetts clean energy opportunities
      </p>
    </div>
    
    {/* Form fields with ACT styling */}
  </div>
</div>
```

- **Profile Type Selection**
  - Create role cards with climate sector iconography
  - Implement selection states with spring-green highlights
  - Add role-specific feature lists with checkmarks
  - Ensure smooth transitions between selection steps

#### 1.3 Chat Interface Pages (`/chat`, `/enhanced-chat`)

Chat interfaces must provide an intuitive, Apple-quality experience while focusing on Massachusetts climate economy content.

**Key Implementation Requirements:**
- **Message Thread**
  - Implement distinct styling for user vs. assistant messages
  - Create smooth animations for message appearance
  - Apply proper spacing and typography hierarchy
  - Support markdown and code syntax highlighting

- **Input Area**
  - Create expanding textarea with character counter
  - Implement file attachment with climate document types
  - Add voice input with Massachusetts accent recognition
  - Provide helpful Massachusetts-specific suggestions

```tsx
// Chat interface implementation
<ChatInterface
  messages={messages}
  onSendMessage={handleSendMessage}
  isLoading={isLoading}
  isStreaming={isStreaming}
  enableAttachments={true}
  enableVoice={true}
  enableCommands={true}
  showHeader={true}
  headerTitle="Massachusetts Climate Economy Assistant"
  emptyState={
    <div className="text-center p-6 max-w-md mx-auto">
      <div className="w-16 h-16 bg-spring-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Bot className="h-8 w-8 text-spring-green-700" />
      </div>
      <h3 className="text-xl font-medium text-midnight-forest-900 mb-2">
        Welcome to the Climate Economy Assistant
      </h3>
      <p className="text-sand-gray-600 mb-6">
        I can help you find clean energy opportunities, translate your skills for the climate economy, 
        and connect you with Massachusetts resources.
      </p>
      {/* Massachusetts-specific suggestions */}
    </div>
  }
/>
```

### 2. Job Seeker Experience Implementation

#### 2.1 Job Seeker Dashboard (`/dashboard`)

The dashboard provides job seekers with their climate career journey progress and opportunities.

**Key Implementation Requirements:**
- **Stats Overview**
  - Create glass-card stats with climate metrics
  - Implement data visualization with eco-friendly colors
  - Add progress indicators for career journey
  - Show Massachusetts-specific insights

```tsx
// Stats card implementation
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
  <div className="stat bg-white/90 backdrop-blur-sm shadow-xl rounded-lg border border-moss-green-100">
    <div className="stat-figure text-primary">
      <div className="bg-spring-green-100 p-3 rounded-full">
        <MessageSquare className="h-6 w-6 text-spring-green-600" />
      </div>
    </div>
    <div className="stat-title text-moss-green-600">Chat Sessions</div>
    <div className="stat-value text-3xl font-bold text-midnight-forest-800">{stats.totalConversations}</div>
    <div className="stat-desc">
      <Link href="/chat" className="text-spring-green-600 hover:text-spring-green-700">Start new chat</Link>
    </div>
  </div>
  {/* Additional stat cards */}
</div>
```

- **Activity Timeline**
  - Create visual timeline with eco-styling
  - Implement activity cards with appropriate icons
  - Add contextual actions for each activity type
  - Support filtering by activity category

- **Quick Actions**
  - Implement action buttons with spring-green accents
  - Create shortcut cards for common tasks
  - Add Massachusetts resource shortcuts
  - Implement personalized recommendations

#### 2.2 Profile Pages (`/profile/*`)

Profile pages must help job seekers showcase their skills for the Massachusetts climate economy.

**Key Implementation Requirements:**
- **Resume Upload & Analysis**
  - Create drag-and-drop upload with eco-styling
  - Implement analysis visualization with climate skills mapping
  - Add skill gap identification for clean energy roles
  - Provide Massachusetts-specific recommendations

```tsx
// Resume analysis visualization
<div className="bg-white/90 backdrop-blur-sm rounded-xl border border-moss-green-100 p-6">
  <h3 className="text-xl font-bold text-midnight-forest-800 mb-4">Skills Analysis</h3>
  
  <div className="space-y-6">
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-moss-green-700 font-medium">Clean Energy Technical Skills</span>
        <span className="text-spring-green-600 font-medium">68%</span>
      </div>
      <div className="h-2 bg-sand-gray-200 rounded-full overflow-hidden">
        <div className="h-full bg-spring-green-500 rounded-full" style={{ width: '68%' }}></div>
      </div>
    </div>
    
    {/* Additional skill categories */}
  </div>
  
  <div className="mt-8">
    <h4 className="font-medium text-midnight-forest-800 mb-3">Massachusetts Clean Energy Matches</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Job match cards */}
    </div>
  </div>
</div>
```

- **Skills Visualization**
  - Create interactive skill graph with climate categories
  - Implement skill badges with eco-styling
  - Add comparison to Massachusetts job market demands
  - Provide skill development recommendations

- **Career Preferences**
  - Create preference forms with spring-green accents
  - Implement location preferences with Massachusetts regions
  - Add climate sector interest selection
  - Support salary and benefit preferences

#### 2.3 Jobs Listing (`/jobs`)

Jobs listing must showcase Massachusetts clean energy opportunities with intuitive filtering and matching.

**Key Implementation Requirements:**
- **Job Cards**
  - Create cards with climate impact indicators
  - Implement match score visualization
  - Add company information with eco-credentials
  - Support quick application actions

```tsx
// Job card implementation
<div className="bg-white/90 backdrop-blur-sm border border-sand-gray-200 rounded-xl p-6 hover:border-spring-green-300 transition">
  <div className="flex justify-between">
    <div>
      <div className="text-sm text-spring-green-600 font-medium mb-1">Solar Installation Technician</div>
      <h3 className="text-lg font-bold text-midnight-forest-800">Massachusetts Solar Solutions</h3>
      <p className="text-moss-green-600 text-sm">Boston, MA • Full-time</p>
    </div>
    <div className="text-right">
      <div className="bg-spring-green-100 text-spring-green-800 text-xs px-2 py-1 rounded-full">
        94% Match
      </div>
      <div className="text-sm text-moss-green-500 mt-1">Posted 2 days ago</div>
    </div>
  </div>
  
  <div className="mt-4 flex flex-wrap gap-2">
    <div className="bg-moss-green-50 text-moss-green-700 text-xs px-2 py-1 rounded-full">
      Clean Energy
    </div>
    <div className="bg-moss-green-50 text-moss-green-700 text-xs px-2 py-1 rounded-full">
      Technical
    </div>
    <div className="bg-moss-green-50 text-moss-green-700 text-xs px-2 py-1 rounded-full">
      Entry Level
    </div>
  </div>
  
  <div className="mt-6 flex items-center justify-between">
    <div className="flex items-center gap-2">
      <div className="bg-spring-green-50 text-spring-green-700 text-xs px-2 py-1 rounded-full">
        $55-65K
      </div>
      <div className="bg-spring-green-50 text-spring-green-700 text-xs px-2 py-1 rounded-full">
        Benefits
      </div>
    </div>
    <Button variant="primary" size="sm">Apply Now</Button>
  </div>
</div>
```

- **Filter System**
  - Create filter panel with climate sectors
  - Implement Massachusetts region filters
  - Add skill level and certification filters
  - Support salary and benefit preferences

- **Job Detail Modal**
  - Create detailed job view with company information
  - Implement skill match visualization
  - Add application process steps
  - Provide Massachusetts-specific context

### 3. Partner Experience Implementation

#### 3.1 Partner Dashboard (`/partner/dashboard`)

The partner dashboard must provide organizations with insights into the Massachusetts climate workforce.

**Key Implementation Requirements:**
- **Organization Metrics**
  - Create metrics cards with climate economy focus
  - Implement data visualization with eco-friendly colors
  - Add trend indicators for workforce insights
  - Show Massachusetts market comparisons

```tsx
// Partner metrics implementation
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6">
    <div className="text-moss-green-600 font-medium mb-2">Candidate Matches</div>
    <div className="text-4xl font-bold text-midnight-forest-800">24</div>
    <div className="text-spring-green-600 flex items-center mt-2">
      <TrendingUp className="h-4 w-4 mr-1" />
      <span>12% increase</span>
    </div>
  </div>
  {/* Additional metric cards */}
</div>
```

- **Candidate Matching**
  - Create candidate cards with climate skill indicators
  - Implement match score visualization
  - Add filtering by Massachusetts regions
  - Support direct contact actions

- **Job Posting Management**
  - Create job posting cards with status indicators
  - Implement quick edit and duplicate actions
  - Add performance metrics for each posting
  - Support boosting and promotion options

#### 3.2 Partner Job Management (`/partner/jobs`)

Job management interfaces must help partners create effective listings for the Massachusetts climate economy.

**Key Implementation Requirements:**
- **Job Creation Forms**
  - Create multi-step form with progress indicator
  - Implement climate skill selection with taxonomy
  - Add Massachusetts-specific fields and options
  - Support draft saving and preview

```tsx
// Job creation form
<form className="space-y-8">
  <div className="bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6">
    <h3 className="text-xl font-bold text-midnight-forest-800 mb-6">Job Details</h3>
    
    <div className="space-y-6">
      <div>
        <label className="block text-midnight-forest-700 font-medium mb-2">Job Title</label>
        <Input 
          placeholder="e.g., Solar Installation Technician" 
          className="border-moss-green-200 focus:border-spring-green-400"
        />
      </div>
      
      <div>
        <label className="block text-midnight-forest-700 font-medium mb-2">Clean Energy Sector</label>
        <Select 
          options={climateSectors} 
          placeholder="Select sector"
          className="border-moss-green-200"
        />
      </div>
      
      {/* Additional form fields */}
    </div>
  </div>
  
  {/* Climate skills section */}
  <div className="bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6">
    <h3 className="text-xl font-bold text-midnight-forest-800 mb-6">Climate Economy Skills</h3>
    
    <div className="space-y-6">
      {/* Skill selection interface */}
    </div>
  </div>
</form>
```

- **Candidate Review System**
  - Create candidate comparison interface
  - Implement skill match visualization
  - Add interview scheduling tools
  - Support team collaboration features

- **Climate Skills Taxonomy**
  - Implement comprehensive clean energy skill selector
  - Create skill level indicators
  - Add Massachusetts certification mapping
  - Support custom skill definition

#### 3.3 Partner Analytics (`/partner/analytics`)

Analytics pages must provide partners with actionable insights about the Massachusetts climate workforce.

**Key Implementation Requirements:**
- **Data Visualization**
  - Create charts with climate-themed colors
  - Implement interactive filtering and drill-down
  - Add export and sharing capabilities
  - Support different visualization types

```tsx
// Analytics implementation
<div className="space-y-8">
  <div className="bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl p-6">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-xl font-bold text-midnight-forest-800">Candidate Pipeline</h3>
      <Select 
        options={timeRanges}
        value="30d"
        className="w-40"
      />
    </div>
    
    <div className="h-80">
      <BarChart
        data={candidateData}
        bars={[
          { dataKey: "applied", name: "Applied", color: "#B2DE26" },
          { dataKey: "screened", name: "Screened", color: "#394816" },
          { dataKey: "interviewed", name: "Interviewed", color: "#0EA5E9" },
          { dataKey: "offered", name: "Offered", color: "#7E6551" }
        ]}
        xAxisDataKey="week"
        xAxisLabel="Week"
        yAxisLabel="Candidates"
      />
    </div>
  </div>
  
  {/* Additional charts */}
</div>
```



### 4. Shared Resources Implementation

4.1 not a priority not needed (resource center )


#### 4.2 Settings Pages (`/settings`)

Settings pages must provide users with control over their experience while maintaining the ACT brand identity.

**Key Implementation Requirements:**
- **Account Management**
  - Create settings forms with spring-green accents
  - Implement profile editing with validation
  - Add security and privacy controls
  - Support account deletion with confirmation

```tsx
// Settings implementation
<div className="max-w-3xl mx-auto">
  <div className="bg-white/90 backdrop-blur-sm border border-moss-green-100 rounded-xl overflow-hidden">
    <div className="border-b border-sand-gray-200 p-6">
      <h2 className="text-xl font-bold text-midnight-forest-800">Account Settings</h2>
      <p className="text-moss-green-600 mt-1">
        Manage your profile, preferences, and account details
      </p>
    </div>
    
    <div className="p-6">
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium text-midnight-forest-800 mb-4">Profile Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-midnight-forest-700 font-medium mb-2">Full Name</label>
              <Input 
                value={profile.full_name} 
                className="border-moss-green-200 focus:border-spring-green-400"
              />
            </div>
            
            {/* Additional profile fields */}
          </div>
        </div>
        
        {/* Additional settings sections */}
      </div>
    </div>
  </div>
</div>
```

- **Notification Preferences**
  - Create toggle switches with spring-green styling
  - Implement category-based notification controls
  - Add frequency and channel preferences
  - Support test notification sending

- **Subscription Management**
  - Create plan cards with eco-styling
  - Implement upgrade/downgrade flows
  - Add payment method management
  - Support billing history and receipts

### 5. Implementation Timeline

#### Week 1: Core User Journey
- Day 1-2: Homepage implementation
- Day 3-4: Authentication flow implementation
- Day 5: Chat interface implementation

#### Week 2: Job Seeker Experience
- Day 1-2: Job seeker dashboard implementation
- Day 3-4: Profile pages implementation
- Day 5: Jobs listing implementation

#### Week 3: Partner Experience
- Day 1-2: Partner dashboard implementation
- Day 3: Partner job management implementation
- Day 4-5: Partner analytics implementation

#### Week 4: Shared Resources & Polish

- Day 3: Settings pages implementation
- Day 4-5: Cross-cutting improvements and testing

This comprehensive implementation plan ensures that all pages follow the ACT branding standards with Apple-level attention to detail and user experience, while focusing on the Massachusetts climate economy and serving both job seekers and partners. 
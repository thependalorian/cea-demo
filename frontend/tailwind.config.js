/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ACT Brand Colors - Enhanced for accessibility and consistency
        'midnight-forest': {
          DEFAULT: '#001818',
          50: '#E6F3F3',     // Light background for text contrast
          100: '#CCEAEA',
          200: '#99D5D5',
          300: '#66C0C0',
          400: '#33ABAB',
          500: '#278888',
          600: '#1F6666',
          700: '#164444',
          800: '#0D2222',
          900: '#000F0F',    // Deepest shade for visual weight
        },
        'moss-green': {
          DEFAULT: '#394816',
          50: '#F6F9E9',     // Accessible background
          100: '#EBF0D0',
          200: '#D5E2A0',
          300: '#BFD470',
          400: '#A9C540',
          500: '#7A9328',
          600: '#5E7126',
          700: '#435024',
          800: '#2F391A',
          900: '#1E240F',
          950: '#10140A',
        },
        'spring-green': {
          DEFAULT: '#B2DE26',
          50: '#F8FFE5',     // WCAG-compliant for text
          100: '#EFFACB',
          200: '#E3F5AA',
          300: '#D7F089',
          400: '#CCEB68',
          500: '#B2DE26',
          600: '#8BB221',    // Primary interactive state
          700: '#748D1D',
          800: '#5D6B19',
          900: '#546A14',    // Dark mode compatible
        },
        'sand-gray': {
          DEFAULT: '#EBE9E1',
          50: '#FCFCFB',
          100: '#F5F4F0',
          200: '#EBE9E1',
          300: '#D9D5C7',
          400: '#C7C1AD',
          500: '#B5AC93',
          600: '#A39778',
          700: '#877F61',
          800: '#6A644D',
          900: '#4D4938',
          950: '#302D24',
        },
        // Accent colors - Used sparingly for specific purposes
        'seafoam-blue': {
          DEFAULT: '#4ECDC4',
          light: '#7FDED8',
          dark: '#2FB8AF',
          // Use for: Progress indicators, success states, secondary actions
        },
        'earth-brown': {
          DEFAULT: '#8B4513',
          light: '#B25919',
          dark: '#64310E',
          // Use for: Historical data, natural resource indicators
        },
        'solar-yellow': {
          DEFAULT: '#FFD700',
          light: '#FFDF33',
          dark: '#CCAC00',
          // Use for: Warnings, energy metrics, highlights
        },
        'wind-blue': {
          DEFAULT: '#87CEEB',
          light: '#A7DBF2',
          dark: '#5EBBDF',
          // Use for: Air quality data, climate metrics
        },
      },
      fontFamily: {
        title: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        body: ['var(--font-helvetica-neue)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typographic scale for hierarchy and readability
        'display': ['3.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['2.5rem', { lineHeight: '1.2', fontWeight: '600' }],
        'heading-2': ['2rem', { lineHeight: '1.25', fontWeight: '600' }],
        'heading-3': ['1.5rem', { lineHeight: '1.3', fontWeight: '600' }],
        'body-large': ['1.125rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body': ['1rem', { lineHeight: '1.5', fontWeight: '400' }],
        'body-impact': ['1.1rem', { lineHeight: '1.6', fontWeight: '500' }],
        'caption': ['0.875rem', { lineHeight: '1.4', fontWeight: '400' }],
        'small': ['0.75rem', { lineHeight: '1.3', fontWeight: '400' }],
      },
      boxShadow: {
        // Purposeful shadow system - Prefer flat design with intentional depth
        'button': '0 2px 8px 0 rgba(178, 222, 38, 0.25)',
        'hover': '0 4px 12px 0 rgba(178, 222, 38, 0.3)',
        'card': '0 4px 16px 0 rgba(0, 24, 24, 0.06)',
        'soft': '0 2px 12px 0 rgba(0, 0, 0, 0.05)',
        'focus': '0 0 0 3px rgba(178, 222, 38, 0.4)',
      },
      animation: {
        // Subtle, purposeful animations
        'climate-focus': 'climate-focus 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) both',
        'data-emerge': 'data-emerge 0.6s ease-out forwards',
        'gentle-breathe': 'gentle-breathe 3s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
      },
      keyframes: {
        'climate-focus': {
          '0%': { transform: 'scale(0.98)', opacity: '0.8' },
          '50%': { transform: 'scale(1.02)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        'data-emerge': {
          '0%': { transform: 'translateY(8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'gentle-breathe': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.03)' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
      },
      // Component design tokens
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      transitionTimingFunction: {
        'apple-ease': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
      transitionDuration: {
        '250': '250ms',
        '400': '400ms',
      },
    },
  },
  plugins: [
    require('daisyui'),
    // Removed @tailwindcss/forms plugin that was causing the error
  ],
  daisyui: {
    // Streamlined theme system - Only use ACT design system
    themes: [
      {
        'act-design-system': {
          'primary': '#B2DE26',
          'primary-focus': '#8BB221',
          'primary-content': '#001818',
          
          'secondary': '#394816',
          'secondary-focus': '#4a562c',
          'secondary-content': '#ffffff',
          
          'accent': '#4ECDC4',
          'accent-focus': '#3fb8b1',
          'accent-content': '#001818',
          
          'neutral': '#EBE9E1',
          'neutral-focus': '#ddd9cd',
          'neutral-content': '#001818',
          
          'base-100': '#ffffff',
          'base-200': '#f5f4f0',
          'base-300': '#ebe9e1',
          'base-content': '#001818',
          
          'info': '#3abff8',
          'success': '#36d399',
          'warning': '#fbbd23',
          'error': '#f87272',
          
          // Component styling tokens
          '--rounded-box': '0.75rem',
          '--rounded-btn': '0.5rem',
          '--rounded-badge': '0.375rem',
          
          '--animation-btn': '0.25s',
          '--animation-input': '0.2s',
          
          '--btn-focus-scale': '0.98',
          '--border-btn': '1px',
          
          '--tab-radius': '0.5rem',
        },
      },
    ],
    // Force the ACT theme only
    darkTheme: "act-design-system",
  }
} 
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './cypress/**/*.{js,ts,jsx,tsx}', // Added for Cypress component testing
  ],
  theme: {
    extend: {
      // Custom breakpoints for responsive design
      screens: {
        'xs': '475px',
        '3xl': '1600px', // Added for large displays
      },
      
      // Animation and transition improvements for v3.4
      transitionTimingFunction: {
        'bounce-soft': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ease-brand': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      
      // Enhanced animation durations
      transitionDuration: {
        '250': '250ms',
        '350': '350ms',
        '400': '400ms',
      },
      
      colors: {
        // CSS Variables (keep existing for Next.js compatibility)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // Second Turn Games Brand Colors - Updated for v3.4 compatibility
        darkGreen: '#29432B',
        vibrantOrange: '#D95323',
        warmYellow: '#F2C94C',
        teal: '#2DB7A3',
        coral: '#FF6B6B',
        lavender: '#A78BFA',
        
        // Surface Colors - Updated naming for v3.4
        surface: '#FFFFFF',
        surface50: '#F7F8F4',
        surface100: '#F0F2E9',
        surfaceBackground: '#E6EAD7',
        
        // Text Colors - Updated naming for v3.4
        textPrimary: '#1B1B1B',
        textSecondary: '#6B7280',
        textMuted: '#9CA3AF',
        
        // Border Colors - Updated naming for v3.4
        borderPrimary: '#E5E7EB',
        borderLight: '#F3F4F6',
        borderAccent: '#D95323',
        
        // Legacy aliases (keep for backward compatibility)
        'bg-primary': '#E6EAD7',
        'bg-surface': '#FFFFFF',
        'bg-surface-50': '#F7F8F4',
        'bg-surface-100': '#F0F2E9',
        'text-primary': '#1B1B1B',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        'border-primary': '#E5E7EB',
        'border-light': '#F3F4F6',
        'border-accent': '#D95323',
        
        // Enhanced color aliases for v3.4 compatibility
        brand: {
          green: '#29432B',
          orange: '#D95323',
          yellow: '#F2C94C',
          teal: '#2DB7A3',
          coral: '#FF6B6B',
          lavender: '#A78BFA',
          primary: '#29432B',
          accent: '#D95323',
          success: '#2DB7A3',
          warning: '#F2C94C',
          error: '#FF6B6B',
          info: '#A78BFA',
        },
        
        // Surface color system for v3.4
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#F7F8F4',
          100: '#F0F2E9',
          background: '#E6EAD7',
          primary: '#FFFFFF',
          secondary: '#F7F8F4',
          muted: '#F0F2E9',
        },
        
        // Text color system for v3.4
        text: {
          primary: '#1B1B1B',
          secondary: '#6B7280',
          muted: '#9CA3AF',
          inverse: '#FFFFFF',
          brand: '#29432B',
          accent: '#D95323',
        },
        
        // Border color system for v3.4
        border: {
          primary: '#E5E7EB',
          light: '#F3F4F6',
          accent: '#D95323',
          strong: '#D1D5DB',
          subtle: '#F9FAFB',
        },
      },
      
      // Enhanced typography for v3.4
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'ui-sans-serif', 'system-ui'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'SFMono-Regular'],
        serif: ['ui-serif', 'Georgia'],
      },
      
      // Enhanced spacing scale
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Enhanced border radius
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      
      // Enhanced shadows for v3.4
      boxShadow: {
        'brand': '0 4px 14px 0 rgba(217, 83, 35, 0.15)',
        'brand-lg': '0 10px 25px -3px rgba(217, 83, 35, 0.2)',
        'surface': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'surface-lg': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      },
      
      // Enhanced z-index scale
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      
      // Custom animations for v3.4 compatibility
      animation: {
        'fade-in': 'fade-in 300ms ease-in-out forwards',
        'slide-up': 'slide-up 300ms ease-out forwards',
        'scale-in': 'scale-in 200ms ease-out forwards',
        'bounce-soft': 'bounce 1s ease-in-out infinite',
      },
      
      // Custom keyframes for v3.4 compatibility
      keyframes: {
        'fade-in': {
          'from': {
            opacity: '0',
          },
          'to': {
            opacity: '1',
          },
        },
        'slide-up': {
          'from': {
            opacity: '0',
            transform: 'translateY(8px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'scale-in': {
          'from': {
            opacity: '0',
            transform: 'scale(0.95)',
          },
          'to': {
            opacity: '1',
            transform: 'scale(1)',
          },
        },
      },
    },
  },
  
  // Enhanced plugins configuration for v3.4
  plugins: [
    // Add form plugin for better form styling
    require('@tailwindcss/forms')({
      strategy: 'class', // Use class-based forms for better control
    }),
    
    // Add typography plugin for better text styling
    require('@tailwindcss/typography'),
    
    // Add aspect ratio plugin
    require('@tailwindcss/aspect-ratio'),
    
    // Add container queries plugin
    require('@tailwindcss/container-queries'),
  ],
  
  // Enhanced configuration for v3.4
  corePlugins: {
    // Enable all core plugins for maximum compatibility
    preflight: true,
    container: true,
    accessibility: true,
    pointerEvents: true,
    visibility: true,
    position: true,
    inset: true,
    isolation: true,
    zIndex: true,
    order: true,
    gridColumn: true,
    gridColumnStart: true,
    gridColumnEnd: true,
    gridRow: true,
    gridRowStart: true,
    gridRowEnd: true,
    float: true,
    clear: true,
    margin: true,
    boxSizing: true,
    lineClamp: true,
    display: true,
    aspectRatio: true,
    size: true,
    height: true,
    maxHeight: true,
    minHeight: true,
    width: true,
    minWidth: true,
    maxWidth: true,
    flex: true,
    flexShrink: true,
    flexGrow: true,
    flexBasis: true,
    tableLayout: true,
    captionSide: true,
    borderCollapse: true,
    borderSpacing: true,
    transformOrigin: true,
    translate: true,
    rotate: true,
    skew: true,
    scale: true,
    transform: true,
    animation: true,
    cursor: true,
    touchAction: true,
    userSelect: true,
    resize: true,
    scrollSnapType: true,
    scrollSnapAlign: true,
    scrollSnapStop: true,
    scrollMargin: true,
    scrollPadding: true,
    listStylePosition: true,
    listStyleType: true,
    listStyleImage: true,
    appearance: true,
    columns: true,
    breakBefore: true,
    breakInside: true,
    breakAfter: true,
    gridAutoColumns: true,
    gridAutoFlow: true,
    gridAutoRows: true,
    gridTemplateColumns: true,
    gridTemplateRows: true,
    flexDirection: true,
    flexWrap: true,
    placeContent: true,
    placeItems: true,
    alignContent: true,
    alignItems: true,
    justifyContent: true,
    justifyItems: true,
    gap: true,
    space: true,
    divideWidth: true,
    divideStyle: true,
    divideColor: true,
    divideOpacity: true,
    placeSelf: true,
    alignSelf: true,
    justifySelf: true,
    overflow: true,
    overscrollBehavior: true,
    scrollBehavior: true,
    textOverflow: true,
    hyphens: true,
    whitespace: true,
    wordBreak: true,
    borderRadius: true,
    borderWidth: true,
    borderStyle: true,
    borderColor: true,
    borderOpacity: true,
    backgroundColor: true,
    backgroundOpacity: true,
    backgroundImage: true,
    gradientColorStops: true,
    backgroundSize: true,
    backgroundAttachment: true,
    backgroundClip: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundOrigin: true,
    fill: true,
    stroke: true,
    strokeWidth: true,
    objectFit: true,
    objectPosition: true,
    padding: true,
    textAlign: true,
    textColor: true,
    textOpacity: true,
    textDecoration: true,
    textDecorationColor: true,
    textDecorationStyle: true,
    textDecorationThickness: true,
    textUnderlineOffset: true,
    fontFamily: true,
    fontSize: true,
    fontWeight: true,
    fontVariantNumeric: true,
    letterSpacing: true,
    lineHeight: true,
    textIndent: true,
    verticalAlign: true,
    textTransform: true,
    fontStyle: true,
    fontVariantNumeric: true,
    boxShadow: true,
    boxShadowColor: true,
    opacity: true,
    mixBlendMode: true,
    backgroundBlendMode: true,
    filter: true,
    blur: true,
    brightness: true,
    contrast: true,
    dropShadow: true,
    grayscale: true,
    hueRotate: true,
    invert: true,
    saturate: true,
    sepia: true,
    backdropFilter: true,
    backdropBlur: true,
    backdropBrightness: true,
    backdropContrast: true,
    backdropGrayscale: true,
    backdropHueRotate: true,
    backdropInvert: true,
    backdropOpacity: true,
    backdropSaturate: true,
    backdropSepia: true,
    transitionProperty: true,
    transitionDelay: true,
    transitionDuration: true,
    transitionTimingFunction: true,
    willChange: true,
    content: true,
  },
  
  // Future-proofing for dark mode
  darkMode: 'class',
  
  // Enhanced safelist for dynamic classes
  safelist: [
    // Brand colors
    'bg-darkGreen',
    'bg-vibrantOrange',
    'bg-warmYellow',
    'bg-teal',
    'bg-coral',
    'bg-lavender',
    'text-darkGreen',
    'text-vibrantOrange',
    'text-warmYellow',
    'text-teal',
    'text-coral',
    'text-lavender',
    'border-darkGreen',
    'border-vibrantOrange',
    'border-warmYellow',
    'border-teal',
    'border-coral',
    'border-lavender',
    
    // Surface colors
    'bg-surface',
    'bg-surface50',
    'bg-surface100',
    'bg-surfaceBackground',
    
    // Interactive states
    'hover:bg-surface50',
    'hover:bg-surface100',
    'focus:ring-borderAccent/20',
    'focus:ring-vibrantOrange/20',
    'focus:ring-darkGreen/20',
    
    // Responsive utilities
    'sm:bg-surface50',
    'md:bg-surface',
    'lg:bg-surface50',
    'sm:text-textSecondary',
    'md:text-textPrimary',
    'lg:text-darkGreen',
  ],
}

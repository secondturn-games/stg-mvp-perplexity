/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px',
      },
      colors: {
        // CSS Variables (keep existing)
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        
        // Second Turn Games Brand Colors
        darkGreen: '#29432B',
        vibrantOrange: '#D95323',
        warmYellow: '#F2C94C',
        teal: '#2DB7A3',
        coral: '#FF6B6B',
        lavender: '#A78BFA',
        
        // Background Colors
        'bg-primary': '#E6EAD7',
        'bg-surface': '#FFFFFF',
        'bg-surface-50': '#F7F8F4',
        'bg-surface-100': '#F0F2E9',
        
        // Text Colors
        'text-primary': '#1B1B1B',
        'text-secondary': '#6B7280',
        'text-muted': '#9CA3AF',
        
        // Border Colors
        'border-primary': '#E5E7EB',
        'border-light': '#F3F4F6',
        'border-accent': '#D95323',
        
        // Color Aliases for easier usage
        brand: {
          green: '#29432B',
          orange: '#D95323',
          yellow: '#F2C94C',
          teal: '#2DB7A3',
          coral: '#FF6B6B',
          lavender: '#A78BFA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          50: '#F7F8F4',
          100: '#F0F2E9',
          background: '#E6EAD7',
        },
        text: {
          primary: '#1B1B1B',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        border: {
          primary: '#E5E7EB',
          light: '#F3F4F6',
          accent: '#D95323',
        },
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)'],
        mono: ['var(--font-geist-mono)'],
      },
    },
  },
  plugins: [],
}

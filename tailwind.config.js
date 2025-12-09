/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#22c55e', // Tech Green
          foreground: '#000000',
          dark: '#16a34a',
          light: '#4ade80',
        },
        secondary: {
          DEFAULT: '#3b82f6', // Tech Blue
          foreground: '#ffffff',
          dark: '#2563eb',
          light: '#60a5fa',
        },
        background: '#050505', // Deep black
        surface: '#0A0A0A', // Slightly lighter for cards
        surfaceHover: '#121212',
        foreground: '#e5e5e5', // Off-white text
        card: {
          DEFAULT: '#0A0A0A',
          foreground: '#e5e5e5',
          hover: '#121212',
        },
        border: {
          DEFAULT: '#1F1F1F', // Subtle borders
          light: '#262626',
        },
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
        muted: {
          DEFAULT: '#737373', // Neutral Gray
          foreground: '#a3a3a3',
        },
        text: '#e5e5e5',
        chart: {
          1: '#3b82f6',
          2: '#22c55e',
          3: '#f59e0b',
          4: '#ec4899',
          5: '#8b5cf6',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      letterSpacing: {
        tighter: '-0.04em',
        tight: '-0.02em',
        widest: '0.1em',
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.375rem',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'card-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
      },
      animation: {
        'slide-in-right': 'slideInRight 0.3s ease-out',
      },
      keyframes: {
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

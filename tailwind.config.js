/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'rgb(139 92 246)',
          foreground: 'rgb(255 255 255)',
        },
        background: 'rgb(0 0 0)',
        foreground: 'rgb(255 255 255)',
        card: {
          DEFAULT: 'rgb(15 15 15)',
          foreground: 'rgb(255 255 255)',
        },
        success: 'rgb(34 197 94)',
        warning: 'rgb(234 179 8)',
        error: 'rgb(239 68 68)',
        info: 'rgb(59 130 246)',
        chart: {
          1: 'rgb(139 92 246)',
          2: 'rgb(236 72 153)',
          3: 'rgb(14 165 233)',
          4: 'rgb(34 197 94)',
          5: 'rgb(251 191 36)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

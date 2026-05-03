/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        navy: {
          50:  '#f0f4ff',
          100: '#dce6ff',
          500: '#3355cc',
          700: '#1a3399',
          900: '#0a1a6b',
          950: '#060d3a',
        },
        bull:  '#10b981',
        bear:  '#ef4444',
      },
      fontFamily: {
        sans: ['Inter var', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,.05), 0 1px 2px -1px rgba(0,0,0,.05)',
        'card-hover': '0 10px 25px -5px rgba(29,78,216,.12), 0 4px 6px -4px rgba(29,78,216,.1)',
        glow: '0 0 20px rgba(59,130,246,.35)',
      },
      animation: {
        'fade-in':    'fadeIn .3s ease-in-out',
        'slide-up':   'slideUp .4s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(.4,0,.6,1) infinite',
        'ticker':     'ticker 40s linear infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        ticker:  { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
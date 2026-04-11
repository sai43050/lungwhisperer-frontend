/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        // Deep Space Navy - primary base
        navy: {
          950: '#030712',
          900: '#070d1a',
          850: '#0a1221',
          800: '#0d1a2d',
          700: '#122040',
          600: '#1a2f5a',
        },
        // Vibrant Teal/Cyan accent
        cyan: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
        },
        // Electric Violet
        violet: {
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
        },
        // Neon Green for health/normal indicator
        emerald: {
          400: '#34d399',
          500: '#10b981',
        },
        // Rose for critical/alerts
        rose: {
          400: '#fb7185',
          500: '#f43f5e',
        },
        // Amber for warning
        amber: {
          400: '#fbbf24',
          500: '#f59e0b',
        },
        // Legacy compatibility
        vignan: {
          50: '#f2f4fb',
          100: '#e1e7f6',
          200: '#c7d3ed',
          300: '#9cb5df',
          400: '#6a8dce',
          500: '#466dbf',
          600: '#3452ab',
          700: '#2c428a',
          800: '#004792',
          900: '#070d1a',
        },
        healthcare: {
          50: '#f8f6fb',
          100: '#f0ebf6',
          200: '#ebdff4',
          300: '#d5bbed',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#52207a',
          900: '#451e63',
        },
        accent: {
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
        }
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e\")",
        'radial-glow': 'radial-gradient(ellipse at center, rgba(6,182,212,0.15) 0%, transparent 70%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
        'scan': 'scan 3s ease-in-out infinite',
        'orbit': 'orbit 8s linear infinite',
        'breath': 'breath 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 15px rgba(6,182,212,0.3), 0 0 30px rgba(6,182,212,0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(6,182,212,0.6), 0 0 60px rgba(6,182,212,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        scan: {
          '0%, 100%': { transform: 'translateY(0%)', opacity: '0.8' },
          '50%': { transform: 'translateY(100%)', opacity: '0.2' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg) translateX(60px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(60px) rotate(-360deg)' },
        },
        breath: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.7' },
          '50%': { transform: 'scale(1.08)', opacity: '1' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(6,182,212,0.4), 0 0 60px rgba(6,182,212,0.15)',
        'glow-violet': '0 0 20px rgba(139,92,246,0.4), 0 0 60px rgba(139,92,246,0.15)',
        'glow-emerald': '0 0 20px rgba(52,211,153,0.4), 0 0 60px rgba(52,211,153,0.15)',
        'glow-rose': '0 0 20px rgba(251,113,133,0.4), 0 0 60px rgba(251,113,133,0.15)',
        'inner-glow': 'inset 0 0 30px rgba(6,182,212,0.05)',
        'card': '0 4px 6px -1px rgba(0,0,0,0.5), 0 2px 4px -2px rgba(0,0,0,0.3)',
        'card-hover': '0 20px 40px -8px rgba(0,0,0,0.6), 0 0 0 1px rgba(6,182,212,0.2)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

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
      },
      colors: {
        vignan: {
          50: '#f2f4fb',
          100: '#e1e7f6',
          200: '#c7d3ed',
          300: '#9cb5df',
          400: '#6a8dce',
          500: '#466dbf',
          600: '#3452ab', // Vignan Blue primary mix
          700: '#2c428a', 
          800: '#004792', // Vignan Navy Blue (from logo)
          900: '#0b2b5c',
        },
        healthcare: {
           50: '#f8f6fb',
           100: '#f0ebf6',
           200: '#ebdff4',
           300: '#d5bbed',
           400: '#b486de',
           500: '#9b5ccc',
           600: '#853bbb',
           700: '#78639D', // Vignan Purple (from logo)
           800: '#52207a',
           900: '#451e63'
        },
        accent: {
           400: '#0aa1f2', // Brand Sky Blue
           500: '#009ae4', // Brand Cyan Blue
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 154, 228, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 154, 228, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}

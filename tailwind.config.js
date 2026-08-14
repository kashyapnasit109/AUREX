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
        obsidian: {
          950: '#040608',
          900: '#080A0E',
          850: '#0C0F17',
          800: '#111622',
          750: '#161D2C',
          700: '#1D2638',
          600: '#2A364F',
          500: '#3D4D6E',
        },
        lime: {
          DEFAULT: '#D4F938',
          400: '#E2FB6B',
          500: '#D4F938',
          600: '#B8FF2C',
          glow: 'rgba(212, 249, 56, 0.15)',
        },
        cyan: {
          DEFAULT: '#00E5FF',
          400: '#38f8ff',
          500: '#00E5FF',
          600: '#00B8CC',
          glow: 'rgba(0, 229, 255, 0.15)',
        },
        emerald: {
          DEFAULT: '#10B981',
          400: '#34D399',
          500: '#10B981',
        },
        amber: {
          DEFAULT: '#F59E0B',
          400: '#FBBF24',
          500: '#F59E0B',
        },
        coral: {
          DEFAULT: '#F43F5E',
          400: '#FB7185',
          500: '#F43F5E',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      animation: {
        'marquee': 'marquee 30s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      boxShadow: {
        'lime-glow': '0 0 30px -5px rgba(212, 249, 56, 0.3)',
        'cyan-glow': '0 0 30px -5px rgba(0, 229, 255, 0.3)',
        'subtle-card': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'glass-edge': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}

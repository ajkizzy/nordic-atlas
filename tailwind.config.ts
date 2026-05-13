import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#e6f5ee',
          100: '#c0e6d4',
          200: '#8fd4b3',
          300: '#5abf8e',
          400: '#34a872',
          500: '#257244',
          600: '#1e6039',
          700: '#095d36',
          800: '#064e2e',
          900: '#033d23',
          950: '#022c18',
        },
        dark: {
          100: '#010101',
          200: '#ffffff21',
        },
        gray: {
          100: '#4a4a4a',
          200: '#6a6a6a',
          300: '#c8c8c8',
          400: '#d5d5d5',
          500: '#e9e9e9',
          600: '#f5f5f5',
        },
      },
      fontFamily: {
        heading: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display': ['84px', { lineHeight: '112%', letterSpacing: '-3.36px', fontWeight: '500' }],
        'h2': ['64px', { lineHeight: '112%', letterSpacing: '-1.28px', fontWeight: '500' }],
        'h3': ['52px', { lineHeight: '124%', letterSpacing: '-1.04px', fontWeight: '500' }],
        'h4': ['48px', { lineHeight: '132%', letterSpacing: '-0.96px', fontWeight: '500' }],
        'h5': ['40px', { lineHeight: '132%', letterSpacing: '-0.8px', fontWeight: '500' }],
        'h6': ['36px', { lineHeight: '128%', letterSpacing: '0px', fontWeight: '600' }],
        'lg': ['24px', { lineHeight: '120%', letterSpacing: '-0.48px', fontWeight: '500' }],
        'md': ['20px', { lineHeight: '120%', letterSpacing: '-0.48px', fontWeight: '500' }],
        'body': ['16px', { lineHeight: '162.5%', fontWeight: '400' }],
        'sm': ['14px', { lineHeight: '170%' }],
      },
      borderRadius: {
        '2xl': '20px',
        'xl': '16px',
        'lg': '12px',
        'md': '10px',
        'sm': '8px',
        'pill': '100px',
      },
      maxWidth: {
        'container': '1312px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'slide-in-right': 'slideInRight 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

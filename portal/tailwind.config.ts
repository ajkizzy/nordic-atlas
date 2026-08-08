import type { Config } from 'tailwindcss';

// Brand tokens carried over 1:1 from the nordic-atlas marketing site
// (tailwind.config.ts) so the internal portal stays visually consistent.
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
      },
      fontFamily: {
        heading: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        body: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-manrope)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '20px',
        xl: '16px',
        lg: '12px',
        md: '10px',
        sm: '8px',
        pill: '100px',
      },
    },
  },
  plugins: [],
};

export default config;

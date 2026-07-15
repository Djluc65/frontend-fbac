/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316', // Primary
          600: '#ea580c',
          700: '#c2410c', // Dark
          800: '#9a3412',
          900: '#7c2d12',
        },
        foundation: {
          primary: '#F97316',
          dark: '#C2410C',
          light: '#FFEDD5',
          white: '#FFFFFF',
          black: '#1F2937',
          gray: '#F8FAFC',
          text: '#64748B',
          success: '#16A34A',
          danger: '#DC2626',
        },
        'soft-black': '#1f2937',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 10px 30px rgba(15, 23, 42, 0.08)',
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

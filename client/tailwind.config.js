/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#fcfcf9',
          100: '#fffffe',
        },
        teal: {
          300: '#32B8C6',
          400: '#2DA6B2',
          500: '#21808D',
          600: '#1D7480',
          700: '#1A6873',
        },
        slate: {
          500: '#626C71',
          900: '#134252',
        },
        charcoal: {
          700: '#1F2121',
          800: '#262828',
        },
        orange: {
          400: '#E68161',
          500: '#A84B2F',
        },
        brown: {
          600: '#5E5240',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['Georgia', 'Times New Roman', 'serif'],
      },
      borderRadius: {
        'base': '8px',
        'lg': '12px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)',
      },
    },
  },
  plugins: [],
}

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
          500: '#8B4513',
          600: '#704010',
        },
        secondary: {
          500: '#DAA520',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
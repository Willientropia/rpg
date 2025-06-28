/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta D&D
        primary: {
          50: '#fdf8f0',
          500: '#8B4513',
          600: '#704010',
          700: '#5a320d',
        },
        secondary: {
          500: '#DAA520',
          600: '#b8891a',
        },
        accent: {
          500: '#DC143C',
          600: '#b30f2f',
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
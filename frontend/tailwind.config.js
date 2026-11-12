/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#94bcdd',
          400: '#5e9bc9',
          500: '#387fb3',
          600: '#286596',
          700: '#21517a',
          800: '#1e4465',
          900: '#1d3a54',
          950: '#132537',
        }
      }
    },
  },
  plugins: [],
}

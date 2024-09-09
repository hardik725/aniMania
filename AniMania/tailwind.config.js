/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        '1040px': '1040px',
      },
      colors: {
        'options': '#94FFD8',
      },
    },
  },
  plugins: [],
}
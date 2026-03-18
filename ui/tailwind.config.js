/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        asurada: {
          dark: '#0a0a0a',
          panel: '#0f0f0f',
          accent: '#00e5ff',
        }
      }
    },
  },
  plugins: [],
}

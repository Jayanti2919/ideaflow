/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
    colors: {
      primary: '#2B2A2B',
      secondary: '#3B3A3B',
      tertiary: '#80CAD4',
      white: '#F2F1F2'
    }
  },
  plugins: [],
}
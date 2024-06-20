/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        theme: "#DAA520",
        'theme-dark': '#B8860B',
        dark: "#0D0D0D",
        input: "#2C2C2C"
      }
    },
  },
  plugins: [],
}


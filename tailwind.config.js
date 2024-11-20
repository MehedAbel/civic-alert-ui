/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '450px'
      },
      colors: {
        'ocean-light': '#0a87d6',
        'ocean-200': '#088cde',
        'ocean-300': '#087ec8',
        'ocean-400': '#0569a7',
        'ocean-dark': '#035c93'
      },
      fontFamily: {
        syne: ['"Syne"', ...defaultTheme.fontFamily.sans]
      }
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      white: '#fcfcff',
      blue: '#131939',
      black: '#2d2e37',
      gray: '#c4c4c4',
    },
    fontFamily: {
      'rubik': ['Rubik'],
    },
    extend: {
    },
  },
  plugins: [],
}

export default config;

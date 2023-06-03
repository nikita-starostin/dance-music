/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        animation: {
            fadeOut: 'fadeOut 3s ease-in-out',
        },
        keyframes: {
            fadeOut: {
                '0%': {opacity: '1'},
                '100%': {opacity: '0'},
            }
        },
        colors: {
            white: '#fcfcff',
            blue: '#131939',
            black: '#2d2e37',
            gray: '#c4c4c4',
            success: '#00ff00',
        },
        fontFamily: {
            'rubik': ['Rubik'],
        },
        extend: {},
    },
    plugins: [],
}

export default config;

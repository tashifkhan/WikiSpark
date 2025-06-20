/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'comfortaa': ['Comfortaa', 'sans-serif'],
        'open-dyslexic': ['OpenDyslexic', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

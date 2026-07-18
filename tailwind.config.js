/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"]
,
  theme: {
    extend: {
      fontFamily: {
        italianno: ["Italianno", "cursive"],
        playfair: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        miku: {
          1: "#75e3d1",
          2: "#43a0b1",
          3: "#46bfcc",
          4: "#2d858d",
          5: "#ff84b3",
          6: "#da4175",
          7: "#fe031e",
        },
      },
      animation: {
        "fade-in": "fade-in 250ms ease-out",
        "fade-out": "fade-out 250ms ease-in forwards",
        "scale-in": "scale-in 200ms ease-in-out",
        "scale-out": "scale-out 200ms ease-in forwards",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "fade-out": {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        "scale-in": {
          "0%": { scale: "0" },
          "100%": { scale: "1" },
        },
        "scale-out": {
          "0%": { scale: "1" },
          "100%": { scale: "0" },
        },
      },
    },
  },
  plugins: [],
};

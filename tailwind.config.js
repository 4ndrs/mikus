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
        },
      },
    },
  },
  plugins: [],
};

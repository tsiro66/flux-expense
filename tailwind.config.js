/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        expense: "#E53935",
        income: "#43A047",
        payment: "#1E88E5",
        settled: "#9E9E9E",
      },
    },
  },
  plugins: [],
};

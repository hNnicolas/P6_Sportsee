/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./styles/**/*.{css}",
  ],
  theme: {
    extend: {
      keyframes: {
        wave: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "50%": { transform: "rotate(6deg)" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.7" },
        },
      },
      animation: {
        wave: "wave 1.5s ease-in-out infinite",
        pulse: "pulse 3s ease-in-out infinite",
      },

      backgroundImage: {
        "custom-gradient": "linear-gradient(to bottom, #FEFEFF, #F7F8FF)",
      },
    },
  },
  plugins: [],
};

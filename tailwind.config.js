/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        cellow: "#d5b53c",
        clue: "#003A6C",
      },
      fontFamily: {
        sans: ["Catamaran", "sans-serif"],
      },
      keyframes: {
        superbounce: {
          "0%": {
            transform: "translateY(0)",
            animationTiming: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "translateY(-100%)",
            animationTiming: "cubic-bezier(0,0,0.2,1)",
          },
          "100%": {
            transform: "translateY(0)",
            animationTiming: "cubic-bezier(0.8,0,1,1)",
          },
        },
      },
      animation: {
        superbounce: "superbounce 2s infinite",
      },
    },
  },
  plugins: [],
};

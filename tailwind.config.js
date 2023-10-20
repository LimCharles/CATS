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
        creen: "#00693D",
        clue: "#0C3777",
        darkclue: "#00132F",
        crey: "#C1C1C1",
        clack: "#232323",
        darkcrey: "#959595",
        lightcrey: "#DEDEDE",
        lightclack: "#555555",
        darkclack: "#00132F",
        chite: "#F8F8FC",
        lightclue: "#F7FAFF",
        lightchite: "#F8F8F8",
      },
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
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

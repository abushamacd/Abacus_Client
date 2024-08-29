/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors: {
      primary: "#3fb0ac",
      secondary: "#3fb0ac26",
      bg: "#eef2f6",
      bg_dark: "#051114",
      white: "#ffffff",
      black: "#000000",
      mirage: "#121926",
      track_bg: "#3fb0ac",
    },
    container: {
      center: true,
    },
    screens: {
      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      lg: "1024px",
      // => @media (min-width: 992px) { ... }

      xl: "1200px",
      // => @media (min-width: 1200px) { ... }

      "2xl": "1500px",
      // => @media (min-width: 1400px) { ... }
    },
  },
  // corePlugins: {
  //   preflight: false,
  // },
  // important: true,
  plugins: [],
  darkMode: "class",
};

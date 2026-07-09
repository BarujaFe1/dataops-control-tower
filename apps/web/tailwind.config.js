/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tower: {
          bg: "#070B14",
          panel: "#0E1628",
          line: "#1C2A44",
          accent: "#3DDC97",
          warn: "#F5A524",
          danger: "#FF5C5C",
          muted: "#8BA0C0",
        },
      },
      fontFamily: {
        display: ["\"Space Grotesk\"", "Segoe UI", "sans-serif"],
        body: ["\"IBM Plex Sans\"", "Segoe UI", "sans-serif"],
      },
    },
  },
  plugins: [],
};

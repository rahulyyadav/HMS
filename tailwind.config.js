/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0056B3",
          light: "#2A75C0",
          dark: "#00408A",
        },
        secondary: {
          DEFAULT: "#28A745",
          light: "#34CE57",
          dark: "#218838",
        },
        accent: "#FF5722",
        background: {
          light: "#FFFFFF",
          dark: "#0A0A0A",
        },
        text: {
          light: "#333333",
          dark: "#F5F5F5",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      boxShadow: {
        custom: "0 4px 20px rgba(0, 0, 0, 0.1)",
        "custom-hover": "0 8px 30px rgba(0, 0, 0, 0.15)",
      },
    },
  },
  plugins: [],
};

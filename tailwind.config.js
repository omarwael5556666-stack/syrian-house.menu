/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ["Cairo", "sans-serif"],
      },
      colors: {
        brand: {
          50: "#FAF2F1",
          100: "#F1E4E2",
          200: "#E5CBC7",
          300: "#D2A19A",
          400: "#B86A69",
          500: "#8C2334",
          600: "#761E2D",
          700: "#621927",
          800: "#4D1521",
          900: "#3C1019",
          950: "#26090F",
        },
        syrian: {
          burgundy: "#8C2334",
          dark: "#3C1019",
          soft: "#FAF2F1",
          copper: "#B87A4B",
          olive: "#48533B",
          cream: "#FBF8F3",
          warm: "#F3EEE6",
          card: "#FFFFFF",
          text: "#271D1B",
          muted: "#757575",
        },
        dark: {
          800: "#F5EFEB",
          900: "#EDE6DF",
          950: "#FBF8F3",
        },
        // Semantic tokens (admin panel)
        bg: "#FBF8F3",
        surface: "#FFFFFF",
        "surface-2": "#F3EEE6",
        line: "#E8DFD5",
        "line-strong": "#D4C7B9",
        fg: "#271D1B",
        "fg-secondary": "#756B65",
        "fg-muted": "#8D8179",
        accent: {
          DEFAULT: "#8C2334",
          hover: "#6E1B29",
          press: "#761D2C",
        },
        "on-accent": "#FFFFFF",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.4s ease-out forwards",
        "scale-in": "scaleIn 0.3s ease-out forwards",
        "bounce-subtle": "bounceSub 0.6s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        bounceSub: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
      },
    },
  },
  plugins: [],
};

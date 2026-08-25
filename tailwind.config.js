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
          50: "#fff9ed",
          100: "#fff2d4",
          200: "#ffe0a8",
          300: "#ffc970",
          400: "#ffaa37",
          500: "#ff9310",
          600: "#f07806",
          700: "#c75b07",
          800: "#9e480e",
          900: "#7f3c0f",
          950: "#451c05",
        },
        dark: {
          800: "#1a1a2e",
          900: "#111122",
          950: "#0a0a1a",
        },
        // Semantic tokens (admin panel)
        bg: "#131110",
        surface: "#1b1917",
        "surface-2": "#22201c",
        line: "#2d2a25",
        "line-strong": "#3a362f",
        fg: "#f2efe9",
        "fg-secondary": "#b9b4aa",
        "fg-muted": "#8a857b",
        accent: {
          DEFAULT: "#ff9310",
          hover: "#ffab45",
          press: "#e07f08",
        },
        "on-accent": "#201505",
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

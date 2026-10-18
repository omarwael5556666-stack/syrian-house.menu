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
          50: "#FFF0F2",
          100: "#FFE0E5",
          200: "#FFC2CB",
          300: "#FFA3B1",
          400: "#F5435E",
          500: "#E4002B",
          600: "#C8102E",
          700: "#A00D24",
          800: "#7A0A1C",
          900: "#540713",
          950: "#2E030A",
        },
        kfc: {
          red: "#E4002B",
          darkred: "#9A031E",
          lightred: "#FFF0F2",
          cream: "#FAF7F2",
          warm: "#F3EFE8",
          card: "#FFFFFF",
          text: "#1A1A1A",
          muted: "#757575",
        },
        dark: {
          800: "#F5EFEB",
          900: "#EDE6DF",
          950: "#FAF7F2",
        },
        // Semantic tokens (admin panel)
        bg: "#FAF7F2",
        surface: "#FFFFFF",
        "surface-2": "#F3EFE8",
        line: "#E8E2D8",
        "line-strong": "#D0C8BC",
        fg: "#1A1A1A",
        "fg-secondary": "#666666",
        "fg-muted": "#8A857B",
        accent: {
          DEFAULT: "#E4002B",
          hover: "#C8102E",
          press: "#A00D24",
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

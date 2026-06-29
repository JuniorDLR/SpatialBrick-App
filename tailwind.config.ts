import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "brand-dark": {
          DEFAULT: "#09090B",
          surface: "#18181B",
          elevated: "#27272A",
          border: "#27272A",
        },
        "brand-light": {
          DEFAULT: "#F8FAFC",
          surface: "#FFFFFF",
          elevated: "#F1F5F9",
          border: "#E2E8F0",
        },
        "brand-accent": {
          DEFAULT: "#D4AF37",
          hover: "#E5C65C",
          muted: "#B8922F",
          foreground: "#18130A",
        },
        "brand-silver": {
          DEFAULT: "#D4D8DD",
          bright: "#F4F6F8",
          muted: "#9AA3AF",
          deep: "#475569",
        },
        obsidian: {
          950: "#050607",
          900: "#0B0D10",
          850: "#11151A",
          800: "#171C22",
        },
        charcoal: {
          950: "#0E1014",
          900: "#16181D",
          800: "#20242B",
          700: "#2C323A",
        },
        silver: {
          50: "#F7F8FA",
          100: "#E8EAED",
          200: "#D4D8DD",
          300: "#B8BEC7",
          400: "#9AA3AF",
          500: "#7F8894",
          600: "#656E7A",
        },
        gold: {
          300: "#EAD487",
          400: "#D9B95D",
          500: "#C89D36",
          600: "#A97925",
        },
        /** Reservado exclusivamente para botones de accion principal y temporizador. */
        action: {
          DEFAULT: "#D9B95D",
          hover: "#EAD487",
          ring: "rgba(217, 185, 93, 0.35)",
        },
      },
      boxShadow: {
        "gold-soft": "0 0 0 1px rgba(217, 185, 93, 0.35), 0 12px 30px rgba(0, 0, 0, 0.35)",
        "panel-dark": "0 18px 60px rgba(0, 0, 0, 0.45)",
      },
      backgroundImage: {
        "silver-dark-radial":
          "radial-gradient(circle at top, rgba(184, 190, 199, 0.08), transparent 34rem)",
      },
      fontFamily: {
        sans: ["Arial", "Helvetica", "sans-serif"],
        mono: ["Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;

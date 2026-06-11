import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia, serif"],
      },
      colors: {
        border: "var(--veloura-border)",
        input: "var(--veloura-border)",
        ring: "#d8b46a",
        background: "#120d10",
        foreground: "#fff8f1",
        primary: {
          DEFAULT: "#d8b46a",
          foreground: "#120d10",
        },
        secondary: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#fff8f1",
        },
        destructive: {
          DEFAULT: "#a85a5a",
          foreground: "#fff8f1",
        },
        muted: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#c8b8ad",
        },
        accent: {
          DEFAULT: "#3a1f2d",
          foreground: "#fff8f1",
        },
        veloura: {
          bg: "#120d10",
          ivory: "#fff8f1",
          soft: "#c8b8ad",
          champagne: "#d8b46a",
          rose: "#b76e79",
          plum: "#3a1f2d",
        },
        popover: {
          DEFAULT: "#1a1216",
          foreground: "#fff8f1",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.06)",
          foreground: "#fff8f1",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        luxury: "0 8px 32px rgba(0,0,0,0.22), 0 0 0 1px rgba(255,255,255,0.04) inset",
        glow: "0 0 40px rgba(183,110,121,0.1)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

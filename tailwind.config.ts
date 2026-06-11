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
        border: "rgba(255,255,255,0.12)",
        input: "rgba(255,255,255,0.12)",
        ring: "#d7b46a",
        background: "#141014",
        foreground: "#fff5ee",
        primary: {
          DEFAULT: "#d7b46a",
          foreground: "#141014",
          dark: "#b8924a",
          soft: "rgba(215,180,106,0.15)",
        },
        accent: {
          DEFAULT: "#d7b46a",
          soft: "rgba(215,180,106,0.12)",
          foreground: "#fff5ee",
        },
        secondary: {
          DEFAULT: "#1d171d",
          foreground: "#fff5ee",
        },
        destructive: {
          DEFAULT: "#8b3040",
          foreground: "#fff5ee",
        },
        muted: {
          DEFAULT: "#1d171d",
          foreground: "#b8aaa2",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.065)",
          hover: "rgba(255,255,255,0.09)",
        },
        success: "#62c990",
        wine: {
          DEFAULT: "#6f2d45",
          deep: "#421b2d",
          light: "#8a3a55",
        },
        champagne: {
          DEFAULT: "#d7b46a",
          light: "#f0d99a",
        },
        "soft-champagne": "#f0d99a",
        "rose-nude": "#b76d78",
        "warm-skin": "#c58b72",
        veloura: {
          bg: "#141014",
          elevated: "#1d171d",
          ivory: "#fff5ee",
          soft: "#b8aaa2",
          champagne: "#d7b46a",
          rose: "#b76d78",
          border: "rgba(255,255,255,0.12)",
          green: "#62c990",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.065)",
          foreground: "#fff5ee",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        luxury: "0 8px 28px rgba(0,0,0,0.28)",
        card: "0 4px 20px rgba(0,0,0,0.25)",
        glow: "0 0 32px rgba(215,180,106,0.1), 0 8px 28px rgba(0,0,0,0.28)",
        "warm-glow": "0 0 32px rgba(215,180,106,0.12), 0 8px 28px rgba(111,45,69,0.2)",
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          from: { transform: "translateY(100%)" },
          to: { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

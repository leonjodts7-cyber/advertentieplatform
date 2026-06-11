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
        ring: "#e8c982",
        background: "#140b12",
        foreground: "#fff7ef",
        primary: {
          DEFAULT: "#e8c982",
          foreground: "#160f13",
        },
        secondary: {
          DEFAULT: "rgba(255,248,241,0.055)",
          foreground: "#fff7ef",
        },
        destructive: {
          DEFAULT: "#8f3a55",
          foreground: "#fff7ef",
        },
        muted: {
          DEFAULT: "rgba(255,248,241,0.055)",
          foreground: "#9f8f86",
        },
        accent: {
          DEFAULT: "#3a1b2e",
          foreground: "#fff7ef",
        },
        veloura: {
          bg: "#140b12",
          "bg-mid": "#1a1017",
          "bg-surface": "#21131d",
          ivory: "#fff7ef",
          soft: "#cbb9ad",
          muted: "#9f8f86",
          champagne: "#e8c982",
          "champagne-deep": "#d6ad5f",
          rose: "#c47a8a",
          "rose-deep": "#8f3a55",
          plum: "#3a1b2e",
          "plum-light": "#4b2239",
          green: "#67d391",
        },
        popover: {
          DEFAULT: "#1a1017",
          foreground: "#fff7ef",
        },
        card: {
          DEFAULT: "rgba(255,248,241,0.055)",
          foreground: "#fff7ef",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        luxury:
          "0 12px 40px rgba(58,27,46,0.22), 0 0 0 1px rgba(255,248,241,0.04) inset",
        glow: "0 0 40px rgba(196,122,138,0.12), 0 0 24px rgba(232,201,130,0.08)",
        champagne: "0 4px 20px rgba(232,201,130,0.2), 0 0 12px rgba(232,201,130,0.1)",
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

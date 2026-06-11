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
        border: "rgba(255,255,255,0.10)",
        input: "rgba(255,255,255,0.10)",
        ring: "#caa45d",
        background: "#08070a",
        foreground: "#f7efe7",
        primary: {
          DEFAULT: "#caa45d",
          foreground: "#08070a",
          dark: "#b8924a",
          soft: "rgba(202,164,93,0.15)",
        },
        accent: {
          DEFAULT: "#caa45d",
          soft: "rgba(202,164,93,0.12)",
          foreground: "#f7efe7",
        },
        secondary: {
          DEFAULT: "#171016",
          foreground: "#f7efe7",
        },
        destructive: {
          DEFAULT: "#8b2e3a",
          foreground: "#f7efe7",
        },
        muted: {
          DEFAULT: "#171016",
          foreground: "#a79a91",
        },
        surface: {
          DEFAULT: "rgba(255,255,255,0.045)",
          soft: "#171016",
        },
        success: "#62c990",
        wine: {
          DEFAULT: "#5a1f35",
          light: "#7b2e49",
        },
        velvet: {
          DEFAULT: "#2b1826",
          light: "#3a2033",
        },
        champagne: {
          DEFAULT: "#caa45d",
          light: "#e0bd73",
        },
        veloura: {
          bg: "#08070a",
          "bg-mid": "#100b10",
          "bg-soft": "#171016",
          ivory: "#f7efe7",
          soft: "#a79a91",
          muted: "#a79a91",
          champagne: "#caa45d",
          rose: "#a9576d",
          border: "rgba(255,255,255,0.10)",
          green: "#62c990",
        },
        card: {
          DEFAULT: "rgba(255,255,255,0.045)",
          foreground: "#f7efe7",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        luxury: "0 8px 32px rgba(0,0,0,0.45)",
        card: "0 4px 24px rgba(0,0,0,0.35)",
        glow: "0 0 40px rgba(202,164,93,0.12), 0 8px 32px rgba(0,0,0,0.4)",
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

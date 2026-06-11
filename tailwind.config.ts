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
        border: "#E8D6CF",
        input: "#E8D6CF",
        ring: "#B76E79",
        background: "#FFF7F2",
        foreground: "#241718",
        primary: {
          DEFAULT: "#B76E79",
          foreground: "#FFFFFF",
          dark: "#8F4E5B",
          soft: "#F1D8D2",
        },
        accent: {
          DEFAULT: "#D8A96A",
          soft: "#FAE8C8",
          foreground: "#241718",
        },
        secondary: {
          DEFAULT: "#F8EDE7",
          foreground: "#241718",
        },
        destructive: {
          DEFAULT: "#B84A4A",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F8EDE7",
          foreground: "#7A6461",
        },
        surface: {
          DEFAULT: "#FFFFFF",
          soft: "#F8EDE7",
        },
        success: "#6F9E83",
        veloura: {
          bg: "#FFF7F2",
          surface: "#FFFFFF",
          "surface-soft": "#F8EDE7",
          ivory: "#241718",
          soft: "#7A6461",
          muted: "#7A6461",
          champagne: "#D8A96A",
          rose: "#B76E79",
          "rose-dark": "#8F4E5B",
          border: "#E8D6CF",
          green: "#6F9E83",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#241718",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        luxury: "0 8px 30px rgba(36,23,24,0.06), 0 2px 8px rgba(36,23,24,0.04)",
        card: "0 4px 20px rgba(183,110,121,0.08)",
        glow: "0 8px 32px rgba(183,110,121,0.12)",
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

/** Shared design tokens — mirror CSS variables in globals.css */
export const designSystem = {
  colors: {
    wine: "#7b2f49",
    gold: "#d6b36b",
    cream: "#fff6ef",
    dark: "#1a1218",
    muted: "#9a8f88",
  },
  radius: {
    sm: "0.375rem",
    md: "0.75rem",
    lg: "1rem",
    pill: "999px",
  },
  spacing: {
    section: "2.5rem",
    card: "1rem",
    chip: "0.375rem",
  },
  typography: {
    display: "var(--font-display)",
    body: "var(--font-sans)",
  },
} as const;

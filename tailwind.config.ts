import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Space Grotesk'", "var(--font-display)", "system-ui", "sans-serif"],
        sans: ["'Inter'", "var(--font-sans)", "system-ui", "sans-serif"],
      },
      colors: {
        brand: { DEFAULT: "#8b7bff", 2: "#38e1c6" },
      },
    },
  },
  plugins: [],
} satisfies Config;

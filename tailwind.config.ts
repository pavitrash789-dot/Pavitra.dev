import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Gambetta'", "'Newsreader'", "Georgia", "serif"],
        sans: ["'Switzer'", "'Hanken Grotesk'", "system-ui", "-apple-system", "sans-serif"],
        display: ["'Gambetta'", "'Newsreader'", "Georgia", "serif"],
      },
      colors: {
        chalk: "#F5F6F2",
        stone: {
          DEFAULT: "#D9DED7",
          border: "#D9DED7",
          panel: "#E8EBE6",
        },
        slate: {
          DEFAULT: "#2C4036",
          dark: "#1E2C25",
        },
        ink: {
          DEFAULT: "#17201B",
          muted: "#4A544E",
        },
        indigo: {
          DEFAULT: "#2D3DA0",
          hover: "#233082",
        },
        whatsapp: "#25D366",
        brand: { DEFAULT: "#2D3DA0", 2: "#2C4036" }, // Backward-compatible mappings
      },
    },
  },
  plugins: [],
} satisfies Config;

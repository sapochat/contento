import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // LinkedIn brand colors
        linkedin: {
          blue: "#0a66c2",
          "blue-hover": "#004182",
          green: "#057642",
          orange: "#FE6D4C",
          "orange-dark": "#B24020",
        },
        // UI colors
        surface: {
          primary: "#FFFFFF",
          secondary: "#F9FAFB",
          dark: "#282828",
        },
        text: {
          primary: "#1F1F1F",
          secondary: "#333333",
          muted: "#666666",
          light: "#B1B1B1",
        },
        border: {
          DEFAULT: "rgba(0,0,0,0.08)",
          strong: "rgba(0,0,0,0.3)",
        },
      },
      boxShadow: {
        card: "0 0 0 1px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;

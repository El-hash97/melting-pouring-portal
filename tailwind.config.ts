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
        foundry: {
          black: "#0A0C10",
          dark: "#111520",
          slate: "#1C2033",
          steel: "#252D42",
          border: "#2E3A55",
          muted: "#7A8499",
          text: "#C8D0E0",
          white: "#E8EDF5",
        },
        molten: {
          DEFAULT: "#FF6B2B",
          bright: "#FF8C5A",
          dim: "#B34A1A",
          glow: "rgba(255, 107, 43, 0.15)",
        },
        active: {
          DEFAULT: "#22C55E",
          dim: "#166534",
          glow: "rgba(34, 197, 94, 0.12)",
        },
        maintenance: {
          DEFAULT: "#F59E0B",
          dim: "#92400E",
          glow: "rgba(245, 158, 11, 0.12)",
        },
      },
      fontFamily: {
        display: ["var(--font-rajdhani)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      animation: {
        "molten-flow": "moltenFlow 8s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "scan-line": "scanLine 4s linear infinite",
      },
      keyframes: {
        moltenFlow: {
          "0%, 100%": {
            backgroundPosition: "0% 50%",
            opacity: "0.6",
          },
          "50%": {
            backgroundPosition: "100% 50%",
            opacity: "0.9",
          },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(24px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        scanLine: {
          "0%": { transform: "translateY(-100%)", opacity: "0" },
          "10%": { opacity: "0.4" },
          "90%": { opacity: "0.4" },
          "100%": { transform: "translateY(100vh)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

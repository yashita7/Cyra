/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Official Amazon palette (docs/01)
        ink: "#131A22",
        squid: "#232F3E",
        slate: "#37475A",
        orange: "#FF9900",
        link: "#146EB4",
        sky: "#00A8E1",
        gold: "#FEBD69",
        success: "#2BB673",
        danger: "#E5564E",
        muted: "#C9D1D9",
        // shadcn-style semantic aliases
        border: "#37475A",
        background: "#131A22",
        foreground: "#FFFFFF",
        card: "#232F3E",
        popover: "#232F3E",
        primary: "#FF9900",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        hero: "0 0 0 1px #37475A, 0 8px 40px -12px rgba(255,153,0,.15)",
        glow: "0 0 0 1px #37475A, 0 0 30px -6px rgba(255,153,0,.35)",
        "glow-sky": "0 0 0 1px #37475A, 0 0 30px -6px rgba(0,168,225,.35)",
        card: "0 0 0 1px #37475A, 0 4px 24px -12px rgba(0,0,0,.6)",
      },
      keyframes: {
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        scan: {
          "0%": { top: "0%" },
          "100%": { top: "100%" },
        },
        "pulse-dot": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: ".5", transform: "scale(1.4)" },
        },
        "grid-fade": {
          "0%, 100%": { opacity: "0.35" },
          "50%": { opacity: "0.7" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      animation: {
        shimmer: "shimmer 1.6s infinite",
        scan: "scan 1.8s ease-in-out infinite alternate",
        "pulse-dot": "pulse-dot 1.4s ease-in-out infinite",
        "grid-fade": "grid-fade 6s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

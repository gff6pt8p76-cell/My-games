import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0A0A0A", 900: "#0A0A0A", 800: "#111111", 700: "#1A1A1A", 600: "#262626" },
        bone: { DEFAULT: "#F5F3EF", 100: "#FAF9F6", 200: "#F5F3EF", 300: "#E9E6E0" },
        gold: { DEFAULT: "#C8A96A", light: "#E3CC9A", dark: "#9C7F45" },
        mist: "#8A8782",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: { luxe: "0.32em" },
      transitionTimingFunction: {
        luxe: "cubic-bezier(0.22, 1, 0.36, 1)",
        quiet: "cubic-bezier(0.65, 0, 0.35, 1)",
      },
      keyframes: {
        marquee: { from: { transform: "translateX(0)" }, to: { transform: "translateX(-50%)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        shimmer: "shimmer 6s linear infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;

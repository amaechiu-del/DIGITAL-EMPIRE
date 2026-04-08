import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#1a1a2e",
          secondary: "#16213e",
          accent: "#0f3460",
          gold: "#e94560",
        },
      },
    },
  },
  plugins: [],
};
export default config;

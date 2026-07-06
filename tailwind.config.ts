import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101820",
        fog: "#f6f8fb",
        accent: "#0f766e",
        sand: "#e8dfd1",
        warn: "#a16207"
      },
      boxShadow: {
        panel: "0 16px 40px -20px rgba(16, 24, 32, 0.45)"
      },
      borderRadius: {
        xl2: "1rem"
      }
    }
  },
  plugins: []
};

export default config;

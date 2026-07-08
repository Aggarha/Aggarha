import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      boxShadow: {
        panel: "0 16px 40px -20px rgba(16, 24, 32, 0.45)"
      }
    }
  },
  plugins: []
};

export default config;

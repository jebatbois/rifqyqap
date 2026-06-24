import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: "#0F172A",
          light: "#1E293B",
        },
        accent: {
          orange: "#F97316",
          hover: "#EA580C",
        }
      },
      // === Pastikan Bagian Ini Ada ===
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      },
      animation: {
        marquee: 'marquee 35s linear infinite',
      }
      // === Sampai Sini ===
    },
  },
  plugins: [],
};
export default config;
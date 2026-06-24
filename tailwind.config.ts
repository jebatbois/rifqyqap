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
        // Palet biru untuk background/elemen utama (Dark Mode)
        primary: {
          blue: "#0F172A", // Slate 900 (Gelap)
          light: "#1E293B", // Slate 800 (Lebih terang untuk card)
        },
        // Palet oranye untuk aksen, tombol, dan highlight
        accent: {
          orange: "#F97316", // Orange 500
          hover: "#EA580C", // Orange 600
        }
      },
    },
  },
  plugins: [],
};
export default config;
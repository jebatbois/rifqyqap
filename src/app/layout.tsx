import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

// Konfigurasi Font
const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'], // Pilih ketebalan yang dibutuhkan
  variable: '--font-space-grotesk', // Opsional, jika ingin dipanggil di Tailwind
});

export const metadata: Metadata = {
  title: "Rifqy - Portfolio",
  description: "Personal portfolio of Rifqy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Terapkan font ke seluruh body */}
      <body className={`${spaceGrotesk.className} bg-primary-blue text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}
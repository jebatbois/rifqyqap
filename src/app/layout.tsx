import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
// Import komponen yang baru dibuat
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const spaceGrotesk = Space_Grotesk({ 
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: "Rifqy | Portfolio",
  description: "Personal portfolio of Rifqy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${spaceGrotesk.className} bg-primary-blue text-slate-200 antialiased flex flex-col min-h-screen`}>
        {/* Navbar akan melayang di atas semua konten */}
        <Navbar />
        
        {/* Main content wrapper */}
        <div className="flex-grow flex flex-col">
          {children}
        </div>

        {/* Footer akan selalu berada di bawah */}
        <Footer />
      </body>
    </html>
  );
}
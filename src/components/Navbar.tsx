"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    // Fixed positioning agar selalu terlihat saat di-scroll
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
      <nav className="flex items-center gap-1 bg-primary-blue/70 backdrop-blur-md border border-slate-700/50 rounded-full px-4 py-2 shadow-lg shadow-black/20">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`relative px-4 py-2 text-sm md:text-base font-medium transition-colors duration-300 rounded-full
                ${isActive ? "text-accent-orange" : "text-slate-300 hover:text-white"}
              `}
            >
              {item.name}
              
              {/* Indikator titik oranye di bawah menu yang aktif */}
              {isActive && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-accent-orange rounded-full"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
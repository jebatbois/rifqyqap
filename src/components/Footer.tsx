"use client";

import Link from "next/link";
import { SiGithub, SiInstagram } from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-primary-blue border-t border-slate-800/50 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Copyright Text */}
        <p className="text-sm text-slate-400">© {new Date().getFullYear()} Rifqy Athaya Prayuda. All rights reserved.</p>
        
        {/* Social Links */}
        <div className="flex items-center gap-6">
          <Link 
            href="https://github.com/jebatbois" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-accent-orange transition-all duration-300 hover:scale-110"
          >
            <SiGithub className="w-5 h-5" />
          </Link>
          <Link 
            href="https://www.linkedin.com/in/rifqy-athaya-prayuda-264212274" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-accent-orange transition-all duration-300 hover:scale-110"
          >
            <FaLinkedin className="w-5 h-5" />
          </Link>
          <Link 
            href="https://www.instagram.com/rifqyatpray/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-accent-orange transition-all duration-300 hover:scale-110"
          >
            <SiInstagram className="w-5 h-5" />
          </Link>
        </div>
      </div>
      
      {/* Location Text */}
      <div className="mt-6 text-center text-sm text-slate-400">
        Crafted with ☕ and 💡 in Tanjungpinang
      </div>
    </footer>
  );
}
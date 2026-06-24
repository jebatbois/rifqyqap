import Link from "next/link";
// Ubah import dari 'si' menjadi 'fa' (FontAwesome)
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-primary-blue border-t border-slate-800/50 py-10 mt-auto">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center">
        
     {/* Social Media Links */}
        <div className="flex gap-6 mb-8">
          <Link href="https://github.com/" target="_blank" className="group">
            <span className="sr-only">GitHub</span>
            <FaGithub className="w-6 h-6 text-slate-400 group-hover:text-accent-orange transition-colors duration-300" />
          </Link>
          <Link href="https://linkedin.com/" target="_blank" className="group">
            <span className="sr-only">LinkedIn</span>
            <FaLinkedin className="w-6 h-6 text-slate-400 group-hover:text-accent-orange transition-colors duration-300" />
          </Link>
          <Link href="https://instagram.com/" target="_blank" className="group">
            <span className="sr-only">Instagram</span>
            <FaInstagram className="w-6 h-6 text-slate-400 group-hover:text-accent-orange transition-colors duration-300" />
          </Link>
        </div>

        {/* Signature Line */}
        <div className="text-center space-y-2">
          <p className="text-slate-300 font-medium text-lg tracking-wide">
            Rifqy
          </p>
          <p className="text-slate-500 text-sm">
            Crafted with <span className="text-accent-orange">O</span> in Tanjungpinang
          </p>
          <p className="text-slate-600 text-xs mt-4">
            &copy; {currentYear} All rights reserved.
          </p>
        </div>
        
      </div>
    </footer>
  );
}
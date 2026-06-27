// src/app/contact/page.tsx
"use client"; 

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; 
// Impor ikonminimalis lucide
import { Mail, Phone, MapPin, CheckCircle, AlertCircle, Sparkles,  MessageSquareText } from "lucide-react";
// Impor ikon Fa
import { FaGithub, FaLinkedin } from "react-icons/fa"; 

export default function Contact() {
  // State form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  // State feedback
  const [status, setStatus] = useState<null | "submitting" | "success" | "error">(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle perubahan input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const { data, error } = await supabase.from("messages").insert([
        { name: formData.name, email: formData.email, message: formData.message, is_read: false }
      ]).select();

      if (error) {
        throw error;
      }

      if (!data || (Array.isArray(data) && data.length === 0)) {
        throw new Error("Message was not saved.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
      setTimeout(() => setStatus(null), 5000);
    } catch (err: any) {
      const message = err?.message || JSON.stringify(err) || "Unknown error occurred.";
      console.error("Send message error:", err);
      setErrorMessage(message);
      setStatus("error");
    }
  };

  // Konfigurasi feedback tombol
  const getButtonContent = () => {
    switch (status) {
      case "submitting":
        return <span className="flex items-center gap-2.5"><span className="w-4 h-4 border-2 border-slate-300 border-t-white rounded-full animate-spin"></span>Sending...</span>;
      case "success":
        return <span className="flex items-center gap-2.5 text-accent-orange font-bold transition-all"><CheckCircle className="w-5 h-5 text-accent-orange" />Sent Successfully!</span>;
      case "error":
        return <span className="flex items-center gap-2.5 text-red-500 font-bold transition-all"><AlertCircle className="w-5 h-5 text-red-500" />Something went wrong.</span>;
      default:
        return <span className="flex items-center gap-2.5 group"><MessageSquareText className="w-5 h-5 group-hover:scale-110 transition-all"/>Send Message</span>;
    }
  };

  return (
    <main className="min-h-screen bg-primary-blue text-slate-200 flex flex-col items-center pt-24 px-6 relative">
      
      {/* Global Mouse-Follow Grid Pattern (Copy dari Home) */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col gap-20 pb-24 z-10 relative mt-16 md:mt-24">
        
        {/* --- HERO SECTION --- (Pertahankan coding) */}
        <section className="text-center md:text-left border-b border-slate-800/50 pb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">Let's Connect & <span className="text-accent-orange">Innovate</span></h1>
          <p className="text-xl md:text-2xl text-slate-400 mt-5 leading-relaxed max-w-3xl">Have a question, a project idea, or just want to chat about tech? Drop me a message below, and let's explore how we can build something amazing together.</p>
        </section>

        {/* --- MAIN INTERACTION SECTION (SPLIT-SCREEN LAYOUT) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start w-full">
          
          {/* --- LEFT SIDE: THE CONTACT FORM --- */}
          <section className="bg-primary-light p-10 rounded-2xl border border-slate-700/50 relative group space-y-8 w-full flex flex-col">
             {/* Efek Internal Glint Layer */}
             <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none rounded-2xl"></div>

             <div className="flex items-center gap-3 relative z-10 w-full">
                <div className="w-10 h-10 bg-accent-orange/10 rounded-xl flex items-center justify-center text-accent-orange flex-shrink-0"><Sparkles className="w-5 h-5"/></div>
                <h2 className="text-2xl font-bold text-white">Send me a message</h2>
             </div>

             <form onSubmit={handleSubmit} className="space-y-6 w-full relative z-10 flex flex-col">
               
               {/* Name Input */}
               <div className="space-y-2.5 w-full">
                  <label htmlFor="name" className="block text-sm font-semibold text-slate-300">Your Full Name <span className="text-accent-orange">*</span></label>
                  <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g., Jane Doe" className="w-full px-5 py-4 font-medium bg-primary-blue rounded-xl border border-slate-700/50 transition-all focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none placeholder:text-slate-600/80" />
               </div>

               {/* Email Input */}
               <div className="space-y-2.5 w-full">
                  <label htmlFor="email" className="block text-sm font-semibold text-slate-300">Your Email Address <span className="text-accent-orange">*</span></label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder="jdoe@example.com" className="w-full px-5 py-4 font-medium bg-primary-blue rounded-xl border border-slate-700/50 transition-all focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none placeholder:text-slate-600/80" />
               </div>

               {/* Message Textarea */}
               <div className="space-y-2.5 w-full flex-grow">
                  <label htmlFor="message" className="block text-sm font-semibold text-slate-300">Your Message <span className="text-accent-orange">*</span></label>
                  <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} placeholder="Tell me what you have in mind..." className="w-full px-5 py-4 font-medium bg-primary-blue rounded-xl border border-slate-700/50 transition-all focus:border-accent-orange focus:ring-1 focus:ring-accent-orange outline-none resize-none flex-grow" ></textarea>
               </div>

               {/* Submit Button & Info */}
               <div className="relative pt-4 w-full border-t border-slate-800 mt-auto">
                  <button type="submit" disabled={status === "submitting" || status === "success"} className={`w-full px-8 py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center ${status === "submitting" || status === "success" ? "bg-slate-700 text-slate-400 cursor-not-allowed" : "bg-accent-orange hover:bg-accent-hover text-white hover:shadow-accent-orange/50 hover:scale-105" }`} >
                    {/* feedback tombol */}
                    {getButtonContent()}
                  </button>
                  {errorMessage && (
                    <p className="mt-3 text-sm text-red-300">Error: {errorMessage}</p>
                  )}
               </div>
             </form>
          </section>

          {/* --- RIGHT SIDE: CONNECT CARDS --- */}
          <section className="space-y-6 h-full flex flex-col items-start pt-0">
            <h3 className="text-xl md:text-2xl font-bold text-white text-left">Or reach me via</h3>
            
            <div className="grid grid-cols-1 gap-4 w-full">
              
              {/* Connect Card: Email */}
              <Link href="mailto:your_email@example.com" className="group relative overflow-hidden bg-primary-light p-4 rounded-xl border border-slate-700 transition-all hover:border-accent-orange/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-orange/15 flex items-center gap-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center text-accent-orange flex-shrink-0 transition-transform group-hover:scale-110 relative z-10"><Mail className="w-5 h-5"/></div>
                <div className="flex-1 relative z-10 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-accent-orange transition-colors">Email</h4>
                  <p className="text-xs text-slate-400 truncate">your_email@example.com</p>
                </div>
              </Link>

              {/* Connect Card: LinkedIn */}
              <Link href="https://linkedin.com/" target="_blank" className="group relative overflow-hidden bg-primary-light p-4 rounded-xl border border-slate-700 transition-all hover:border-accent-orange/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-orange/15 flex items-center gap-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center text-accent-orange flex-shrink-0 transition-transform group-hover:scale-110 relative z-10"><FaLinkedin className="w-5 h-5"/></div>
                <div className="flex-1 relative z-10 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-accent-orange transition-colors">LinkedIn</h4>
                  <p className="text-xs text-slate-400 truncate">linkedin.com/in/yourprofile</p>
                </div>
              </Link>

              {/* Connect Card: Github */}
              <Link href="https://github.com/" target="_blank" className="group relative overflow-hidden bg-primary-light p-4 rounded-xl border border-slate-700 transition-all hover:border-accent-orange/50 hover:-translate-y-1 hover:shadow-lg hover:shadow-accent-orange/15 flex items-center gap-4">
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center text-accent-orange flex-shrink-0 transition-transform group-hover:scale-110 relative z-10"><FaGithub className="w-5 h-5"/></div>
                <div className="flex-1 relative z-10 min-w-0">
                  <h4 className="text-sm font-semibold text-white group-hover:text-accent-orange transition-colors">GitHub</h4>
                  <p className="text-xs text-slate-400 truncate">github.com/yourusername</p>
                </div>
              </Link>

              {/* Connect Card: Location */}
              <div className="group relative overflow-hidden bg-primary-light p-4 rounded-xl border border-slate-700/50 flex items-center gap-4">
                <div className="w-10 h-10 bg-accent-orange/10 rounded-lg flex items-center justify-center text-accent-orange flex-shrink-0 relative z-10"><MapPin className="w-5 h-5"/></div>
                <div className="flex-1 relative z-10 min-w-0">
                  <h4 className="text-sm font-semibold text-white">Location</h4>
                  <p className="text-xs text-slate-400 truncate">Tanjungpinang, Riau Islands</p>
                </div>
              </div>

            </div>
          </section>
        </div>

      </div>
    </main>
  );
}
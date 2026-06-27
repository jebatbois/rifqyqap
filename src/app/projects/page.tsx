// src/app/projects/page.tsx
"use client"; // Kita menggunakan client-side fetching dan state untuk modal

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Impor Supabase client
import { supabase } from "@/lib/supabase"; 
// Impor ikonminimalis dari lucide-react dan react-icons
import { X, ExternalLink, Zap, FolderHeart, Layout, CalendarDays, Code } from "lucide-react";
// Gunakan koleksi Fa (FontAwesome) untuk Github agar konsisten dengan Footer
import { FaGithub } from "react-icons/fa"; 

// Add custom styles for hiding scrollbar
const style = `
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// --- Interface untuk data Proyek dari Supabase ---
interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[]; // Array teks untuk menyimpan list teknologi
  image_url: string | null;
  image_urls: string[]; // New field for multiple images
  live_url: string | null;
  repo_url: string | null;
  featured: boolean;
  created_at: string;
}

// --- Komponen Modal Card (Akan ditampilkan saat proyek diklik) ---
const Modal = ({ project, onClose }: { project: Project; onClose: () => void }) => {
  if (!project) return null;

  return (
    <>
      <style>{style}</style>
      {/* Wadah Backdrop (Latar belakang transparan blur) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-slate-950/80 backdrop-blur-sm" onClick={onClose}>
        
        {/* Wadah Modal Card (Gaya modern, dark navy, border glow) */}
        <div className="relative bg-primary-light p-8 md:p-12 rounded-3xl border border-slate-700 shadow-[0_0_50px_rgba(249,115,22,0.3)] w-full max-w-4xl max-h-[90vh] overflow-y-auto space-y-8 flex flex-col md:flex-row gap-8 md:gap-12 transition-all duration-300 group" onClick={(e) => e.stopPropagation() /* Mencegah modal menutup saat konten diklik */}>
          
          {/* Tombol Close (Pojok kanan atas) */}
          <button onClick={onClose} className="absolute top-6 right-6 text-slate-500 hover:text-accent-orange transition-colors duration-300 z-10">
            <X className="w-6 h-6" />
          </button>

          {/* --- Bagian Kiri Modal (Visual Proyek) --- */}
          <div className="flex-1 space-y-6 w-full">
            {/* Multi-Image Gallery */}
            <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-800 w-full flex flex-col justify-center items-center">
              {project.image_urls && project.image_urls.length > 0 ? (
                <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory hide-scrollbar w-full h-full">
                  {project.image_urls.map((imageUrl, index) => (
                    <div key={index} className="w-full flex-shrink-0 snap-center relative">
                      <Image 
                        src={imageUrl} 
                        alt={`${project.title} - Image ${index + 1}`} 
                        fill 
                        className="object-cover" 
                      />
                    </div>
                  ))}
                </div>
              ) : project.image_url ? (
                <Image src={project.image_url} alt={project.title} fill className="object-cover" />
              ) : (
                // Ikon generik jika tidak ada gambar
                <div className="w-full h-full flex flex-col justify-center items-center bg-primary-blue/50">
                  <FolderHeart className="w-20 h-20 text-accent-orange opacity-40 mb-4" />
                  <p className="text-slate-600 text-sm">Visual preview not available</p>
                </div>
              )}
              {/* Efek Internal Glint Layer (Copy dari Home) */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </div>
            
            {/* Detail Metadata (Dibuat minimalis seperti halaman About) */}
            <div className="flex items-center gap-6 text-sm text-slate-400 border-t border-slate-700/50 pt-4 w-full">
              <span className="flex items-center gap-1.5 whitespace-nowrap"><FolderHeart className="w-4 h-4 text-slate-600"/>{project.featured ? "Featured" : "Personal"}</span>
              <span className="flex items-center gap-1.5 whitespace-nowrap"><CalendarDays className="w-4 h-4 text-slate-600"/>{project.created_at.split('T')[0]}</span>
            </div>
          </div>

          {/* --- Bagian Kanan Modal (Informasi Lengkap Proyek) --- */}
          <div className="flex-1 space-y-8 w-full">
            <div className="space-y-3 w-full">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {project.title}
              </h2>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-accent-orange"/>
                <p className="text-base font-semibold text-accent-orange whitespace-pre-line text-left leading-relaxed">Scalable Digital Product & Machine Learning Integration</p>
              </div>
            </div>

            <p className="text-slate-300 text-sm md:text-base leading-relaxed text-left pt-2">{project.description}</p>

            {/* --- Tech Stack (Label Kecil dengan detail teknis) --- */}
            <div className="space-y-3 w-full pt-2">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-accent-orange"/>
                <h4 className="text-lg font-bold text-white tracking-wide uppercase">Core Technologies</h4>
              </div>
              <div className="flex flex-wrap gap-2.5 w-full">
                {project.tech_stack.map((tech, index) => (
                  <span key={index} className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-mono text-slate-300 bg-primary-blue rounded-full border border-slate-700 group-hover:border-accent-orange/20 transition-all">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* --- Call to Action (Tombol Link) --- */}
            <div className="flex flex-wrap items-center gap-4 border-t border-slate-800 pt-8 mt-auto relative z-10 w-full">
              {project.live_url && (
                <Link href={project.live_url} target="_blank" className="group flex items-center gap-2.5 bg-accent-orange hover:bg-accent-hover text-white px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-accent-orange/50">
                  Live Demo
                  <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"/>
                </Link>
              )}
              {project.repo_url && (
                <Link href={project.repo_url} target="_blank" className="group flex items-center gap-2.5 text-slate-300 hover:text-white px-7 py-3 rounded-full font-semibold text-sm transition-all duration-300 border border-slate-700 hover:border-accent-orange shadow-lg hover:shadow-accent-orange/15">
                  <FaGithub className="w-4 h-4"/>
                  Github Repository
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

// --- Komponen Utama Halaman Projects ---
export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data proyek saat halaman dimuat
  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        // Urutkan berdasarkan featured dulu, lalu created_at (terbaru)
        .order('featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching projects:", error);
      } else {
        setProjects(data || []);
      }
      setLoading(false);
    };

    fetchProjects();
  }, []);

  return (
    <main className="min-h-screen bg-primary-blue text-slate-200 flex flex-col items-center pt-24 px-6 relative">
      
      {/* Global Mouse-Follow Grid Pattern (Copy dari Home) */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col gap-24 pb-24 z-10 relative">
        
        {/* --- HERO SECTION --- */}
        <section className="text-center pt-16 border-b border-slate-800/50 pb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            My <span className="text-accent-orange">Projects</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-400 mt-4 leading-relaxed max-w-2xl mx-auto">
            A showcase of digital products, fullstack applications, and machine learning models crafted with modern technologies.
          </p>
        </section>

        {/* --- PROJECTS GRID SECTION --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <Layout className="w-8 h-8 text-accent-orange" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Project Showcase</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative w-full">
            {projects.map(project => (
              // Wadah Kartu Proyek (Dibuat Modern seperti About Skills Card)
              <div key={project.id} className="group relative overflow-hidden bg-primary-light p-6 md:p-8 rounded-2xl border border-slate-700 transition-all duration-500 hover:border-accent-orange/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-accent-orange/15 cursor-pointer w-full flex flex-col h-full" onClick={() => setSelectedProject(project) /* Buka Modal saat kartu diklik */}>
                
                {/* Efek Internal Glint Layer (pure CSS) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Visual Preview (Mockup) */}
                <div className="relative aspect-video rounded-xl overflow-hidden mb-6 border border-slate-800 w-full flex-shrink-0 flex justify-center items-center">
                  {project.image_urls && project.image_urls.length > 0 ? (
                    <Image src={project.image_urls[0]} alt={project.title} fill className="object-cover" />
                  ) : project.image_url ? (
                    <Image src={project.image_url} alt={project.title} fill className="object-cover" />
                  ) : (
                    // Ikon generik jika tidak ada gambar
                    <div className="w-full h-full flex justify-center items-center bg-primary-blue/50">
                      <FolderHeart className="w-12 h-12 text-accent-orange opacity-40" />
                    </div>
                  )}
                </div>

                {/* Informasi Singkat Proyek */}
                <div className="flex flex-col gap-2 relative z-10 w-full flex-grow">
                  <h3 className="text-xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-accent-orange text-left leading-snug">
                    {project.title}
                  </h3>
                  {/* Tech Stack Icons (Meningkatkan texture card) - Dibuat Minimalis seperti About Skills Card */}
                  <p className="text-xs font-mono text-slate-500/80 mb-2 whitespace-nowrap overflow-hidden text-ellipsis">[ {project.tech_stack.join(" | ")} ]</p>
                  <p className="text-slate-400 text-sm leading-relaxed text-left text-ellipsis overflow-hidden line-clamp-3">
                    {project.description}
                  </p>
                </div>

                {/* Label Kategori (Dibuat simpel di footer kartu) */}
                <div className="flex items-center gap-1.5 text-xs text-slate-500 border-t border-slate-700/50 pt-4 mt-6 relative z-10 w-full">
                    <FolderHeart className="w-3.5 h-3.5 text-slate-600"/>{project.featured ? "Featured Project" : "Personal Project"}
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* --- INTEGRASI MODAL CARD --- */}
      {selectedProject && <Modal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </main>
  );
}
// src/app/about/page.tsx
"use client"; // Kita menggunakan client-side fetching untuk portofolio About

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
// Impor Supabase client
import { supabase } from "@/lib/supabase"; 
// Impor ikonminimalis dari lucide-react dan react-icons
import { Zap, BriefcaseBusiness, GraduationCap, Award, MapPin, CalendarDays, ExternalLink, Mail, Phone, Map } from "lucide-react";
import { 
  SiNextdotjs, SiReact, SiTailwindcss, SiPhp, SiLaravel, SiCodeigniter, SiUbuntu, SiMysql, SiPostgresql, SiGithub, SiFigma, SiSupabase, SiNodedotjs, SiPython, SiTensorflow, SiPandas, SiScikitlearn 
} from "react-icons/si";
// Ikon untuk kategori data & machine learning dan soft skills kustom
import { FaBrain, FaRegCommentDots, FaClock } from "react-icons/fa"; 

// --- Interface untuk data dari Supabase ---
interface Skill {
  id: number;
  name: string;
  category: string;
  icon_name: string;
}

interface Experience {
  id: number;
  role: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
}

interface Certificate {
  id: number;
  title: string;
  credential_provider: string;
  issue_date: string;
  credential_url: string;
  image_url: string | null;
}

// --- Peta Ikon Ikon Ikon ---
// Kunci di sini harus sesuai dengan nilai 'icon_name' di tabel skills database Anda.
const iconMap: { [key: string]: React.ReactElement } = {
  SiNextdotjs: <SiNextdotjs className="w-3.5 h-3.5" />,
  SiReact: <SiReact className="w-3.5 h-3.5" />,
  SiTailwindcss: <SiTailwindcss className="w-3.5 h-3.5" />,
  SiPhp: <SiPhp className="w-3.5 h-3.5" />,
  SiLaravel: <SiLaravel className="w-3.5 h-3.5" />,
  SiCodeigniter: <SiCodeigniter className="w-3.5 h-3.5" />,
  SiUbuntu: <SiUbuntu className="w-3.5 h-3.5" />,
  SiMysql: <SiMysql className="w-3.5 h-3.5" />,
  SiPostgresql: <SiPostgresql className="w-3.5 h-3.5" />,
  SiGithub: <SiGithub className="w-3.5 h-3.5" />,
  SiFigma: <SiFigma className="w-3.5 h-3.5" />,
  SiSupabase: <SiSupabase className="w-3.5 h-3.5" />,
  SiNodedotjs: <SiNodedotjs className="w-3.5 h-3.5" />,
  SiPython: <SiPython className="w-3.5 h-3.5" />,
  SiTensorflow: <SiTensorflow className="w-3.5 h-3.5" />,
  SiPandas: <SiPandas className="w-3.5 h-3.5" />,
  SiScikitlearn: <SiScikitlearn className="w-3.5 h-3.5" />,
  FaBrain: <FaBrain className="w-3.5 h-3.5" />,
  FaRegCommentDots: <FaRegCommentDots className="w-3.5 h-3.5" />,
  FaClock: <FaClock className="w-3.5 h-3.5" />,
};

// Kategori skills statis sesuai permintaan (pembantu untuk UI)
const categories = [
  "frontend", "backend", "database", "devops", "design tools", "version control", "data & machine learning", "soft skills"
];

export default function About() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data dari database saat halaman dimuat
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [
        { data: skillsData, error: skillsError },
        { data: experiencesData, error: experiencesError },
        { data: certificatesData, error: certificatesError }
      ] = await Promise.all([
        // Ambil skills, urutkan berdasarkan kategori agar rapi di UI
        supabase.from('skills').select('*').order('category', { ascending: true }),
        // Ambil experiences, urutkan berdasarkan start_date agar pohon timeline runtut
        supabase.from('experiences').select('*').order('start_date', { ascending: false }),
        // Ambil certificates, urutkan berdasarkan issue_date
        supabase.from('certificates').select('*').order('issue_date', { ascending: false })
      ]);

      if (skillsError) console.error("Error fetching skills:", skillsError);
      if (experiencesError) console.error("Error fetching experiences:", experiencesError);
      if (certificatesError) console.error("Error fetching certificates:", certificatesError);

      setSkills(skillsData || []);
      setExperiences(experiencesData || []);
      setCertificates(certificatesData || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  // Kelompokkan data skills berdasarkan kategorinya secara efisien
  const groupedSkills: { [key: string]: Skill[] } = categories.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.category === category);
    return acc;
  }, {} as { [key: string]: Skill[] });

  return (
    <main className="min-h-screen bg-primary-blue text-slate-200 flex flex-col items-center pt-24 px-6 relative">
      
      {/* Global Mouse-Follow Grid Pattern (Copy dari Home) */}
      <div className="fixed inset-0 bg-grid-pattern opacity-10 pointer-events-none" />

      <div className="max-w-6xl w-full flex flex-col gap-24 pb-24 z-10 relative">
        
        {/* --- HERO SECTION (Tentang Saya) --- */}
        <section className="flex flex-col md:flex-row items-center gap-12 pt-16 border-b border-slate-800/50 pb-16">
          {/* Foto Profil Kecil di Sebelah Kiri */}
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-accent-orange shadow-lg shadow-accent-orange/30 flex-shrink-0">
            <Image src="/img/profile.jpg" alt="Rifqy's Portrait" fill className="object-cover object-center" />
          </div>
          {/* Nama Saya dan Deskripsi Singkat */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              <span className="text-accent-orange">Rifqy Athaya Prayuda</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed">
              A passionate tech enthusiast specializing in fullstack web development and machine learning solutions, focused on turning complex problems into scalable digital products.
            </p>
          </div>
        </section>

        {/* --- SKILLS SECTION (Bentuk Memanjang dengan Ikon) --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-accent-orange" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Skills & Toolkit</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
            {categories.map(category => (
              <div key={category} className="group relative overflow-hidden bg-primary-light p-6 rounded-2xl border border-slate-700 transition-all duration-500 hover:border-accent-orange/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-accent-orange/15 w-full">
                {/* Efek Internal Glint Layer (Copy dari Home) */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                <div className="relative z-10 flex flex-col gap-4 w-full">
                  {/* Judul Kategori (Frontend, Backend, dll.) */}
                  <h3 className="text-xl font-bold text-white tracking-wide uppercase transition-colors duration-300 group-hover:text-accent-orange">
                    {category}
                  </h3>
                  {/* Daftar Ikon Memanjang (Flexwrap) */}
                  <div className="flex flex-wrap gap-2.5 w-full">
                    {groupedSkills[category].length > 0 ? groupedSkills[category].map(skill => (
                      <span key={skill.id} className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-slate-300 bg-primary-blue/60 rounded-full border border-slate-700/50 group-hover:border-accent-orange/20 transition-all">
                        {iconMap[skill.icon_name] || <SiGithub className="w-3.5 h-3.5" />} {/* Gunakan ikon dari peta berdasarkan icon_name */}
                        {skill.name}
                      </span>
                    )) : <span className="text-sm text-slate-500 font-medium whitespace-nowrap">No skills added yet</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- EXPERIENCE SECTION (Pohon Timeline) --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <BriefcaseBusiness className="w-8 h-8 text-accent-orange" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Professional Journey</h2>
          </div>
          {/* Wadah Pohon Timeline */}
          <div className="relative pl-10 md:pl-16 border-l-2 border-slate-700 space-y-12 w-full max-w-4xl mx-auto">
            {experiences.map(exp => (
              <div key={exp.id} className="group relative w-full">
                {/* Titik Timeline Pohon (Aksen Oranje) */}
                <div className="absolute left-0 top-1.5 w-6 h-6 bg-primary-light rounded-full border-4 border-accent-orange z-10 shadow-lg shadow-accent-orange/30 group-hover:scale-110 group-hover:bg-accent-orange group-hover:shadow-accent-orange/60 transition-all duration-300 -translate-x-1/2"></div>
                {/* Konten Timeline */}
                <div className="relative bg-primary-light p-6 rounded-2xl border border-slate-700 transition-all duration-500 hover:border-accent-orange/50 hover:shadow-lg hover:shadow-accent-orange/15 w-full space-y-3">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4 w-full">
                    <h3 className="text-xl font-bold text-white transition-colors duration-300 group-hover:text-accent-orange">{exp.role}</h3>
                    <span className="text-sm text-slate-500 font-medium whitespace-nowrap">({exp.start_date} - {exp.is_current ? "Present" : exp.end_date})</span>
                  </div>
                  <p className="text-lg font-semibold text-accent-orange/90 whitespace-nowrap">{exp.company}</p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm text-slate-400 border-t border-slate-700/50 pt-2.5">
                    <span className="flex items-center gap-1.5 whitespace-nowrap"><MapPin className="w-4 h-4 text-slate-600" />{exp.location}</span>
                    <span className="flex items-center gap-1.5 whitespace-nowrap"><CalendarDays className="w-4 h-4 text-slate-600" />{exp.start_date} - {exp.is_current ? "Present" : exp.end_date}</span>
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line text-left pt-2">{exp.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- PENDIDIKAN SECTION (Card Statis) --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <GraduationCap className="w-8 h-8 text-accent-orange" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Academic Foundation</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative w-full">
            
            {/* Pendidikan Kuliah UMRAH (STATIS) */}
            <div className="group relative overflow-hidden bg-primary-light p-6 md:p-8 rounded-2xl border border-slate-700 transition-all duration-500 hover:border-accent-orange/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-accent-orange/15 space-y-4 flex flex-col w-full">
              {/* Efek Internal Glint Layer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-4 relative z-10 w-full">
                <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center text-accent-orange flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-0.5 w-full">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-accent-orange whitespace-nowrap">Universitas Maritim Raja Ali Haji</h3>
                  <p className="text-base font-semibold text-accent-orange/90 whitespace-nowrap overflow-hidden text-ellipsis">Informatics Engineering</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed text-left relative z-10 w-full flex-grow">A Bachelor of Engineering degree focusing on computer science fundamentals, scalable digital product development, and machine learning robust model integration.</p>
              <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-700/50 pt-4 relative z-10 w-full mt-auto">
                <span>Current GPA: 3.45</span>
                <span>Tanjungpinang, Riau Islands</span>
              </div>
            </div>

            {/* Pendidikan SMA Statis (Copy dari UMRAH) */}
            <div className="group relative overflow-hidden bg-primary-light p-6 md:p-8 rounded-2xl border border-slate-700 transition-all duration-500 hover:border-accent-orange/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-accent-orange/15 space-y-4 flex flex-col w-full">
              {/* Efek Internal Glint Layer */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              
              <div className="flex items-center gap-4 relative z-10 w-full">
                <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center text-accent-orange flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-0.5 w-full">
                  <h3 className="text-lg md:text-xl font-bold text-white tracking-wide transition-colors duration-300 group-hover:text-accent-orange whitespace-nowrap">SMA Negeri 2 Tanjungpinang</h3>
                  <p className="text-base font-semibold text-accent-orange/90 whitespace-nowrap overflow-hidden text-ellipsis">Math & Natural Science</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm md:text-base leading-relaxed text-left relative z-10 w-full flex-grow">Focused study on natural science fundamentals and advanced mathematics, building a strong analytical and problem-solving foundation.</p>
              <div className="flex items-center justify-between text-sm text-slate-500 border-t border-slate-700/50 pt-4 relative z-10 w-full mt-auto">
                <span>Final Grade: 88,71</span>
                <span>Tanjungpinang, Riau Islands</span>
              </div>
            </div>

          </div>
        </section>

        {/* --- SERTIFIKAT SECTION (Card Ambil dari Supabase) --- */}
        <section className="space-y-12">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-accent-orange" />
            <h2 className="text-3xl md:text-4xl font-bold text-white">Certifications & Awards</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative w-full">
            {certificates.map(cert => (
              <div key={cert.id} className="group relative overflow-hidden bg-primary-light p-6 rounded-2xl border border-slate-700 transition-all duration-500 hover:border-accent-orange/50 hover:-translate-y-2 hover:shadow-lg hover:shadow-accent-orange/15 flex flex-col gap-3 w-full">
                {/* Efek Internal Glint Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                
                {/* Ikon Sertifikat Kustom (Ikon minimalis lucide) */}
                <div className="flex items-center gap-3 relative z-10 w-full flex-grow">
                  <div className="w-9 h-9 bg-accent-orange/10 rounded-lg flex items-center justify-center text-accent-orange flex-shrink-0 transition-transform duration-500 group-hover:scale-110">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-semibold text-white tracking-wide transition-colors duration-300 group-hover:text-accent-orange text-left leading-tight">{cert.title}</h3>
                </div>
                {/* Detail Sertifikat */}
                <div className="space-y-0.5 relative z-10 w-full">
                  <p className="text-sm font-medium text-accent-orange/90 whitespace-nowrap">{cert.credential_provider}</p>
                  <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Issue Date: {cert.issue_date}</span>
                </div>
                {/* Link Verifikasi (Sangat simpel) */}
                {cert.credential_url && (
                  <Link href={cert.credential_url} target="_blank" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-accent-orange border-t border-slate-700/50 pt-2.5 mt-auto relative z-10 w-full">
                    <ExternalLink className="w-3.5 h-3.5"/>
                    Verify Credential
                  </Link>
                )}
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
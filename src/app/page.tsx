import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Code, Layout, Smartphone } from "lucide-react";

// Import ikon dari react-icons (Koleksi Simple Icons)
import { 
  SiPhp, SiLaravel, SiCodeigniter, SiUbuntu, SiMysql, SiPostgresql, 
  SiNodedotjs, SiHtml5, SiCss, SiJavascript, SiReact, SiNextdotjs, 
  SiTypescript, SiGit, SiGithub, SiFigma, SiCanva, SiSupabase, 
  SiPython
} from "react-icons/si";

// Array data untuk tech stack
const techStack = [
  { name: "PHP", icon: SiPhp },
  { name: "Laravel", icon: SiLaravel },
  { name: "CodeIgniter", icon: SiCodeigniter },
  { name: "Ubuntu", icon: SiUbuntu },
  { name: "MySQL", icon: SiMysql },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "HTML5", icon: SiHtml5 },
  { name: "CSS3", icon: SiCss }, // <--- Ubah bagian ini
  { name: "JavaScript", icon: SiJavascript },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "TypeScript", icon: SiTypescript },
  { name: "Python", icon: SiPython },
  { name: "Git", icon: SiGit },
  { name: "GitHub", icon: SiGithub },
  { name: "Figma", icon: SiFigma },
  { name: "Canva", icon: SiCanva },
  { name: "Supabase", icon: SiSupabase },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-primary-blue text-slate-200">
      
      {/* --- HERO SECTION --- */}
      <section className="flex flex-col items-center justify-center pt-32 pb-24 px-6 text-center">
        <div className="relative w-40 h-40 md:w-48 md:h-48 mb-8 rounded-full overflow-hidden border-4 border-accent-orange shadow-[0_0_30px_rgba(249,115,22,0.2)]">
          <Image
            src="/profile.jpg"
            alt="Rifqy's Portrait"
            fill
            className="object-cover"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4 tracking-tight">
          Hi, I'm <span className="text-accent-orange">Rifqy</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl">
          A passionate developer crafting beautiful, functional, and modern digital experiences.
        </p>
        <Link
          href="/about"
          className="group flex items-center gap-2 bg-accent-orange hover:bg-accent-hover text-white px-8 py-3.5 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-accent-orange/50"
        >
          Learn more about me
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </section>

      {/* --- TECH STACK MARQUEE SECTION --- */}
      <section className="relative py-10 bg-primary-blue border-y border-slate-800/50 overflow-hidden">
        {/* Efek gradient di kiri dan kanan agar terlihat fade out */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-primary-blue to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-primary-blue to-transparent z-10 pointer-events-none"></div>

        {/* Container Marquee (Kita duplikasi array agar looping-nya mulus) */}
        <div className="marquee-track">
          {[...techStack, ...techStack].map((tech, index) => (
            <div 
              key={index} 
              className="marquee-item flex items-center gap-3 mx-8 md:mx-12 transition-colors duration-300"
            >
              <tech.icon className="w-8 h-8 md:w-10 md:h-10" />
              <span className="text-sm md:text-base font-semibold tracking-wide whitespace-nowrap">{tech.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* --- WHAT CAN I OFFER SECTION --- */}
      <section className="py-20 px-6 bg-primary-light/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-16">
            What Can I Offer You
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-primary-light p-8 rounded-2xl border border-slate-700 hover:border-accent-orange/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center mb-6 text-accent-orange">
                <Code className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Web Development</h3>
              <p className="text-slate-400 leading-relaxed">
                Building fast, responsive, and dynamic websites tailored to your specific needs using modern technologies.
              </p>
            </div>

            <div className="bg-primary-light p-8 rounded-2xl border border-slate-700 hover:border-accent-orange/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center mb-6 text-accent-orange">
                <Layout className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">UI/UX Design</h3>
              <p className="text-slate-400 leading-relaxed">
                Crafting intuitive and visually appealing user interfaces focusing on best user experiences and accessibility.
              </p>
            </div>

            <div className="bg-primary-light p-8 rounded-2xl border border-slate-700 hover:border-accent-orange/50 transition-all hover:-translate-y-1">
              <div className="w-12 h-12 bg-accent-orange/10 rounded-xl flex items-center justify-center mb-6 text-accent-orange">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Responsive Design</h3>
              <p className="text-slate-400 leading-relaxed">
                Ensuring your web applications look great and function perfectly across all devices and screen sizes.
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </main>
  );
}
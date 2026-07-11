import {  useLocation } from "react-router-dom";
import HeadNavbar from "./Navbar";
import { FaGithub, FaGlobe, FaLinkedin } from "react-icons/fa";


interface Props {
  children: React.ReactNode;
}
const socials = [
  { icon: FaGithub, href: "https://github.com/9-Sujal", label: "GitHub" },
  { icon: FaLinkedin, href: "https://www.linkedin.com/in/sujal-ghorse-1255b0260/", label: "LinkedIn" },
  { icon: FaGlobe, href: "https://myportfolio-qm36.vercel.app/", label: "Portfolio" },
];

export default function Container({ children }: Props) {
   const location = useLocation();

  const readingMode = location.pathname.startsWith("/read/");

  if (readingMode) return children;
  return (
       <div className="min-h-screen bg-violet-100/40 dark:bg-black backdrop-blur-xl transition-colors duration-500">
   <div className="absolute -top-24 -left-24 w-48 h-48 
                bg-violet-400/30 blur-[80px] pointer-events-none 
                dark:bg-cyan-500/20" />

{/* Second accent glow for depth */}
<div className="absolute -bottom-16 -right-16 w-40 h-40 
                bg-sky-400/25 blur-[70px] pointer-events-none 
                dark:bg-indigo-500/20" />
      {/* Demo notice banner */}
      <div className="relative px-4 py-2.5 text-center text-xs md:text-sm
                      bg-slate-900 dark:bg-black
                      text-slate-300 border-b border-white/5">
        <p>This is a demo project. All the books and authors are fictional.</p>
        <p className="font-semibold text-white">
          Please do not post any copyrighted materials!
        </p>
      </div>
 
      <div className="relative min-h-screen max-w-5xl mx-auto flex flex-col overflow-hidden">
 
        {/* ambient glow accents — subtle, sits behind all content */}
        <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
          <div className="absolute -top-[10%] -right-[10%] h-96 w-96 rounded-full
                          bg-blue-500/5 blur-[120px] dark:bg-cyan-500/10" />
          <div className="absolute -bottom-[10%] -left-[10%] h-96 w-96 rounded-full
                          bg-purple-500/5 blur-[120px] dark:bg-indigo-500/10" />
        </div>
 
        <HeadNavbar />
 
        <div className="flex-1 flex flex-col pb-20">{children}</div>
 
        <footer className="pb-10 px-2 flex flex-col items-center gap-4">
          
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/20 blur-[80px] pointer-events-none" />
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="p-2.5 rounded-lg
                           border border-black/5 dark:border-white/10
                           bg-white/60 dark:bg-white/5 backdrop-blur-xl
                           text-slate-600 dark:text-slate-300
                           hover:text-cyan-600 dark:hover:text-cyan-400
                           hover:border-cyan-500/40
                           transition-colors"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Made with love by{" "}
            <a
              className="font-semibold text-cyan-600 dark:text-cyan-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
              href="https://myportfolio-qm36.vercel.app/"
            >
              Sujal Ghorse
            </a>
          </p>

          <div className="absolute -top-24 -left-24 w-48 h-48 
                bg-violet-400/30 blur-[80px] pointer-events-none 
                dark:bg-cyan-500/20" />


<div className="absolute -bottom-16 -right-16 w-40 h-40 
                bg-sky-400/25 blur-[70px] pointer-events-none 
                dark:bg-indigo-500/20" />
        </footer>
      </div>
    </div>

  );
}
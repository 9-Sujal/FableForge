import BookByGenre from "../components/BookByGenre";
import HeroSection from "../components/HeroSection";




export default function Home() {
  return (
   <div className="relative min-h-screen overflow-hidden transition-colors duration-500
                    bg-[#f8fafc] text-slate-900
                    dark:bg-[#030303] dark:text-slate-100">
      
      {/* Futuristic Background Accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Top Right Glow */}
        <div className="absolute -top-[10%] -right-[10%] h-125 w-125 rounded-full 
                        bg-blue-500/10 blur-[120px] dark:bg-cyan-500/20" />
        {/* Bottom Left Glow */}
        <div className="absolute -bottom-[10%] -left-[10%] h-125 w-125 rounded-full 
                        bg-purple-500/10 blur-[120px] dark:bg-indigo-500/20" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 space-y-12 px-5 py-10 max-w-7xl mx-auto">
        <HeroSection />
        
        <div className="space-y-16">
          <BookByGenre genre="Fantasy" />
          <BookByGenre genre="Young Adult" />
          <BookByGenre genre="Science Fiction" />
        </div>
      </div>
    </div>

  )
}

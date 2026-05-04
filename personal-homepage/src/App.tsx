import { Github, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="h-screen w-screen bg-[#fcfcfc] text-[#111111] font-serif p-6 sm:p-12 md:p-16 overflow-hidden flex flex-col">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 flex-grow min-h-0 relative">
        
        {/* Left Content Area */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-7 flex flex-col justify-center z-10 h-full py-4"
        >
          <div className="space-y-6 lg:space-y-10 max-w-2xl">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.85] font-normal tracking-tight">
              <span className="block italic">Kaisa</span>
              <span className="block">Zhang —</span>
            </h1>
            
            <div className="text-lg sm:text-xl lg:text-2xl leading-relaxed text-justify">
              <p className="mb-4">
                Software Engineer and Creative Developer focusing on building <span className="italic">impactful technologies</span> and <span className="italic">web experiences</span>.
              </p>
              <p className="opacity-80 text-base sm:text-lg">
                I enjoy playing with new technologies, contributing to open-source, and sharing what I learn at the intersection of design and engineering.
              </p>
            </div>

            <div className="space-y-3 text-sm sm:text-base border-t border-[#111111] pt-6 max-w-md">
              <a href="mailto:zhangkaisa05@gmail.com" className="flex justify-between items-baseline group">
                <span className="uppercase text-[10px] sm:text-xs font-bold tracking-widest opacity-60">Email</span>
                <span className="font-medium group-hover:italic transition-all">zhangkaisa05@gmail.com</span>
              </a>
              <div className="flex justify-between items-baseline">
                <span className="uppercase text-[10px] sm:text-xs font-bold tracking-widest opacity-60">Company</span>
                <span className="font-medium">Tech Startup</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="uppercase text-[10px] sm:text-xs font-bold tracking-widest opacity-60">Location</span>
                <span className="font-medium">Shanghai, China</span>
              </div>
              <a href="https://github.com/zhangkaisa05" target="_blank" rel="noreferrer" className="flex justify-between items-baseline group">
                <span className="uppercase text-[10px] sm:text-xs font-bold tracking-widest opacity-60">GitHub</span>
                <span className="font-medium group-hover:italic transition-all">@zhangkaisa05</span>
              </a>
            </div>
            
            {/* Quick Projects List */}
            <div className="pt-4 lg:pt-8">
               <h3 className="text-[10px] uppercase tracking-widest font-bold mb-4 border-b border-[#111111] pb-2">Selected Works</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-baseline group">
                   <h4 className="font-medium text-lg leading-snug flex items-center gap-2">
                     Project Alpha 
                     <a href="#" className="opacity-0 group-hover:opacity-100 transition-opacity" title="Source Code"><Github className="w-3.5 h-3.5 inline" /></a>
                   </h4>
                   <span className="uppercase text-[10px] font-bold tracking-widest opacity-60">CUDA / C++</span>
                 </div>
                 <div className="flex justify-between items-baseline group">
                   <h4 className="font-medium text-lg leading-snug flex items-center gap-2">
                     LaTeX Portfolio Generator
                     <a href="#" className="opacity-0 group-hover:opacity-100 transition-opacity" title="Live Demo"><ExternalLink className="w-3.5 h-3.5 inline" /></a>
                   </h4>
                   <span className="uppercase text-[10px] font-bold tracking-widest opacity-60">Python</span>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Right Content Area: Portrait */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="lg:col-span-5 h-full hidden md:flex flex-col justify-center items-end relative"
        >
          <div className="w-full h-[70vh] lg:h-[80vh] bg-[#e5e5e5] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl relative">
            <img 
              src="/08.png" 
              alt="Kaisa Zhang Portrait" 
              className="object-cover w-full h-full object-[center_30%]"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800";
                e.currentTarget.alt = "Fallback Portrait";
              }}
            />
            <div className="absolute bottom-6 right-6 bg-white text-[#111111] px-4 py-1.5 text-[10px] uppercase tracking-widest font-bold shadow-lg">
              est. 1998
            </div>
            {/* Optional decorative frame element */}
            <div className="absolute inset-0 border-[0.5rem] border-[#fcfcfc] mix-blend-overlay opacity-50 pointer-events-none"></div>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="mt-auto flex justify-between items-end border-t border-[#111111] pt-4 shrink-0"
      >
        <div className="text-[10px] tracking-widest uppercase flex flex-col gap-1">
          <span className="opacity-60 font-bold">Kaisa Zhang Portfolio</span>
          <span className="opacity-40">Built with React & Tailwind — Rendered in LaTeX Serif Type</span>
        </div>
        <div className="text-3xl sm:text-4xl leading-none opacity-80">
          α β γ δ
        </div>
      </motion.footer>
    </div>
  );
}

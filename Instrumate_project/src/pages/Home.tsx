import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowUpRight, 
  Sparkles, 
  Brain, 
  Gamepad2, 
  Heart, 
  Star, 
  HandMetal 
} from "lucide-react";
import PageWrapper from "../components/PageWrapper";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      {/* STYLING TOOLKIT 
          - Custom Outfit font
          - Squiggle animation logic 
          - Smooth selection colors
      */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
          
          .hand-drawn-circle {
            position: relative;
            display: inline-block;
            padding: 0 12px;
          }
          
          .squiggle-svg {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 115%;
            height: 150%;
            z-index: -1;
            pointer-events: none;
          }

          .hero-gradient {
            background: radial-gradient(circle at 10% 20%, rgba(94, 59, 238, 0.05) 0%, transparent 50%),
                        radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.05) 0%, transparent 50%);
          }
        `}
      </style>

      <main className="min-h-screen bg-[#FAF9F6] font-['Outfit',sans-serif] pb-32 overflow-x-hidden hero-gradient">
        
        {/* --- 1. HERO SECTION --- */}
        {/* pt-10 is enough now because the MainLayout provides the rest */}
        <section className="relative max-w-7xl mx-auto px-6 pt-10 md:pt-16 text-center">          
          {/* Playful Floating Decorations */}
          <div className="absolute top-0 left-10 text-[#5E3BEE] animate-pulse opacity-20">
            <Sparkles size={80} strokeWidth={1} />
          </div>
          <div className="absolute top-20 right-10 text-[#F59E0B] rotate-12 opacity-20">
            <Heart size={64} fill="currentColor" strokeWidth={0} />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-[#EBE9E0] shadow-sm mb-10">
              <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-[#514B5C] font-bold text-[10px] uppercase tracking-[0.2em]">KSL Inclusive Learning</span>
            </div>

            <h1 className="text-6xl md:text-[100px] font-[800] text-[#2D1A4A] tracking-tighter leading-[0.95]">
              Learning that <br />
              <span className="relative inline-block text-[#5E3BEE]">
                speaks
                <svg className="absolute -bottom-4 left-0 w-full h-5" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0,7 Q25,0 50,7 T100,7" stroke="#F59E0B" strokeWidth="4" fill="transparent" strokeLinecap="round" />
                </svg>
              </span> to all.
            </h1>
            
            <p className="mt-12 text-xl md:text-2xl text-[#514B5C]/70 max-w-2xl mx-auto font-light leading-relaxed">
              The first AI-powered home for deaf and mute learners in Kenya. 
              Making education <span className="font-semibold text-[#2D1A4A]">accessible, visual, and fun.</span>
            </p>

            {/* Circular Primary Redirect Button */}
            <div className="mt-16 flex flex-col items-center">
              <button
                className="group relative w-32 h-32 md:w-40 md:h-40 bg-[#2D1A4A] text-white rounded-full flex flex-col items-center justify-center transition-all duration-700 hover:scale-110 hover:bg-[#5E3BEE] shadow-[0_30px_60px_rgba(45,26,74,0.2)]"
                onClick={() => navigate("/learn")}
              >
                <span className="text-xs font-bold uppercase tracking-[0.3em] mb-2 opacity-60">Enter</span>
                <ArrowUpRight className="w-10 h-10 transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2" />
                <div className="absolute inset-3 rounded-full border border-dashed border-white/20 animate-[spin_15s_linear_infinite]"></div>
              </button>
            </div>
          </div>
        </section>

        {/* --- 2. ENJOYABLE MATERIALS SECTION (Pills & Squiggles) --- */}
        <section className="max-w-7xl mx-auto px-6 mt-40">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            
            {/* Left Column: Text & CTA */}
            <div className="flex-1 space-y-10">
              <h2 className="text-5xl md:text-7xl font-[800] text-[#2D1A4A] leading-[1.1]">
                Our materials <br />
                provided are <br />
                <span className="hand-drawn-circle">
                  <span className="text-[#5E3BEE] italic">enjoyable</span>
                  {/* Yellow Squiggle SVG */}
                  <svg className="squiggle-svg" viewBox="0 0 200 100" fill="none">
                    <path d="M10,50 C10,20 190,20 190,50 C190,80 10,80 15,55" stroke="#F59E0B" strokeWidth="3" strokeLinecap="round" strokeDasharray="5 5" />
                    <path d="M5,50 C5,15 195,15 195,50 C195,85 5,85 10,55" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <br /> for everyone
              </h2>
              
              <p className="text-xl text-[#514B5C] max-w-lg leading-relaxed font-light">
                Don't worry! Your children will have a fun time while learning 
                with materials designed specifically for Kenyan Sign Language users.
              </p>

              <button 
                onClick={() => navigate("/learn")}
                className="group flex items-center gap-4 px-10 py-5 bg-white border-2 border-[#2D1A4A] rounded-full font-bold text-[#2D1A4A] hover:bg-[#2D1A4A] hover:text-white transition-all shadow-xl"
              >
                Learn More
                <div className="w-10 h-10 bg-[#5E3BEE] rounded-full flex items-center justify-center text-white group-hover:bg-white group-hover:text-[#5E3BEE] transition-all transform group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </div>
              </button>
            </div>

            {/* Right Column: Floating Pill-shaped Imagery */}
            <div className="flex-1 relative w-full h-[550px] max-w-2xl">
              
              {/* Lavender Pill */}
              <div className="absolute top-0 right-0 w-[85%] h-36 bg-[#E9E4FF] rounded-full flex items-center px-10 shadow-sm border border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1617056239820-8ce90ba48193?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                  alt="Student 1" 
                  className="w-28 h-28 rounded-full object-cover border-8 border-white -mt-16 shadow-lg" 
                />
                <div className="ml-auto flex items-center gap-4">
                   <Star size={48} className="text-[#F59E0B] fill-[#F59E0B] rotate-12 opacity-80" />
                   <div className="w-12 h-12 bg-white/40 rounded-full blur-xl absolute -right-4"></div>
                </div>
              </div>

              {/* Deep Purple Pill (Central Focal Point) */}
              <div className="absolute top-48 left-0 w-full h-40 bg-[#5E3BEE] rounded-full flex items-center justify-between px-16 shadow-2xl overflow-hidden group/pill">
                 <div className="relative">
                    <HandMetal size={40} className="text-white/20 -rotate-12 group-hover/pill:rotate-0 transition-transform duration-700" />
                 </div>
                 <img 
                   src="https://images.unsplash.com/photo-1632932693914-89b90ae3d16d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fGFmcmljYW4lMjBjaGlsZHJlbnxlbnwwfHwwfHx8MA%3D%3D" 
                   alt="Student 2" 
                   className="w-36 h-36 rounded-full object-cover border-8 border-white absolute -right-6 -top-6 group-hover/pill:scale-110 transition-transform" 
                 />
                 <div className="absolute left-1/2 bottom-2 text-white/10 italic font-bold">KSL Ready</div>
              </div>

              {/* Yellow Pill */}
              <div className="absolute bottom-4 right-0 w-[80%] h-36 bg-[#FFD89C] rounded-full shadow-sm flex items-center px-12 border border-white/50">
                <img 
                  src="https://images.unsplash.com/photo-1473649085228-583485e6e4d7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8YWZyaWNhbiUyMGNoaWxkcmVufGVufDB8fDB8fHww" 
                  alt="Student 3" 
                  className="w-28 h-28 rounded-full object-cover border-8 border-white -mb-20 shadow-lg" 
                />
                <div className="ml-auto grid grid-cols-4 gap-2 opacity-40">
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#2D1A4A]"></div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* --- 3. FEATURE GRID --- */}
        <section className="max-w-7xl mx-auto px-6 mt-48">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* Card 1: Sign Lab */}
            <div className="bg-[#E9E4FF] p-12 rounded-[4rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="absolute -top-10 -right-10 text-[#5E3BEE]/10 group-hover:rotate-90 transition-transform duration-1000">
                <svg width="200" height="200" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40" stroke="currentColor" fill="none" strokeWidth="2" strokeDasharray="4 4" /></svg>
              </div>
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-sm rotate-[-6deg] group-hover:rotate-0 transition-transform">
                <span className="text-4xl">🤟</span>
              </div>
              <h3 className="text-3xl font-[800] text-[#2D1A4A] mb-4">Sign Lab</h3>
              <p className="text-[#514B5C] text-lg leading-relaxed">Interactive AI detection for signing practice.</p>
            </div>

            {/* Card 2: Translate (Dark) */}
            <div className="bg-[#2D1A4A] p-12 rounded-[4rem] text-white relative overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="w-16 h-16 bg-[#5E3BEE] rounded-3xl flex items-center justify-center mb-10 shadow-lg group-hover:scale-110 transition-transform">
                <Brain className="text-white" size={32} />
              </div>
              <h3 className="text-3xl font-[800] mb-4">Translate</h3>
              <p className="text-white/70 text-lg leading-relaxed">Instant text-to-visual sign interpretation.</p>
              <div className="mt-8 opacity-30 group-hover:opacity-100 transition-all">
                 <svg width="60" height="30" viewBox="0 0 60 30" fill="none"><path d="M5 25C20 25 45 20 55 5M55 5L45 5M55 5V15" stroke="white" strokeWidth="4" strokeLinecap="round"/></svg>
              </div>
            </div>

            {/* Card 3: Games */}
            <div className="bg-[#FFD89C] p-12 rounded-[4rem] relative overflow-hidden group hover:shadow-2xl transition-all duration-500 cursor-pointer">
              <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-10 shadow-sm group-hover:rotate-12 transition-transform">
                <Gamepad2 className="text-[#2D1A4A]" size={32} />
              </div>
              <h3 className="text-3xl font-[800] text-[#2D1A4A] mb-4">Activities</h3>
              <p className="text-[#514B5C] text-lg leading-relaxed">Playful tools for building your vocabulary.</p>
              <div className="flex gap-2 mt-8">
                 <div className="w-4 h-4 border-2 border-[#2D1A4A] rounded-sm"></div>
                 <div className="w-4 h-4 border-2 border-[#2D1A4A] rotate-45 rounded-sm"></div>
              </div>
            </div>

          </div>
        </section>

      </main>
    </PageWrapper>
  );
};

export default Home;
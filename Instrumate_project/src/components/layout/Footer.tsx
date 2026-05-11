import React from "react";
import { Github, Twitter, Linkedin, Mail, ShieldAlert, ShieldCheck, Heart } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-[#FAF9F6] pt-20 pb-10 font-['Outfit',sans-serif] overflow-hidden">
      {/* Subtle background decorative blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E9E4FF] rounded-full blur-3xl opacity-30 -translate-y-1/2 translate-x-1/4"></div>
      
      <div className="max-w-7xl mx-auto px-6">
        {/* Main content grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start relative z-10">
          
          {/* Section 1: Brand/Mission */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-10 h-10 bg-[#5E3BEE] rounded-xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-indigo-100">
                 I
               </div>
               <span className="text-2xl font-[800] text-[#2D1A4A] tracking-tighter">Instrumate</span>
            </div>
            <p className="text-[#514B5C]/70 text-base leading-relaxed text-center md:text-left max-w-xs font-light">
              Designed for Kenya. Empowering the deaf and mute community through 
              <span className="text-[#2D1A4A] font-semibold"> AI-powered </span> 
              inclusive education.
            </p>
          </div>

          {/* Section 2: Links in a "Playful Card" */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#EBE9E0] flex flex-col items-center">
            <h4 className="font-[800] text-[#2D1A4A] text-lg mb-6 uppercase tracking-widest text-xs">Explore</h4>
            <ul className="space-y-4 text-center">
              <li>
                <a href="#" className="flex items-center gap-3 text-[#514B5C] hover:text-[#5E3BEE] transition-colors font-medium">
                  <Mail size={18} className="text-[#FFD89C] fill-[#FFD89C]" /> Contact Team
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-[#514B5C] hover:text-[#5E3BEE] transition-colors font-medium">
                  <ShieldAlert size={18} className="text-[#E9E4FF] fill-[#E9E4FF]" /> Report Bug
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-3 text-[#514B5C] hover:text-[#5E3BEE] transition-colors font-medium">
                  <ShieldCheck size={18} className="text-[#D1FAE5] fill-[#D1FAE5]" /> Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Section 3: Social/Community */}
          <div className="flex flex-col items-center md:items-end space-y-6">
            <h4 className="font-[800] text-[#2D1A4A] text-lg uppercase tracking-widest text-xs">Stay Connected</h4>
            <div className="flex gap-4">
              {[
                { icon: <Github size={24} />, label: "GitHub" },
                { icon: <Twitter size={24} />, label: "Twitter" },
                { icon: <Linkedin size={24} />, label: "LinkedIn" }
              ].map((social, i) => (
                <a 
                  key={i} 
                  href="#" 
                  aria-label={social.label}
                  className="w-12 h-12 bg-white border border-[#EBE9E0] rounded-2xl flex items-center justify-center text-[#2D1A4A] hover:bg-[#5E3BEE] hover:text-white hover:-translate-y-1 transition-all shadow-sm"
                >
                  {social.icon}
                </a>
              ))}
            </div>
            {/* National Pride Accent */}
            <div className="flex items-center gap-2 bg-[#FFF4E0] px-4 py-2 rounded-full border border-[#FFD89C]/30">
               <span className="text-xs font-bold text-[#F59E0B]">MADE IN KENYA 🇰🇪</span>
            </div>
          </div>
        </div>

        {/* Horizontal Rule with Squiggle feel */}
        <div className="mt-20 pt-10 border-t border-[#EBE9E0] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[#514B5C]/60">
          <p>© 2026 Instrumate. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={14} className="fill-[#F43F5E] text-[#F43F5E]" /> for inclusive education.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
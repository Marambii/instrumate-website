import { Linkedin, Github, Mail, ArrowUpRight, Shield, Layers, Code, Layout, Database, Sparkles, MessageSquare } from "lucide-react";

const TeamPage = () => {
  // 💡 REMOVED: const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const teamMembers = [
    {
      name: "Dr Lawrence Nderu",
      role: "Project Inspector",
      icon: <Shield className="w-5 h-5 text-[#F59E0B]" />,
      bio: "Ensuring quality and compliance across all development phases with meticulous attention to detail.",
      linkedin: "https://linkedin.com/in/dr-lawrence-nderu",
      github: "https://github.com/magvtv/39_Lawrence",
      email: "lawrence@instrumate-africa.com",
      accent: "from-[#FFD89C] to-[#F59E0B]"
    },
    {
      name: "Francis Mung'ang'u",
      role: "Team Lead & API Developer",
      icon: <Layers className="w-5 h-5 text-[#5E3BEE]" />,
      bio: "Leading the development team while architecting robust API solutions for seamless integration.",
      linkedin: "https://linkedin.com/in/francis-mung-ang-u-27b1272a6",
      github: "https://github.com/FRANCISMUNGANGU",
      email: "francis@instrumate-africa.com",
      accent: "from-[#E9E4FF] to-[#5E3BEE]"
    },
    {
      name: "John Njuki",
      role: "Backend Developer",
      icon: <Database className="w-5 h-5 text-[#2D1A4A]" />,
      bio: "Backend development, heavy database optimization, and scalable microservice management.",
      linkedin: "https://linkedin.com/in/jay-njuqy-26b6b0295",
      github: "https://github.com/bitflaw",
      email: "john@instrumate-africa.com",
      accent: "from-[#2D1A4A] to-[#5E3BEE]"
    },
    {
      name: "Baruch Marambi",
      role: "Frontend Developer",
      icon: <Code className="w-5 h-5 text-[#5E3BEE]" />,
      bio: "Creating intuitive user interfaces and responsive web applications for exceptional user experience.",
      linkedin: "https://linkedin.com/in/baruch-marambi",
      github: "https://github.com/Marambii",
      email: "baruch@instrumate-africa.com",
      accent: "from-[#E9E4FF] to-[#5E3BEE]"
    },
    {
      name: "Mary Muragu",
      role: "Data Scientist & 3D Animator",
      icon: <Sparkles className="w-5 h-5 text-[#F59E0B]" />,
      bio: "Translating complex datasets into actionable insights and designing immersive 3D instructional assets.",
      linkedin: "https://linkedin.com/in/mary-muragu-016482309",
      github: "https://github.com/Mmuragu",
      email: "mary@instrumate-africa.com",
      accent: "from-[#FFD89C] to-[#F59E0B]"
    },
    {
      name: "Nevean Adhiambo",
      role: "Frontend Developer",
      icon: <Layout className="w-5 h-5 text-[#2D1A4A]" />,
      bio: "Creating intuitive and completely accessible user experiences optimized for multi-sensory learners.",
      linkedin: "https://linkedin.com/in/nevean-adhiambo-37131b288",
      github: "https://github.com/neveanadhis",
      email: "nevean@instrumate-africa.com",
      accent: "from-[#2D1A4A] to-[#1A0D30]"
    },
    {
      name: "Jeff Kariuki",
      role: "Backend Developer",
      icon: <Database className="w-5 h-5 text-[#5E3BEE]" />,
      bio: "Architecting high-performance server logic and maintaining resilient database systems.",
      linkedin: "https://linkedin.com/in/jeff-kariuki",
      github: "https://github.com/jeff-kariuki",
      email: "jeff@instrumate-africa.com",
      accent: "from-[#E9E4FF] to-[#5E3BEE]"
    },
    {
      name: "Xyneville Wakonelo",
      role: "Backend Developer",
      icon: <Database className="w-5 h-5 text-[#2D1A4A]" />,
      bio: "Specializing in cloud infrastructure integration, data parsing pipelines, and API security.",
      linkedin: "https://linkedin.com/in/xyneville-wakonelo",
      github: "https://github.com/xyneville",
      email: "xyneville@instrumate-africa.com",
      accent: "from-[#2D1A4A] to-[#5E3BEE]"
    },
    {
      name: "Andrew Osilu",
      role: "Communications & Stakeholder Engagement Lead",
      icon: <MessageSquare className="w-5 h-5 text-[#F59E0B]" />,
      bio: "Bridging the gap between engineering targets and external community stakeholders for collaborative impact.",
      linkedin: "https://linkedin.com/in/andrew-osilu",
      github: "https://github.com/andrew-osilu",
      email: "andrew@instrumate-africa.com",
      accent: "from-[#FFD89C] to-[#F59E0B]"
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAF9F6] font-['Outfit',sans-serif] py-24 relative overflow-hidden">
      
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-[#5E3BEE]/10 to-transparent blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-radial from-[#F59E0B]/5 to-transparent blur-3xl" />
      </div>

      <section className="max-w-7xl mx-auto px-6 relative z-10">
        
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-24 border-b border-[#2D1A4A]/10 pb-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#EBE9E0] shadow-xs mb-6">
              <span className="w-2 h-2 rounded-full bg-[#5E3BEE] animate-ping" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#514B5C]">Behind the tech</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-[800] text-[#2D1A4A] tracking-tighter leading-[0.95]">
              The minds reshaping <br />
              <span className="text-[#5E3BEE]">inclusive learning.</span>
            </h1>
          </div>
          <div className="max-w-sm">
            <p className="text-lg text-[#514B5C]/80 font-light leading-relaxed">
              We are a distributed assembly of engineering specialists, UI purists, and accessibility advocates crafting the next generation of KSL technology.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => {
            // 💡 REMOVED: The unused 'isHovered' assignment statement
            return (
              <div
                key={index}
                className="bg-white rounded-[2.5rem] border border-[#EBE9E0] p-8 relative flex flex-col justify-between min-h-[380px] transition-all duration-500 overflow-hidden group shadow-[0_10px_30px_rgba(45,26,74,0.02)] hover:shadow-[0_30px_60px_rgba(45,26,74,0.06)] hover:-translate-y-2"
                // 💡 REMOVED: Unused event listeners tracking index state
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-[#FAF9F6] border border-[#EBE9E0] flex items-center justify-center group-hover:bg-[#2D1A4A] group-hover:text-white transition-all duration-300">
                    {member.icon}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-[#5E3BEE]" />
                  </div>
                </div>

                <div className="my-8 space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-[800] text-[#2D1A4A] tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                      {member.name}
                    </h3>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#5E3BEE]">
                      {member.role}
                    </p>
                  </div>
                  <p className="text-[#514B5C]/80 text-[15px] font-light leading-relaxed pr-2">
                    {member.bio}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-[#FAF9F6]">
                  <div className="flex items-center gap-1">
                    
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[#514B5C] hover:bg-[#E9E4FF] hover:text-[#5E3BEE] transition-all duration-300"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>

                    <a 
                      href={member.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[#514B5C] hover:bg-[#E9E4FF] hover:text-[#5E3BEE] transition-all duration-300"
                    >
                      <Github className="h-4 w-4" />
                    </a>

                    <a 
                      href={`mailto:${member.email}`}
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-[#514B5C] hover:bg-[#E9E4FF] hover:text-[#5E3BEE] transition-all duration-300"
                    >
                      <Mail className="h-4 w-4" />
                    </a>

                  </div>

                  <div className="relative flex items-center justify-center w-8 h-8 rounded-full overflow-hidden select-none">
                    <div className={`absolute inset-0 bg-gradient-to-tr ${member.accent} opacity-20 group-hover:opacity-100 transition-all duration-500`} />
                    <span className="text-[10px] font-bold text-[#2D1A4A] group-hover:text-white transition-colors z-10">
                      {member.name.replace('Dr ', '').split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

      </section>
    </main>
  );
};

export default TeamPage;
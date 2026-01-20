"use client";

import { Scan, Database, ShieldCheck, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { Button } from "@/components/ui/button";
import { TextScramble } from "@/components/ui/text-scramble";

const steps = [
    {
        id: "01",
        title: "BAĞLAN & TARA",
        desc: "Read-only API izni ile sisteminizi güvenle bağlayın. Ajan gerektirmeyen tarama teknolojisi.",
        icon: Database,
        position: "lg:col-start-1 lg:row-start-1" 
    },
    {
        id: "02",
        title: "OTOMATİK ANALİZ",
        desc: "ISO 27001 ve SOC 2 kontrolleri saniyeler içinde tamamlanır. Risk haritanız anında hazırdır.",
        icon: Scan,
        position: "lg:col-start-2 lg:row-start-2" // Strict placement in Row 2
    },
    {
        id: "03",
        title: "KANIT & RAPOR",
        desc: "Denetim kanıtları otomatik toplanır, zaman damgasıyla imzalanır ve raporlanır.",
        icon: ShieldCheck,
        position: "lg:col-start-3 lg:row-start-1"
    }
];

// Glitchy Square Particles (as seen in Lambda.ai image)
function GlitchParticles() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            {[...Array(12)].map((_, i) => {
                const colors = ["bg-cyan-400", "bg-neutral-400", "bg-yellow-400", "bg-white"];
                const color = colors[Math.floor(Math.random() * colors.length)];
                
                return (
                    <div 
                        key={i}
                        className={`absolute w-1 h-1 ${color} opacity-60 animate-pulse`}
                        style={{
                            top: Math.random() * 100 + "%",
                            left: Math.random() * 100 + "%",
                            animationDuration: Math.random() * 2 + 1 + "s",
                        }}
                    />
                )
            })}
             {/* Some larger faint squares for depth */}
             {[...Array(5)].map((_, i) => (
                <div 
                    key={`l-${i}`}
                    className="absolute w-2 h-2 border border-neutral-700 opacity-20"
                    style={{
                        top: Math.random() * 100 + "%",
                        left: Math.random() * 100 + "%",
                        transform: `rotate(${Math.random() * 90}deg)`
                    }}
                />
            ))}
        </div>
    )
}

// TextScramble removed (moved to shared component)

export function SolutionSteps() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
// ... existing useEffect ...

  return (
    <section ref={sectionRef} className="bg-[#0b0b0b] text-[#e7e6d9] py-32 overflow-hidden relative border-t border-[#252525]">
      
      <GlitchParticles />
      
      <div ref={containerRef} className="container mx-auto px-6 relative z-10">
        
        {/* Lambda-Style Header - Grid Aligned */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 mb-20 relative">
             
             {/* Left: Title */}
             <div className="lg:col-span-5 pb-8 lg:pb-0 relative z-10">
                <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-4 block">
                    NASIL ÇALIŞIR?
                </span>
                <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-[#e7e6d9] leading-[0.9]">
                    03 ADIMDA <br />
                    <TextScramble className="text-[#e7e6d9]">OTOMASYON.</TextScramble>
                </h2>
             </div>

             {/* Right: Description with L-Border Connection */}
             {/* The container has a Left and Top border to create the connector shape */}
             <div className="lg:col-span-7 flex flex-col justify-end relative">
                 <div className="h-full border-l border-[#252525] ml-8 lg:ml-0 pl-8 lg:pl-12 pb-2 flex flex-col justify-end relative">
                    {/* Top Line extending from Title (virtual) to Desc */}
                    <div className="absolute top-[30%] lg:top-auto lg:bottom-full left-0 w-8 lg:w-full h-px bg-[#252525] -scale-x-100 lg:scale-x-100 origin-left lg:origin-bottom-left" /> 
                    
                    {/* Corner Dot (Technical Accent) */}
                    <div className="absolute top-[30%] lg:top-[-4px] left-[-4px] w-2 h-2 bg-[#e7e6d9] rounded-full z-20" />

                    <p className="text-[#b9b8ae] text-lg leading-relaxed max-w-xl font-mono pt-8 lg:pt-0">
                        Tek bir GPU'dan binlercesine — hızla ölçeklenen performans. Kivvat ile uyumluluk süreçleriniz de aynı hızda ve güvenilirlikte çalışır.
                    </p>
                 </div>
             </div>
        </div>

        {/* Staggered Grid - Tech Table Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 pl-px pt-px gap-0">
            
            {steps.map((step, idx) => (
                <div 
                    key={idx} 
                    className={`step-card relative p-0 flex flex-col min-h-[280px] border border-[#252525] bg-[#0b0b0b] group transition-all duration-300 -ml-px -mt-px ${step.position} z-10 hover:z-20 hover:bg-[#111]`}
                >
                    {/* Hover Corner Accents */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Card Header (Table Cell Style) */}
                    <div className="flex justify-between items-center p-6 border-b border-[#252525] bg-[#0e0e0e]/50">
                         <div className="flex items-baseline gap-2">
                             <span className="font-mono text-xs text-primary">
                                 ADIM
                             </span>
                             <span className="font-mono text-xl font-bold text-[#e7e6d9]">
                                {step.id}
                             </span>
                         </div>
                         <step.icon className="h-5 w-5 text-[#444] group-hover:text-primary transition-colors duration-300" />
                    </div>

                    {/* Card Content (Table Body Style) */}
                    <div className="p-6 flex-grow flex flex-col justify-center">
                        <h3 className="text-lg font-bold text-[#e7e6d9] mb-3 tracking-tight font-mono group-hover:text-primary transition-colors">
                            {step.title}
                        </h3>
                        <p className="text-sm text-[#888] leading-relaxed font-mono group-hover:text-[#b9b8ae] transition-colors">
                            {step.desc}
                        </p>
                    </div>

                    {/* Bottom Progress Line */}
                    <div className="absolute bottom-0 left-0 h-[2px] bg-primary w-0 group-hover:w-full transition-all duration-500 ease-out" />
                </div>
            ))}

        </div>

      </div>
    </section>
  );
}

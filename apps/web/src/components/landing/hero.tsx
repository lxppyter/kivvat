"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronRight, Terminal } from "lucide-react";
import Link from "next/link";
import { TextHighlight } from "@/components/ui/text-highlight";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const badgeRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        const tl = gsap.timeline();

        // 1. Initial Entrance (Slide Up)
        tl.from(badgeRef.current, {
            y: -20,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });

        tl.from(".hero-text-line", {
            y: 100,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: "power4.out"
        }, "-=0.4");

        tl.from([contentRef.current], {
             y: 30, 
             opacity: 0, 
             duration: 0.8, 
             ease: "power2.out"
        }, "-=0.8");

        // 2. Scroll Parallax (Split Directions)
        // Top line moves Left, Bottom line moves Right
        gsap.to(".text-left-anim", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            x: -200, // Move Left harder
        });

        gsap.to(".text-right-anim", {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            x: 200, // Move Right harder
        });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-white px-6 pt-20">
      
      {/* Background Grid Lines (Restored) */}
      <div className="absolute inset-0 pointer-events-none">
         <div className="grid-line absolute top-1/4 left-0 w-full h-px bg-neutral-100 origin-left" />
         <div className="grid-line absolute top-2/4 left-0 w-full h-px bg-neutral-100 origin-left" />
         <div className="grid-line absolute top-3/4 left-0 w-full h-px bg-neutral-100 origin-left" />
         <div className="hidden lg:block grid-line absolute top-0 left-1/4 w-px h-full bg-neutral-100 origin-top" />
         <div className="hidden lg:block grid-line absolute top-0 left-2/4 w-px h-full bg-neutral-100 origin-top" />
         <div className="hidden lg:block grid-line absolute top-0 left-3/4 w-px h-full bg-neutral-100 origin-top" />
      </div>
      
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        
        {/* Status Badge */}
        <div ref={badgeRef} className="hero-anim inline-flex items-center gap-3 mb-8">
            <span className="h-2 w-2 bg-[#381D2A] rounded-full animate-pulse" />
            <span className="font-mono text-xs font-bold text-[#381D2A] tracking-widest uppercase">
                SİSTEM DURUMU: AKTİF
            </span>
        </div>

        {/* Main Headline (Scroll Parallax) */}
        <h1 ref={textRef} className="text-7xl lg:text-9xl font-bold text-neutral-900 leading-[0.9] mb-10 font-mono tracking-tight">
          <div className="hero-text-line text-left-anim block mb-2">
             UYUMLULUK
          </div>
          <div className="hero-text-line text-right-anim text-transparent bg-clip-text bg-gradient-to-r from-[#0D9488] via-[#2DD4BF] to-[#0D9488] animate-gradient-x tracking-widest">
            OTOMASYONU
          </div>
        </h1>



// ... existing code ...

        {/* Subtext */}
        <div ref={contentRef} className="max-w-3xl mx-auto">
            <p className="hero-anim text-xl lg:text-2xl text-neutral-600 font-light leading-relaxed mb-12">
              <TextHighlight delay={1} color="#381D2A">Otomatik güvenlik mühendisiniz.</TextHighlight> <br />
              <span className="font-mono text-sm text-primary uppercase tracking-wider">[ AWS / AZURE / GCP ]</span>
            </p>
            
            {/* CTA Buttons (Restored) */}
            <div className="hero-anim flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/register">
                <Button className="h-16 px-12 rounded-none bg-primary text-white font-mono text-sm hover:bg-primary/90 hover:-tranneutral-y-1 transition-transform border border-primary">
                   BAŞLA <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                  <Button variant="outline" className="h-16 px-12 rounded-none border border-neutral-200 text-neutral-900 font-mono text-sm hover:bg-neutral-50 hover:text-neutral-900 hover:border-neutral-900 transition-all">
                     DOKÜMANLAR
                  </Button>
              </Link>
            </div>
            
            {/* Bottom Technical Bar (Restored) */}
            <div className="hero-anim mt-24 border-y border-neutral-100 py-6 bg-white/80 backdrop-blur-sm">
                 <div className="flex flex-wrap justify-center gap-12 text-xs font-mono text-neutral-400 uppercase tracking-widest">
                     <div className="flex items-center gap-2">
                         <Terminal className="h-4 w-4 text-primary" />
                         <span>Ajanız Tarama</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <span className="font-bold text-neutral-900">0.05s</span>
                         <span>Gecikme</span>
                     </div>
                     <div className="flex items-center gap-2">
                         <span className="font-bold text-neutral-900">100%</span>
                         <span>Kapsama</span>
                     </div>
                 </div>
            </div>

        </div>

      </div>
    </section>
  );
}

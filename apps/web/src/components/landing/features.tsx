"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { TextScramble } from "@/components/ui/text-scramble";

const features = [
    {
        title: "KESİNTİSİZ RİSK İZLEME",
        desc: "Akıcı hikaye anlatımı. Kullanıcı deneyimini bozmadan, sayfayı aşağıya kaydırdıkça ortaya çıkan akıllı risk analizleri ve uyarı mekanizmaları."
    },
    {
        title: "OTOMATİK KANIT TOPLAMA",
        desc: "Manuel ekran görüntüsü almaya son. Sistem, denetimler için gereken tüm kanıtları anlık olarak loglar, zaman damgasıyla mühürler ve arşivler."
    },
    {
        title: "HAZIR POLİTİKA KÜTÜPHANESİ",
        desc: "Sıfırdan döküman yazmakla vakit kaybetmeyin. ISO 27001, SOC2 ve GDPR ile tam uyumlu, hukukçular tarafından onaylanmış hazır şablonları kullanın."
    },
    {
        title: "ZERO-DATA GİZLİLİK",
        desc: "Tam veri gizliliği. Müşteri verilerinize dokunmuyoruz. Sadece altyapı meta-verilerini ve konfigürasyonları analiz ediyoruz. Hassas verileriniz tamamen sizin kontrolünüzde."
    },
];

export function Features() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // Row Border & Layout Reveal
        gsap.from(".feature-row", {
            scrollTrigger: {
                trigger: listRef.current,
                start: "top 80%",
                once: true
            },
            opacity: 0,
            duration: 0.8,
            stagger: 0.2,
            ease: "power2.out"
        });

        // Title Reveal (Line Animation)
        gsap.from(".feature-row h3", {
            scrollTrigger: {
                trigger: listRef.current,
                start: "top 75%",
                once: true
            },
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1, 
            ease: "power3.out",
            delay: 0.2
        });

        // Description Words Reveal (Word Animation)
        // We select all words within the list
        gsap.from(".feature-desc-word", {
            scrollTrigger: {
                trigger: listRef.current,
                start: "top 75%", // Sync with title roughly
                once: true
            },
            y: 20,
            opacity: 0,
            duration: 0.5,
            stagger: 0.015, // Fast stagger for words
            ease: "power2.out",
            delay: 0.4 // Start slightly after title
        });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="bg-white min-h-screen py-32 border-t border-gray-200">

       <div className="container mx-auto px-6 mb-24">
         <div ref={headerRef}>
             <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-4 block">
                ÖZELLİKLER
             </span>
             <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-neutral-900 to-neutral-500 leading-tight pb-2 pt-1">
                TEKNİK ÜSTÜNLÜK.
             </h2>
         </div>
       </div>

       {/* Full Width List */}
       <div ref={listRef} className="w-full">
            
            {features.map((item, idx) => (
                <div key={idx} className="feature-row group w-full border-b border-gray-200 last:border-b-0 hover:bg-neutral-50 transition-colors duration-300">
                    <div className="container mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row items-baseline justify-between gap-12 lg:gap-0">
                        
                        {/* Left: Title */}
                        <div className="w-full lg:w-5/12">
                             <div className="flex items-baseline gap-6">
                                <span className="font-mono text-sm font-bold text-neutral-400">0{idx + 1}</span>
                                <h3 className="font-bold text-3xl lg:text-4xl text-neutral-900 tracking-tight group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                             </div>
                        </div>

                        {/* Right: Content (Words Split) */}
                        <div className="w-full lg:w-6/12">
                            <p className="text-neutral-600 text-lg lg:text-xl leading-relaxed font-medium flex flex-wrap gap-x-1.5">
                                {item.desc.split(" ").map((word, wIdx) => (
                                    <span key={wIdx} className="feature-desc-word inline-block">
                                        {word}
                                    </span>
                                ))}
                            </p>
                        </div>
                    </div>
                </div>
            ))}

       </div>

    </section>
  );
}

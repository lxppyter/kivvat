"use client";

import { AlertTriangle, Clock, TrendingDown, FileWarning, BadgeCent, ShieldAlert } from "lucide-react";
import { TextStrikethrough } from "@/components/ui/text-strikethrough";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function ProblemSection() {
  const sectionRef = useRef(null);
  const headerRef = useRef(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        // ...
    }, sectionRef);

    return () => ctx.revert();
  }, []); // Re-adding the hook properly to avoid losing context, referencing layout changes.

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from(headerRef.current, {
            scrollTrigger: {
                trigger: headerRef.current,
                start: "top 80%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });

        gsap.from(gridRef.current?.children || [], {
            scrollTrigger: {
                trigger: gridRef.current,
                start: "top 75%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power2.out"
        });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="bg-white border-b border-gray-200 pb-24 lg:pb-32">
      <div className="grid lg:grid-cols-12 min-h-[600px]">
        
        {/* Left: Headline */}
        <div className="lg:col-span-5 p-12 lg:p-24 border-b lg:border-b-0 lg:border-r border-gray-200 flex flex-col justify-center bg-white relative z-10">
          <span className="font-mono text-xs font-bold text-[#381D2A] tracking-widest mb-4 block">
             [ SYSTEM_STATUS: UNSECURED ]
          </span>

          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-neutral-900 leading-[0.9] mb-8">
            UYUMLULUK SÜREÇLERİNİ <span className="relative inline-block mx-2"><TextStrikethrough color="#381D2A" className="text-neutral-900">MANUEL</TextStrikethrough></span> <br/>
            <span className="text-[#381D2A] block mt-2">YÖNETMEYİN.</span>
          </h2>
          <p className="text-lg text-neutral-600 font-light leading-relaxed">
            Manuel süreçler, güvenlik açıkları ve kaçan fırsatlar. Geleneksel yöntemler modern bulut hızına yetişemiyor.
          </p>
        </div>

        {/* Right: Grid of Pain */}
        <div ref={gridRef} className="lg:col-span-7 grid sm:grid-cols-2">
          
          {/* Card 1: DANIŞMANLAR */}
          <div className="group p-12 border-b sm:border-r border-gray-200 bg-neutral-50 hover:bg-neutral-100 transition-colors relative flex flex-col justify-between">
                {/* Hover Badge */}
                <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex items-center gap-2 text-[#381D2A] border border-[#381D2A]/20 bg-neutral-50 px-2 py-1 rounded shadow-sm">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#381D2A] opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#381D2A]"></span>
                          </span>
                          <span className="text-[10px] font-bold font-mono uppercase">MALİYETLİ</span>
                      </div>
                </div>

                <div className="mb-6 text-neutral-300 group-hover:text-[#381D2A] transition-colors">
                    <AlertTriangle className="h-10 w-10" />
                </div>
                <div>
                    <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-[#381D2A] transition-colors">
                        PAHALI_DANIŞMANLAR
                    </h3>
                    <p className="text-neutral-600 leading-relaxed text-sm">
                        Tek bir belge için on binlerce dolar harcamaktan yorulmadınız mı? Bilgi içeride kalmalı, dışarıya akmamalı.
                    </p>
                </div>
          </div>

          {/* Card 2: EXCEL */}
          <div className="group p-12 border-b border-gray-200 bg-neutral-50/50 hover:bg-white transition-colors relative flex flex-col justify-between">
             {/* Hover Badge */}
             <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-[#381D2A] border border-[#381D2A]/20 bg-neutral-50 px-2 py-1 rounded shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#381D2A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#381D2A]"></span>
                      </span>
                      <span className="text-[10px] font-bold font-mono uppercase">KARMAŞIK</span>
                  </div>
            </div>

            <div className="mb-6 text-neutral-300 group-hover:text-[#381D2A] transition-colors">
                 <FileWarning className="h-10 w-10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <h3 className="font-mono font-bold text-lg text-neutral-900 mb-3 group-hover:text-[#381D2A] transition-colors">BITMEYEN_EXCEL_DOSYALARI</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Kimin neyi, ne zaman kontrol ettiğini takip etmek imkansız. Versiyon karmaşası güvenlik riski yaratır.
                </p>
            </div>
          </div>

          {/* Card 3: FIRSATLAR */}
          <div className="group p-12 border-b sm:border-b-0 sm:border-r border-gray-200 bg-neutral-50/50 hover:bg-white transition-colors relative flex flex-col justify-between">
             {/* Hover Badge */}
             <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-[#381D2A] border border-[#381D2A]/20 bg-neutral-50 px-2 py-1 rounded shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#381D2A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#381D2A]"></span>
                      </span>
                      <span className="text-[10px] font-bold font-mono uppercase">KAYIP</span>
                  </div>
            </div>

            <div className="mb-6 text-neutral-300 group-hover:text-[#381D2A] transition-colors">
                <TrendingDown className="h-10 w-10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <h3 className="font-mono font-bold text-lg text-neutral-900 mb-3 group-hover:text-[#381D2A] transition-colors">KAÇAN_BÜYÜK_FIRSATLAR</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Müşteriniz SOC2 belgesi istediği için kaybettiğiniz satışları düşünün. Güven satışı hızlandırır, yavaşlatmaz.
                </p>
            </div>
          </div>

          {/* Card 4: İNSAN */}
          <div className="group p-12 border-b sm:border-b-0 border-gray-200 bg-neutral-50/50 hover:bg-white transition-colors relative flex flex-col justify-between">
            {/* Hover Badge */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex items-center gap-2 text-[#381D2A] border border-[#381D2A]/20 bg-neutral-50 px-2 py-1 rounded shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#381D2A] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#381D2A]"></span>
                      </span>
                      <span className="text-[10px] font-bold font-mono uppercase">RİSKLİ</span>
                  </div>
            </div>

            <div className="mb-6 text-neutral-300 group-hover:text-[#381D2A] transition-colors">
                 <Clock className="h-10 w-10 group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <h3 className="font-mono font-bold text-lg text-neutral-900 mb-3 group-hover:text-[#381D2A] transition-colors">İNSAN_HATASI</h3>
                <p className="text-neutral-500 text-sm leading-relaxed">
                  Manuel kontrollerde gözden kaçan tek bir açık, milyonluk cezalara veya veri ihlallerine neden olabilir.
                </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

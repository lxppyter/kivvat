"use client";

import { Check, X } from "lucide-react";
import { TextHighlight } from "@/components/ui/text-highlight";
import { useEffect, useRef } from "react";
import gsap from "gsap";

const MorphingShape = () => {
    const pathRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Drastic Morph: Shield <-> Cyber Shard
            // Both paths should ideally have similar number of points for smoothness, 
            // but for "Glitch" effect, mismatch is acceptable (visual artifacting looks "techy").
            
            // Path 1: Smooth Shield (Security) - Polygonal approx for smooth morph
            // M12 22 (Bottom) -> L20 13 (Right Curve) -> L20 5 (Top Right) -> L12 2 (Top Peak) -> L4 5 (Top Left) -> L4 13 (Left Curve)
            const shield = "M12 22 L20 13 L20 5 L12 2 L4 5 L4 13 Z"; 
            
            // Path 2: Lightning Bolt (Automation/Action)
            // Reordered to start from bottom to match Shield's start point
            const lightning = "M11 22 L21 10 L12 10 L13 2 L3 14 L12 14 Z";

            gsap.to(pathRef.current, {
                duration: 1.5,
                attr: { d: lightning }, 
                repeat: -1,
                yoyo: true,
                ease: "elastic.inOut(1, 0.75)", // Bouncy elastic effect
            });
            
            // Pulse Opacity
            gsap.to(pathRef.current, {
                opacity: 0.5,
                duration: 0.5,
                repeat: -1,
                yoyo: true,
                ease: "power1.inOut"
            });

        }, pathRef);
        return () => ctx.revert();
    }, []);

    return (
        <svg viewBox="0 0 24 24" className="w-8 h-8 text-primary fill-primary" style={{ overflow: 'visible' }}>
            <path ref={pathRef} d="M12 22 L20 13 L20 5 L12 2 L4 5 L4 13 Z" stroke="none" />
        </svg>
    );
};

export function ComparisonTable() {
  return (
    <section className="bg-[#0b0b0b] border-t border-[#252525] min-h-screen flex flex-col justify-center py-32 text-[#e7e6d9]">
      <div className="container mx-auto px-6">
        
        {/* Header - Matching SolutionSteps Typography */}
        <div className="mb-24">
          <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-4 block">
            KARŞILAŞTIR
          </span>
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter text-[#e7e6d9] leading-tight">
            NEDEN <br />
            <TextHighlight className="text-[#e7e6d9]" color="#e7e6d9">
                KIVVAT OTOMASYONU?
            </TextHighlight>
          </h2>
        </div>

        <div className="overflow-x-auto border border-[#252525] shadow-2xl bg-[#0b0b0b]">
          <table className="w-full text-left border-collapse bg-[#0b0b0b]">
            <thead>
              <tr className="bg-[#111] border-b border-[#252525]">
                <th className="p-8 font-mono text-xs lg:text-sm font-bold text-[#888] uppercase tracking-widest border-r border-[#252525] w-1/3">METRİK</th>
                <th className="p-8 font-mono text-xs lg:text-sm font-bold text-[#888] uppercase tracking-widest border-r border-[#252525] w-1/3">
                    MANUEL SÜREÇ / DANIŞMAN
                </th>
                <th className="relative p-8 font-mono text-xs lg:text-sm font-bold text-primary uppercase tracking-widest w-1/3">
                    KIVVAT OTOMASYONU
                    <div className="absolute top-4 right-4">
                        <MorphingShape />
                    </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252525] font-mono text-base lg:text-lg">
              
              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-8 font-bold text-[#e7e6d9] border-r border-[#252525]">Hazırlık Süresi</td>
                <td className="p-8 text-[#888] border-r border-[#252525] text-[#444] line-through decoration-[#999] decoration-2">6-12 Ay</td>
                <td className="p-8 text-primary font-bold">Dakikalar İçinde</td>
              </tr>

              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-8 font-bold text-[#e7e6d9] border-r border-[#252525]">Maliyet</td>
                <td className="p-8 text-[#888] border-r border-[#252525] text-[#444] line-through decoration-[#999] decoration-2">Yüksek Danışmanlık Ücretleri</td>
                <td className="p-8 text-primary font-bold">Sabit ve Düşük Abonelik</td>
              </tr>

              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-8 font-bold text-[#e7e6d9] border-r border-[#252525]">Denetim Sıklığı</td>
                <td className="p-8 text-[#888] border-r border-[#252525] text-[#444] line-through decoration-[#999] decoration-2">Yılda Bir Kez</td>
                <td className="p-8 text-primary font-bold">Saniyede Bir (Sürekli)</td>
              </tr>

              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-8 font-bold text-[#e7e6d9] border-r border-[#252525]">Hata Payı</td>
                <td className="p-8 text-[#888] border-r border-[#252525] text-[#444] line-through decoration-[#999] decoration-2">İnsan Hatasına Açık</td>
                <td className="p-8 text-primary font-bold">%100 Kod Tabanlı Doğruluk</td>
              </tr>

              <tr className="hover:bg-[#111]/50 transition-colors">
                <td className="p-8 font-bold text-[#e7e6d9] border-r border-[#252525]">Kanıt Toplama</td>
                <td className="p-8 text-[#888] border-r border-[#252525] text-[#444] line-through decoration-[#999] decoration-2">Manuel Ekran Görüntüleri</td>
                <td className="p-8 text-primary font-bold">Otomatik API Loglama</td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

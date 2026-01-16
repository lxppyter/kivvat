"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Check, ArrowRight, Zap, ShieldCheck, PlayCircle, Globe, LayoutTemplate, Lock, FileText, Server } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Pricing() {
  return (
    <section id="pricing" className="bg-white border-b border-gray-200 min-h-screen flex flex-col justify-center py-24">
      <div className="container mx-auto px-6">
        <div className="mb-20">
           <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-4 block">
            INVESTMENT
          </span>
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tighter bg-gradient-to-b from-neutral-900 to-neutral-500 text-transparent bg-clip-text leading-[0.9] mb-6">
            FİYATLANDIRMA.
          </h2>
          <p className="text-xl text-neutral-500 font-light max-w-2xl leading-relaxed">
            Şeffaf, sürpriz yok. İşletmenizle büyüyen planlar.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start mb-16">
            
            {/* PLAN 1: COMPLIANCE CORE */}
            <div className="bg-white border border-gray-200 p-8 h-full flex flex-col transition-all hover:border-neutral-300 hover:shadow-lg">
                <div className="mb-8">
                    <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">GİRİŞ SEVİYESİ</span>
                    <h3 className="text-2xl font-bold mt-2 font-mono tracking-tight">COMPLIANCE CORE</h3>
                    <p className="text-xs text-neutral-500 mt-2">Küçük ölçekli ajanslar ve start-uplar için.</p>
                </div>
                <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold font-mono text-neutral-900">$199</span>
                    <span className="text-neutral-500 ml-2">/ay</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                    <li className="flex text-sm text-neutral-700">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Tek Standart (KVKK veya GDPR)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        1 AWS/Azure Hesabı Taraması
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Hazır Politika Kütüphanesi (20+)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Varlık Envanteri (Asset Mgmt)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Aylık PDF Durum Raporu
                    </li>
                </div>
                <Button variant="outline" className="w-full rounded-none h-12 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors font-mono uppercase text-xs tracking-wider">
                    SEÇ & BAŞLA
                </Button>
            </div>

            {/* PLAN 2: TRUST ARCHITECT (Popular) */}
            <div className="relative bg-white border-2 border-primary p-8 h-full flex flex-col shadow-2xl shadow-primary/5 z-10 transition-all hover:shadow-primary/20">
                <div className="absolute top-0 left-1/2 -tranneutral-x-1/2 -tranneutral-y-1/2 bg-primary text-white px-4 py-1 font-mono text-xs font-bold uppercase tracking-widest">
                    EN ÇOK TERCİH EDİLEN
                </div>
                <div className="mb-8">
                    <span className="font-mono text-xs font-bold text-primary uppercase tracking-widest">ORTA ÖLÇEK</span>
                    <h3 className="text-2xl font-bold mt-2 font-mono tracking-tight text-primary">TRUST ARCHITECT</h3>
                    <p className="text-xs text-neutral-500 mt-2">Yurt dışına iş yapan SaaS şirketleri için.</p>
                </div>
                <div className="flex items-baseline mb-8">
                    <span className="text-5xl font-bold font-mono text-neutral-900">$499</span>
                    <span className="text-neutral-500 ml-2">/ay</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                    <li className="flex text-sm text-neutral-900 font-bold">
                        <Globe className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Hibrit Standart (3 Adete Kadar)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Zap className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Sürekli Denetim (7/24 İhlal Uyarısı)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <PlayCircle className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Personel Farkındalık Modülü
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <ShieldCheck className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Zafiyet Tarama Entegrasyonu
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Check className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Slack/Teams Bildirimleri
                    </li>
                     <li className="flex text-sm text-neutral-400 pl-7">
                        + Tüm Core Özellikleri
                    </li>
                </div>
                <Button className="w-full rounded-none h-12 bg-primary hover:bg-primary/90 hover:tranneutral-y-0 transform-none text-white transition-colors font-mono uppercase text-xs tracking-wider">
                    HEMEN BAŞLA
                </Button>
            </div>

            {/* PLAN 3: TOTAL AUTHORITY */}
            <div className="bg-white border border-gray-200 p-8 h-full flex flex-col transition-all hover:border-neutral-300 hover:shadow-lg">
                <div className="mb-8">
                    <span className="font-mono text-xs font-bold text-neutral-400 uppercase tracking-widest">KURUMSAL</span>
                    <h3 className="text-2xl font-bold mt-2 font-mono tracking-tight text-neutral-900">TOTAL AUTHORITY</h3>
                    <p className="text-xs text-neutral-500 mt-2">Büyük şirketler ve holdingler için.</p>
                </div>
                <div className="flex items-baseline mb-8">
                    <span className="text-4xl font-bold font-mono text-neutral-900">$1,199</span>
                    <span className="text-neutral-500 ml-2">/ay</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                    <li className="flex text-sm text-neutral-700">
                        <Globe className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Sınırsız Standart & Bulut Hesabı
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <Lock className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Rol Tabanlı Erişim (RBAC)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                        <FileText className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        Özel Denetçi Portalı (Read-Only)
                    </li>
                     <li className="flex text-sm text-neutral-700">
                        <LayoutTemplate className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        White-Labeling (Logo Ekleme)
                    </li>
                    <li className="flex text-sm text-neutral-700">
                         <Server className="h-4 w-4 text-primary mr-3 flex-shrink-0" />
                        API Erişimi
                    </li>
                </div>
                <Button variant="outline" className="w-full rounded-none h-12 border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-white transition-colors font-mono uppercase text-xs tracking-wider">
                    İLETİŞİME GEÇ
                </Button>
            </div>

        </div>

        {/* SPECIAL SOLUTION: FAST TRACK */}
        <FastTrackCard />

      </div>
    </section>
  );
}

function FastTrackCard() {
    const shineRef = useRef(null);
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(shineRef.current, 
                { x: "-100%" }, 
                { 
                    x: "200%", 
                    duration: 1.5, 
                    ease: "power2.inOut", 
                    repeat: -1, 
                    repeatDelay: 3 
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-20 border-t border-gray-200 pt-16">
            <div className="bg-[#0b0b0b] border border-[#252525] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group hover:border-[#444] transition-colors rounded-none">
                 
                 {/* Shine Effect */}
                 <div ref={shineRef} className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none z-0" />

                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                 <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#e7e6d9] text-[#0b0b0b] px-3 py-1 text-[10px] font-bold tracking-widest uppercase font-mono">ÖZEL ÇÖZÜM</span>
                        <span className="text-xs font-bold text-primary tracking-widest uppercase font-mono">PROJE BAZLI</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#e7e6d9] mb-4 font-mono">CERTIFICATION FAST-TRACK</h3>
                    <p className="text-[#888] mb-6 text-lg leading-relaxed">
                        Abonelik yerine acil belgeye mi ihtiyacınız var? 90 gün içinde denetime hazır hale gelme garantili hızlandırılmış paket.
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                        <li className="flex items-center text-sm text-[#e7e6d9] font-medium">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            90 Gün Garanti
                        </li>
                        <li className="flex items-center text-sm text-[#e7e6d9] font-medium">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            Uzman Destekli Gap Analizi
                        </li>
                        <li className="flex items-center text-sm text-[#e7e6d9] font-medium">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            Otomatik Kanıt Paketleme
                        </li>
                        <li className="flex items-center text-sm text-[#e7e6d9] font-medium">
                            <Check className="h-4 w-4 text-primary mr-2" />
                            Tek Seferlik Ödeme
                        </li>
                    </ul>
                 </div>

                 <div className="flex flex-col items-center flex-shrink-0 relative z-10">
                    <div className="text-center mb-6">
                        <span className="block text-4xl font-bold text-[#e7e6d9] font-mono">$2,900</span>
                        <span className="text-xs text-[#888] uppercase tracking-wider">Tek Seferlik / 3 Ay Erişim</span>
                    </div>
                    <Button className="h-14 px-8 bg-[#e7e6d9] text-[#0b0b0b] hover:bg-white font-mono uppercase tracking-widest text-xs w-full">
                        HIZLI BAŞVURU
                    </Button>
                 </div>
            </div>
        </div>
    );
}

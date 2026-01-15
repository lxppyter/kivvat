import Link from "next/link";
import { ArrowLeft, Hexagon, ShieldCheck, Activity, Terminal } from "lucide-react";
import { ScanRadar } from "@/components/auth/scan-radar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen w-full overflow-hidden grid lg:grid-cols-2">
      
      {/* Left: Form Area */}
      <div className="h-full flex flex-col p-8 lg:p-12 xl:p-24 justify-between bg-white relative order-2 lg:order-1 overflow-y-auto no-scrollbar">
        <Link href="/" className="inline-flex items-center text-xs font-mono text-neutral-400 hover:text-primary transition-colors mb-8">
            <ArrowLeft className="mr-2 h-3 w-3" />
            ANA_SAYFAYA_DÖN
        </Link>
        
        <div className="w-full max-w-[400px] mx-auto">
            {children}
        </div>

        <div className="mt-12 text-center lg:text-left">
             <p className="font-mono text-xs text-slate-400">
                &copy; 2026 Kivvat Inc. Güvenli Sistem Erişimi.
             </p>
        </div>
      </div>

      {/* Right: Technical Visual */}
      <div className="hidden lg:flex flex-col bg-[#0b0b0b] border-l border-[#252525] text-[#e7e6d9] p-16 justify-center relative overflow-hidden order-1 lg:order-2">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-10" 
              style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: "32px 32px" }}>
         </div>

         <div className="relative z-10 max-w-lg mx-auto w-full">
             
             {/* Copy */}
             <div className="mb-12">
                 <Hexagon className="h-12 w-12 text-primary mb-8" />
                 <h1 className="text-4xl font-bold tracking-tighter mb-6 leading-tight text-[#e7e6d9]">
                    GÖRÜNÜR <br/> GÜVENLİK.
                 </h1>
                 <p className="text-[#888] text-lg leading-relaxed mb-6">
                    "Tüm altyapınız tek bir ekranda. Anlık tarama, görsel analiz ve otomatik doğrulama."
                 </p>
                 <div className="flex gap-2">
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-primary rounded-full">Agentless</span>
                    <span className="px-3 py-1 bg-white/5 border border-white/10 text-xs font-mono text-primary rounded-full">Visual Map</span>
                 </div>
             </div>

             {/* Scan Radar Visual */}
             <div className="relative py-8">
                <div className="w-full aspect-square">
                    <ScanRadar />
                </div>
                {/* Decorative Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
             </div>

         </div>
      </div>

    </div>
  );
}

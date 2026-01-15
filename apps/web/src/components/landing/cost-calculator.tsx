"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign } from "lucide-react";

export function CostCalculator() {
  const [employees, setEmployees] = useState(50);
  const [market, setMarket] = useState("EU"); // EU, US, TR
  const [result, setResult] = useState<{ fine: number; revenue: number } | null>(null);

  const calculate = () => {
    // Simple logic for demo purposes
    let fineBase = 0;
    let revenueBase = 0;

    if (market === "EU") {
         fineBase = 2000000; // GDPR min usually high
         revenueBase = employees * 10000; 
    } else if (market === "US") {
         fineBase = 500000; // Various state laws
         revenueBase = employees * 15000; // Higher contract values
    } else {
         fineBase = 1000000; // KVKK
         revenueBase = employees * 5000;
    }

    setResult({
        fine: fineBase,
        revenue: revenueBase
    });
  };

  return (
    <section className="py-24 bg-[#0b0b0b] text-[#e7e6d9] relative overflow-hidden border-t border-[#252525]">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 p-24 opacity-5 pointer-events-none">
         <Calculator className="h-64 w-64 text-[#e7e6d9]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Context */}
            <div>
                 <span className="font-mono text-xs font-bold text-primary tracking-widest uppercase mb-4 block">
                    ROI CALCULATOR
                 </span>
                 <h2 className="text-3xl lg:text-4xl font-bold tracking-tighter mb-6 text-[#e7e6d9]">
                    UYUMSUZLUĞUN <br/> MALİYETİNİ HESAPLAYIN.
                 </h2>
                 <p className="text-[#888] text-lg leading-relaxed mb-8">
                    Ufak bir ihmal neye mal olur? Yasal cezalar veya SOC2 belgesi olmadığı için kaçan kurumsal satışlar... Rakamları görün.
                 </p>
                 <div className="p-6 bg-[#111] border border-[#252525] rounded-sm">
                    <p className="font-mono text-sm text-[#b9b8ae]">
                        "Güvenlik bir masraf kalemi değil, satışları hızlandıran bir yatırımdır."
                    </p>
                 </div>
            </div>

            {/* Calculator Card */}
            <div className="bg-[#0e0e0e] text-[#e7e6d9] p-8 border border-[#252525] shadow-2xl">
                {!result ? (
                    <div className="space-y-6">
                        <div>
                            <label className="block font-mono text-xs font-bold uppercase mb-2 text-[#888]">Çalışan Sayısı</label>
                            <input 
                                type="range" 
                                min="10" 
                                max="1000" 
                                step="10"
                                value={employees} 
                                onChange={(e) => setEmployees(parseInt(e.target.value))}
                                className="w-full h-2 bg-[#252525] appearance-none cursor-pointer accent-primary rounded-lg"
                            />
                            <div className="text-right font-bold text-xl mt-2 text-[#e7e6d9]">{employees}</div>
                        </div>

                        <div>
                            <label className="block font-mono text-xs font-bold uppercase mb-2 text-[#888]">Hedef Pazar</label>
                            <div className="grid grid-cols-3 gap-2">
                                <button 
                                    onClick={() => setMarket("EU")}
                                    className={`py-3 font-bold text-sm border transition-colors ${market === "EU" ? "bg-primary text-white border-primary" : "bg-transparent text-[#888] border-[#333] hover:border-[#e7e6d9] hover:text-[#e7e6d9]"}`}
                                >
                                    AB (GDPR)
                                </button>
                                <button 
                                     onClick={() => setMarket("US")}
                                     className={`py-3 font-bold text-sm border transition-colors ${market === "US" ? "bg-primary text-white border-primary" : "bg-transparent text-[#888] border-[#333] hover:border-[#e7e6d9] hover:text-[#e7e6d9]"}`}
                                >
                                    ABD (SOC2)
                                </button>
                                <button 
                                     onClick={() => setMarket("TR")}
                                     className={`py-3 font-bold text-sm border transition-colors ${market === "TR" ? "bg-primary text-white border-primary" : "bg-transparent text-[#888] border-[#333] hover:border-[#e7e6d9] hover:text-[#e7e6d9]"}`}
                                >
                                    TR (KVKK)
                                </button>
                            </div>
                        </div>
                        
                        <Button onClick={calculate} className="w-full h-14 rounded-none bg-[#e7e6d9] text-black font-mono uppercase tracking-widest hover:bg-white hover:scale-[1.01] transition-all">
                            RİSKİ HESAPLA
                        </Button>
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="font-mono text-xs font-bold uppercase text-[#888] mb-2">TAHMİNİ CEZA RİSKİ</p>
                        <div className="text-4xl font-bold text-red-500 mb-8 font-mono">
                           ${result.fine.toLocaleString()}
                        </div>

                        <p className="font-mono text-xs font-bold uppercase text-[#888] mb-2">KAÇAN TAHMİNİ SATIŞ (YILLIK)</p>
                        <div className="text-4xl font-bold text-[#e7e6d9] mb-8 font-mono">
                           ${result.revenue.toLocaleString()}
                        </div>
                        
                        <Button onClick={() => setResult(null)} variant="outline" className="w-full rounded-none h-12 border-[#333] text-[#888] hover:text-[#e7e6d9] hover:bg-[#222]">
                            TEKRAR HESAPLA
                        </Button>
                    </div>
                )}
            </div>

        </div>
      </div>
    </section>
  );
}

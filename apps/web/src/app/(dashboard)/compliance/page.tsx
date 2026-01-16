"use client";

import { useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";

export default function CompliancePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const runDeepScan = async () => {
      setLoading(true);
      try {
          const storedCreds = localStorage.getItem('aws_credentials');
          if (!storedCreds) {
              alert("Bağlantı bilgisi bulunamadı. Lütfen 'Bağlantı' sayfasından giriş yapın.");
              setLoading(false);
              return;
          }
          const credentials = JSON.parse(storedCreds);

          const response = await api.post('/scanner/run', { provider: 'aws', credentials });
          setResults(response.data);
      } catch (error) {
          console.error("Compliance Scan Error:", error);
          alert("Tarama hatası.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">Uyumluluk Denetimi</h1>
          <p className="text-sm text-muted-foreground font-mono">
            AWS ISO 27001 & SOC2 Referans Kontrolleri
          </p>
        </div>
        <Button onClick={runDeepScan} disabled={loading} className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider h-10 px-6 hover:bg-primary/90 rounded-lg shadow-sm">
            {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <ShieldCheck className="mr-2 h-3.5 w-3.5" />}
            Denetimi Başlat
        </Button>
      </div>

      <div className="border border-border bg-card rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/50 border-b border-border text-xs uppercase font-mono text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Kontrol ID</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Kaynak</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Durum</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Detay</th>
                <th className="px-6 py-4 font-semibold tracking-wider text-right">Aksiyon</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {results.length === 0 && !loading && (
                 <tr>
                     <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground font-mono text-sm">
                         Detaylı rapor için "Denetimi Başlat" butonuna basın.
                     </td>
                 </tr>
              )}
              {results.map((item, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors group">
                  <td className="px-6 py-4 font-mono font-medium text-foreground">{item.ruleId}</td>
                  <td className="px-6 py-4 font-mono text-muted-foreground">{item.resourceId}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium border ${
                        item.status === 'COMPLIANT' 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                        : 'bg-rose-50 text-rose-700 border-rose-100'
                    }`}>
                      {item.status === 'COMPLIANT' ? 'GEÇTİ' : 'KALDI'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground font-mono text-xs max-w-xs truncate" title={item.details}>
                    {item.details}
                  </td>
                  <td className="px-6 py-4 text-right">
                     {item.status === 'NON_COMPLIANT' && (
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-mono text-primary hover:text-primary hover:bg-primary/10">
                            GÖREV OLUŞTUR
                        </Button>
                     )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

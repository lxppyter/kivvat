"use client";

import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ScanDialog } from "@/components/dashboard/scan-dialog";

export default function CompliancePage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [isAuditor, setIsAuditor] = useState(false);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    setIsAuditor(Cookies.get("user_role") === "AUDITOR");
    fetchData();
  }, []);

  const fetchData = async () => {
      try {
          const [reportsRes, profileRes] = await Promise.all([
             api.get('/scanner/reports'),
             api.get('/auth/me')
          ]);

          if (reportsRes.data && reportsRes.data.length > 0) {
              setResults(reportsRes.data[0].results);
          }
          setUserPlan(profileRes.data.plan);
      } catch (e) {
          console.error("Failed to fetch data", e);
      }
  };

  const openScanDialog = () => {
    setScanDialogOpen(true);
  };

  const handleScanStart = async (selectedProviders: string[]) => {
      setLoading(true);
      setScanDialogOpen(false);
      setResults([]); // Clear previous

      try {
          let accumulatedResults: any[] = [];

          for (const providerId of selectedProviders) {
              let credentials = {};
              if (providerId === 'aws') credentials = JSON.parse(localStorage.getItem('aws_credentials') || '{}');
              if (providerId === 'azure') credentials = JSON.parse(localStorage.getItem('azure_credentials') || '{}');
              if (providerId === 'gcp') credentials = JSON.parse(localStorage.getItem('gcp_credentials') || '{}');
              
              const apiProvider = providerId === 'demo' ? 'manual' : providerId;

              const response = await api.post('/scanner/run', { 
                  provider: apiProvider, 
                  credentials 
              });
              
              if (response.data) {
                  accumulatedResults = [...accumulatedResults, ...response.data];
              }
          }
          
          setResults(accumulatedResults);

      } catch (error) {
          console.error("Compliance Scan Error:", error);
          alert("Tarama hatası. Bağlantıları kontrol edin.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-6">
      <ScanDialog 
        open={scanDialogOpen} 
        onOpenChange={setScanDialogOpen} 
        onScan={handleScanStart}
        loading={loading}
        userPlan={userPlan}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">Uyumluluk Denetimi</h1>
          <p className="text-sm text-muted-foreground font-mono">
            Çoklu Bulut (AWS, Azure, GCP) ISO 27001 & SOC2 Kontrolleri
          </p>
        </div>
        <Button onClick={openScanDialog} disabled={loading} className="bg-primary text-primary-foreground font-mono text-xs uppercase tracking-wider h-10 px-6 hover:bg-primary/90 rounded-lg shadow-sm">
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
                <ComplianceRow key={i} item={item} />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function ComplianceRow({ item }: { item: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasRemediation = item.status === 'NON_COMPLIANT' && item.remediation;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} asChild>
      <>
        <tr className={`hover:bg-muted/30 transition-colors group ${isOpen ? 'bg-muted/30' : ''}`}>
          <td className="px-6 py-4 font-mono font-medium text-foreground">
             <div className="flex items-center gap-2">
                {hasRemediation && (
                   <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-muted">
                        {isOpen ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      </Button>
                   </CollapsibleTrigger>
                )}
                {item.ruleId}
             </div>
          </td>
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
        <CollapsibleContent asChild>
           <tr>
             <td colSpan={5} className="p-0 border-b border-border/40 bg-amber-50/30 dark:bg-amber-950/10">
                 <div className="px-6 py-4 flex items-start gap-3">
                    <div className="bg-amber-100 dark:bg-amber-900/40 p-1.5 rounded-full mt-0.5">
                       <Lightbulb className="h-4 w-4 text-amber-600 dark:text-amber-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-xs font-bold font-mono text-amber-800 dark:text-amber-400">ÖNERİLEN ÇÖZÜM (REMEDIATION)</p>
                        <p className="text-sm text-foreground/80 font-mono leading-relaxed max-w-4xl">
                            {item.remediation}
                        </p>
                    </div>
                 </div>
             </td>
           </tr>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
}

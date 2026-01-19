"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Filter, Search, Loader2, Package, Calendar, ShieldCheck, Share2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import api, { scanner, reports } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { ComplianceChart } from "@/components/dashboard/ComplianceChart";
import { RULE_TO_CONTROLS_MAP, getStandardName } from "@/lib/compliance-map";

export default function ReportsPage() {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<string | null>(null);
    const [stats, setStats] = useState<any[]>([]);

    const [userPlan, setUserPlan] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [reportRes, profileRes] = await Promise.all([
                scanner.getReports(),
                api.get("/auth/me")
            ]);
            
            setItems(reportRes.data);
            setUserPlan(profileRes.data.plan);

            if (reportRes.data.length > 0) {
                calculateStats(reportRes.data[0]); // Use latest report for chart
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (latestReport: any) => {
        const results = latestReport.results || [];
        const standardsStats: Record<string, { total: number, passed: number, score: number }> = {};
        
        for (const res of results) {
            const codes = RULE_TO_CONTROLS_MAP[res.ruleId] || [];
            const uniqueStandards = new Set(codes.map(getStandardName));
            
            if (uniqueStandards.size === 0) uniqueStandards.add('General Best Practice'); // Fallback

            for (const std of uniqueStandards) {
                if (!standardsStats[std]) standardsStats[std] = { total: 0, passed: 0, score: 0 };
                standardsStats[std].total++;
                if (res.status === 'COMPLIANT') standardsStats[std].passed++;
            }
        }

        const chartData = Object.keys(standardsStats).map(std => {
            const s = standardsStats[std];
            return {
                standard: std,
                passed: s.passed,
                total: s.total,
                score: s.total > 0 ? Math.round((s.passed / s.total) * 100) : 0
            };
        });
        setStats(chartData);
    };

    const handleDownloadPdf = async (id: string) => {
        setDownloadingId(id);
        try {
            const res = await reports.downloadPdf(id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `kivvat-report-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
            console.error(e);
            alert("Rapor indirilemedi.");
        } finally {
           setDownloadingId(null);
        }
    };

    const handleDownloadZip = async (id: string) => {
        setDownloadingId(id);
        try {
            const res = await reports.downloadZip(id);
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `kivvat-audit-bundle-${id}.zip`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (e) {
             console.error(e);
             alert("Paket oluşturulamadı.");
        } finally {
            setDownloadingId(null);
        }
    };
  
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-8">
        <div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Geçmiş Raporlar ve Analizler</h1>
            <p className="text-sm text-muted-foreground font-mono mt-1">
             Yapılan tüm denetimlerin arşivi, kanıt paketleri ve uyumluluk skorları.
           </p>
        </div>
        <div className="flex items-center gap-2">
            <Button 
                variant={userPlan === 'ENTERPRISE' ? "default" : "outline"} 
                className="gap-2 font-mono text-xs"
                onClick={() => {
                    if (userPlan !== 'ENTERPRISE') {
                        alert("Denetçi Paylaşımı (Audit Share) sadece TOTAL AUTHORITY (Enterprise) pakette mevcuttur.");
                        return;
                    }
                    // Handle share action (mock for now or dialog)
                    alert("Paylaşım özelliği yakında aktif."); // Or implement dialog later if requested
                }}
            >
                {userPlan === 'ENTERPRISE' ? <Share2 className="h-4 w-4" /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                {userPlan === 'ENTERPRISE' ? "PAYLAŞ" : "PAYLAŞ (ENT)"}
            </Button>
            <Button variant="outline"><Filter className="mr-2 h-4 w-4"/> Filtrele</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <ComplianceChart data={stats} />
        <Card className="bg-card border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Rapor</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">{items.length}</div>
            <p className="text-xs text-muted-foreground">Arşivlenmiş Denetim</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card border-border shadow-sm overflow-hidden">
          <CardHeader className="border-b border-border/40">
              <CardTitle className="text-base font-mono">Denetim Geçmişi</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <table className="w-full text-left">
                <thead className="bg-muted/40 border-b border-border">
                    <tr>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Tarih / ID</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Hedef</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Risk Skoru</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Bulgular</th>
                        <th className="px-6 py-4 text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide text-right">Dosyalar</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                    {loading ? (
                         <tr><td colSpan={5} className="p-8 text-center text-muted-foreground"><Loader2 className="mx-auto h-6 w-6 animate-spin"/> Veriler yükleniyor...</td></tr>
                    ) : items.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-muted-foreground">Arşivde rapor bulunamadı.</td></tr>
                    ) : (
                        items.map((report) => (
                           <tr key={report.id} className="hover:bg-muted/30 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex flex-col">
                                        <div className="flex items-center font-mono text-sm font-medium text-foreground">
                                           <Calendar className="mr-2 h-3.5 w-3.5 text-muted-foreground" />
                                           {new Date(report.createdAt).toLocaleDateString()}
                                        </div>
                                        <span className="text-[10px] text-muted-foreground font-mono mt-0.5">#{report.id.substring(0,8)}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                     <Badge variant="outline" className="font-mono text-[10px] uppercase">{report.provider}</Badge>
                                </td>
                                <td className="px-6 py-4">
                                     <div className={`flex items-center font-bold font-mono ${report.score >= 90 ? 'text-emerald-500' : report.score >= 70 ? 'text-amber-500' : 'text-rose-500'}`}>
                                        <ShieldCheck className="mr-2 h-4 w-4" />
                                        {report.score}%
                                     </div>
                                </td>
                                <td className="px-6 py-4 text-xs text-muted-foreground font-mono">
                                    {/* Safe access to results for legacy data */}
                                    {(report.results as any[])?.length || 0} Kontrol
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownloadPdf(report.id)} disabled={downloadingId === report.id}>
                                            {downloadingId === report.id ? <Loader2 className="h-4 w-4 animate-spin"/> : <FileText className="h-4 w-4 text-blue-500" />}
                                        </Button>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => handleDownloadZip(report.id)} disabled={downloadingId === report.id}>
                                            <Package className="h-4 w-4 text-amber-600" />
                                        </Button>
                                    </div>
                                </td>
                           </tr>
                        ))
                    )}
                </tbody>
             </table>
          </CardContent>
      </Card>
    </div>
  );
}

"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, AlertTriangle, CheckCircle2, Activity, Play, Loader2, AlertCircle, FileText, Package } from "lucide-react";
import api, { scanner, reports } from "@/lib/api";
import { useEffect, useState } from "react";

import Cookies from "js-cookie";

import { ScanDialog } from "./scan-dialog";

export default function DashboardOverview({ items, loading: pLoading }: { items: any[], loading: boolean }) {
  const [loading, setLoading] = useState(false);
  const [isAuditor, setIsAuditor] = useState(false);
  const [scanDialogOpen, setScanDialogOpen] = useState(false);

  useEffect(() => {
    setIsAuditor(Cookies.get("user_role") === "AUDITOR");
  }, []);
  // Real data state
  const [stats, setStats] = useState([
      { title: "Risk Score", value: "A+", subtext: "Excellent Standing", trend: "stable", icon: ShieldCheck },
      { title: "Active Issues", value: "0", subtext: "0 Critical, 0 High", trend: "down", icon: AlertTriangle },
      { title: "Compliance", value: "100%", subtext: "ISO 27001 Ready", trend: "up", icon: CheckCircle2 },
      { title: "Cloud Assets", value: "0", subtext: "Total Resources", trend: "up", icon: Activity },
  ]);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    fetchLatestReport();
  }, []);

  const fetchLatestReport = async () => {
    try {
        const res = await scanner.getReports();
        if (res.data && res.data.length > 0) {
            const latest = res.data[0];
            const results = latest.results as any[];
            
            // Process Results for Dashboard
            const failCount = results.filter((r: any) => r.status === 'NON_COMPLIANT').length;
            const passCount = results.filter((r: any) => r.status === 'COMPLIANT').length;
            const total = results.length;
            const score = latest.score;

            // Update Stats
            setStats([
                { title: "Risk Score", value: score >= 90 ? "A+" : score >= 70 ? "B" : "D", subtext: "Dynamic Analysis", trend: "stable", icon: ShieldCheck },
                { title: "Active Issues", value: failCount.toString(), subtext: `${failCount} Non-Compliant Rules`, trend: "down", icon: AlertTriangle },
                { title: "Compliance", value: `${score}%`, subtext: "ISO 27001 Ready", trend: "up", icon: CheckCircle2 },
                { title: "Scanned Assets", value: total.toString(), subtext: "Cloud + Physical", trend: "up", icon: Activity },
            ]);

            // Update Activity Log
            const newActivities = results.map((r: any, i: number) => ({
                id: i,
                type: r.status === 'COMPLIANT' ? 'success' : 'issue',
                message: `${r.ruleId}: ${r.details}`,
                time: new Date(latest.createdAt).toLocaleTimeString(),
                icon: r.status === 'COMPLIANT' ? CheckCircle2 : AlertCircle
            }));
            setActivities(newActivities);
        }
    } catch (e) {
        console.error("Failed to fetch reports", e);
    }
  };


  // Open Dialog instead of direct scan
  const openScanDialog = () => {
    setScanDialogOpen(true);
  };

  const handleScanStart = async (selectedProviders: string[]) => {
      setLoading(true);
      setScanDialogOpen(false); // Close dialog

      try {
          // Iterate through selected providers and run scan for each
          // Note: Backend currently accepts one provider at a time in /scanner/run, 
          // or we can update backend to accept array. 
          // For now, let's just pick the first one or run sequentially.
          // Better approach: Run sequentially for now to support the 'demo' / 'manual' logic
          
          for (const providerId of selectedProviders) {
              let credentials = {};
              if (providerId === 'aws') credentials = JSON.parse(localStorage.getItem('aws_credentials') || '{}');
              if (providerId === 'azure') credentials = JSON.parse(localStorage.getItem('azure_credentials') || '{}');
              if (providerId === 'gcp') credentials = JSON.parse(localStorage.getItem('gcp_credentials') || '{}');
              
              // Provider ID 'demo' maps to 'demo' in backend (which triggers manual/local verify only)
              // Actually 'demo' in backend was for AWS mock. 
              // We need to ensuring backend handles 'demo' or 'manual' correctly.
              // In ScannerService.runScan: 
              // if provider == 'aws'/'azure'/'gcp' -> cloud scan
              // ALWAYS runs verifyManualAssets.
              
              // So if we send 'manual', it skips cloud scan and does manual verify.
              const apiProvider = providerId === 'demo' ? 'manual' : providerId;

              await api.post('/scanner/run', { 
                  provider: apiProvider, 
                  credentials 
              });
          }

          // Refresh dashboard data
          fetchLatestReport();

      } catch (error) {
          console.error("Scan failed", error);
          alert("Tarama başlatılamadı. API bağlantısını kontrol edin.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="space-y-8">
      <ScanDialog 
        open={scanDialogOpen} 
        onOpenChange={setScanDialogOpen} 
        onScan={handleScanStart}
        loading={loading}
      />

      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Genel Bakış</h1>
          <p className="text-sm text-muted-foreground font-mono">
            Sistem durumu ve güvenlik risk skoru.
          </p>
        </div>
        <div className="flex items-center gap-3">
            <Button onClick={openScanDialog} disabled={loading} className="h-10 bg-primary text-primary-foreground font-mono text-xs font-semibold tracking-wide hover:bg-primary/90 rounded-lg shadow-sm">
                {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
                {loading ? "TARANIYOR..." : "TARAMAYI BAŞLAT"}
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
            <Card key={i} className="border-border bg-card shadow-sm rounded-xl">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between space-y-0 pb-2">
                        <span className="text-sm font-medium font-mono text-muted-foreground">{stat.title}</span>
                        <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex items-baseline gap-2 mt-2">
                        <div className="text-2xl font-bold font-mono text-foreground tracking-tight">{stat.value}</div>
                        <span className={`text-xs font-mono font-medium ${stat.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{stat.subtext}</span>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-1">
         <Card className="border-border bg-card shadow-sm rounded-xl">
             <CardHeader className="px-6 py-5 border-b border-border/40">
                 <CardTitle className="text-base font-bold font-mono text-foreground">Son Aktiviteler</CardTitle>
                 <CardDescription className="text-xs font-mono text-muted-foreground">Sistem tarafından algılanan son olaylar.</CardDescription>
             </CardHeader>
             <CardContent className="p-0">
                 <div className="divide-y divide-border/40">
                    {activities.length === 0 && (
                        <div className="p-8 text-center text-sm font-mono text-muted-foreground">
                            Henüz taranmış veri yok. "Taramayı Başlat" butonuna basın.
                        </div>
                    )}
                    {activities.map((item) => (
                        <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/30 transition-colors">
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center border ${
                                item.type === 'issue' 
                                ? 'bg-rose-50 border-rose-100 text-rose-600' 
                                : 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            }`}>
                                <item.icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium font-mono text-foreground truncate">{item.message}</p>
                                <p className="text-xs text-muted-foreground font-mono">{item.time}</p>
                            </div>
                        </div>
                    ))}
                 </div>
             </CardContent>
         </Card>
      </div>
    </div>
  );
}

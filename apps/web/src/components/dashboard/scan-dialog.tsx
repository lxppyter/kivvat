import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { Cloud, Server, Shield, Loader2, Play, Lock, FileCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ScanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScan: (selectedProviders: string[]) => void;
  loading: boolean;
  userPlan: string | null;
}

export function ScanDialog({ open, onOpenChange, onScan, loading, userPlan }: ScanDialogProps) {
  const [providers, setProviders] = useState<{ id: string; name: string; icon: any; available: boolean; selected: boolean }[]>([]);
  
  const isPro = userPlan === 'PRO' || userPlan === 'ENTERPRISE';

  // Check available credentials on open
  useEffect(() => {
    if (open) {
      const hasAws = !!localStorage.getItem('aws_credentials');
      const hasAzure = !!localStorage.getItem('azure_credentials');
      const hasGcp = !!localStorage.getItem('gcp_credentials');

      setProviders([
        { id: 'aws', name: 'AWS Cloud', icon: Cloud, available: hasAws, selected: hasAws },
        { id: 'azure', name: 'Azure Cloud', icon: Cloud, available: hasAzure, selected: hasAzure },
        { id: 'gcp', name: 'Google Cloud', icon: Cloud, available: hasGcp, selected: hasGcp },
        { id: 'demo', name: 'Manuel Varlıklar (Laptop/Sunucu)', icon: Server, available: true, selected: !hasAws && !hasAzure && !hasGcp }, // Auto-select if no cloud
      ]);
    }
  }, [open]);

  const toggleProvider = (id: string) => {
    setProviders(prev => prev.map(p => 
      p.id === id ? { ...p, selected: !p.selected } : p
    ));
  };

  const handleStart = () => {
    const selected = providers.filter(p => p.selected).map(p => p.id);
    onScan(selected);
  };

  const anySelected = providers.some(p => p.selected);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-mono tracking-tight">TARAMA KAPSAMI</DialogTitle>
          <DialogDescription className="font-mono text-xs">
            Güvenlik taraması yapılacak ortamları ve standartları seçin.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
             {/* PROVIDERS SECTION */}
            <div className="space-y-3">
                <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">HEDEF ORTAMLAR</Label>
                <div className="grid gap-2">
                    {providers.map((p) => (
                        <div key={p.id} className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${p.selected ? 'border-primary bg-primary/5' : 'border-border bg-card'}`}>
                        <Checkbox 
                            id={p.id} 
                            checked={p.selected} 
                            disabled={!p.available}
                            onCheckedChange={() => toggleProvider(p.id)}
                        />
                        <div className="grid gap-0.5 leading-none">
                            <Label 
                            htmlFor={p.id} 
                            className={`font-mono text-sm font-medium cursor-pointer ${!p.available && 'text-muted-foreground opacity-70'}`}
                            >
                            <div className="flex items-center gap-2">
                                <p.icon className="h-3.5 w-3.5" />
                                {p.name}
                            </div>
                            </Label>
                            {!p.available && (
                            <span className="text-[10px] text-muted-foreground font-mono pl-6">Bağlantı Yok</span>
                            )}
                        </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* STANDARDS SECTION (Visual Only) */}
            <div className="space-y-3">
                 <Label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">UYUMLULUK STANDARTLARI</Label>
                 <div className="grid gap-2">
                     {/* KVKK - Always Active */}
                     <div className="flex items-center justify-between p-3 rounded-lg border border-primary/40 bg-primary/5">
                         <div className="flex items-center gap-3">
                             <Checkbox checked={true} disabled />
                             <div className="flex items-center gap-2 font-mono text-sm font-medium">
                                 <FileCheck className="h-3.5 w-3.5 text-primary" />
                                 KVKK (Teknik)
                             </div>
                         </div>
                         <Badge variant="secondary" className="text-[9px]">CORE</Badge>
                     </div>

                     {/* ISO 27001 */}
                     <div className={`flex items-center justify-between p-3 rounded-lg border ${isPro ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/40 opacity-70'}`}>
                         <div className="flex items-center gap-3">
                             {isPro ? <Checkbox checked={true} disabled /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                             <div className="flex items-center gap-2 font-mono text-sm font-medium">
                                 <Shield className="h-3.5 w-3.5" />
                                 ISO 27001
                             </div>
                         </div>
                         {isPro ? (
                             <Badge variant="secondary" className="text-[9px]">ACTIVE</Badge>
                         ) : (
                             <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-600 bg-amber-500/10">PRO GEREKLİ</Badge>
                         )}
                     </div>

                     {/* SOC 2 */}
                     <div className={`flex items-center justify-between p-3 rounded-lg border ${isPro ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/40 opacity-70'}`}>
                         <div className="flex items-center gap-3">
                             {isPro ? <Checkbox checked={true} disabled /> : <Lock className="h-4 w-4 text-muted-foreground" />}
                             <div className="flex items-center gap-2 font-mono text-sm font-medium">
                                 <Shield className="h-3.5 w-3.5" />
                                 SOC 2 Type II
                             </div>
                         </div>
                         {isPro ? (
                             <Badge variant="secondary" className="text-[9px]">ACTIVE</Badge>
                         ) : (
                             <Badge variant="outline" className="text-[9px] border-amber-500/50 text-amber-600 bg-amber-500/10">PRO GEREKLİ</Badge>
                         )}
                     </div>
                 </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading} className="font-mono text-xs">İPTAL</Button>
          <Button onClick={handleStart} disabled={loading || !anySelected} className="bg-primary text-primary-foreground font-mono text-xs tracking-wide">
            {loading ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Play className="mr-2 h-3.5 w-3.5" />}
            {loading ? "BAŞLATILIYOR..." : "TARAMAYI BAŞLAT"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

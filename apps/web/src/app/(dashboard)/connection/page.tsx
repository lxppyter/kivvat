"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "@/lib/api";

export default function ConnectionPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [awsForm, setAwsForm] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1"
  });

  const handleConnect = async (provider: string, data: any) => {
    setLoading(true);
    setStatus(null);
    try {
        // API call to /cloud/connect/{provider}
        await api.post(`/cloud/connect/${provider}`, data);
        
        // Store credentials in localStorage for the scanner to use (temporary solution for demo)
        localStorage.setItem(`${provider}_credentials`, JSON.stringify(data));
        
        setStatus({ type: 'success', message: 'Bağlantı başarıyla sağlandı. Tarama için hazır.' });
    } catch (error) {
        setStatus({ type: 'error', message: 'Bağlantı hatası. Bilgilerinizi kontrol edin.' });
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-mono">Bulut Bağlantısı</h1>
        <p className="text-muted-foreground font-mono text-sm max-w-2xl">
          Güvenli bir altyapı taraması için bulut sağlayıcınızı bağlayın.
        </p>
      </div>

      <div className="border border-border bg-card p-8 rounded-xl shadow-sm">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-1">Sağlayıcı Seçimi</h2>
            <p className="text-sm text-muted-foreground">Otomatik denetim için hedef altyapıyı seçin.</p>
          </div>
          
          <Tabs defaultValue="aws" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-muted p-1 mb-8 rounded-lg border border-border/50">
              <TabsTrigger value="aws" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-all">AWS</TabsTrigger>
              <TabsTrigger value="azure" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-all">Azure</TabsTrigger>
              <TabsTrigger value="gcp" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-all">GCP</TabsTrigger>
            </TabsList>

            {/* AWS Tab */}
            <TabsContent value="aws" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="aws-key" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">ACCESS KEY ID</Label>
                  <Input 
                    id="aws-key" 
                    placeholder="AKIA..." 
                    className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11"
                    value={awsForm.accessKeyId} 
                    onChange={(e) => setAwsForm({...awsForm, accessKeyId: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aws-secret" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">SECRET ACCESS KEY</Label>
                  <Input 
                    id="aws-secret" 
                    type="password" 
                    placeholder="Key..." 
                    className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11"
                    value={awsForm.secretAccessKey} 
                    onChange={(e) => setAwsForm({...awsForm, secretAccessKey: e.target.value})} 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aws-region" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">REGION</Label>
                  <Input 
                    id="aws-region" 
                    placeholder="us-east-1" 
                    className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11"
                    value={awsForm.region} 
                    onChange={(e) => setAwsForm({...awsForm, region: e.target.value})} 
                  />
                </div>
              </div>
              <Button 
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-lg tracking-wide text-xs shadow-sm mt-2" 
                disabled={loading} 
                onClick={() => handleConnect('aws', awsForm)}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cloud className="mr-2 h-4 w-4" />}
                SAĞLAYICIYA BAĞLAN
              </Button>
            </TabsContent>

            {/* Azure Tab */}
            <TabsContent value="azure" className="space-y-4">
               <div className="p-8 bg-muted/40 border border-border/50 border-dashed rounded-lg text-xs font-mono text-muted-foreground text-center">
                  Azure entegrasyon modülü yakında aktif olacak.
               </div>
               <Button className="w-full h-12 border border-border text-muted-foreground bg-transparent hover:bg-muted font-mono rounded-lg tracking-wide text-xs" disabled variant="outline">Kullanılamaz</Button>
            </TabsContent>

            {/* GCP Tab */}
            <TabsContent value="gcp" className="space-y-4">
               <div className="p-8 bg-muted/40 border border-border/50 border-dashed rounded-lg text-xs font-mono text-muted-foreground text-center">
                  GCP entegrasyon modülü yakında aktif olacak.
               </div>
                <Button className="w-full h-12 border border-border text-muted-foreground bg-transparent hover:bg-muted font-mono rounded-lg tracking-wide text-xs" disabled variant="outline">Kullanılamaz</Button>
            </TabsContent>
          </Tabs>

          {status && (
            <div className={`mt-6 p-4 flex items-start gap-4 border rounded-lg ${status.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-rose-50 border-rose-100 text-rose-800'}`}>
              {status.type === 'success' ? <CheckCircle2 className="h-5 w-5 mt-0.5 text-emerald-600" /> : <AlertCircle className="h-5 w-5 mt-0.5 text-rose-600" />}
              <div>
                <p className="font-mono font-bold text-sm">{status.type === 'success' ? 'BAŞARILI' : 'HATA'}</p>
                <p className="text-sm opacity-90 font-mono mt-1">{status.message}</p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

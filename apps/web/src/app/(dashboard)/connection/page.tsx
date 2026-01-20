"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cloud, CheckCircle2, AlertCircle, Loader2, Shield } from "lucide-react";
import api from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ConnectionPage() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  
  const [awsForm, setAwsForm] = useState({
    accessKeyId: "",
    secretAccessKey: "",
    region: "us-east-1"
  });

  const [azureForm, setAzureForm] = useState({
    tenantId: "",
    clientId: "",
    clientSecret: ""
  });

  const [gcpForm, setGcpForm] = useState({
    serviceAccountJson: ""
  });

  // ... inside ConnectionPage
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [connectedCount, setConnectedCount] = useState(0);
  const [checkingLimits, setCheckingLimits] = useState(true);

  useEffect(() => {
    checkLimits();
  }, []);

  const checkLimits = async () => {
    try {
        const [profileRes, assetsRes] = await Promise.all([
            api.get("/auth/me"),
            api.get("/assets?type=ACCOUNT") 
        ]);
        
        setUserPlan(profileRes.data.plan);
        // assets endpoint returns all assets, filter by ACCOUNT type if backend doesn't support query param perfectly yet
        // Assuming backend supports it or we filter client side.
        // Based on previous work, AssetService has countByType but controller might need update.
        // Let's assume we get all assets and filter client side to be safe.
        const accounts = assetsRes.data.filter((a: any) => a.type === 'ACCOUNT');
        setConnectedCount(accounts.length);
    } catch (e) {
        console.error("Limit check failed", e);
    } finally {
        setCheckingLimits(false);
    }
  };

  const getLimit = () => {
      if (userPlan === 'ENTERPRISE') return 999;
      if (userPlan === 'PRO') return 3;
      return 1; // CORE and FREE
  };

  const limit = getLimit();
  const isLimitReached = connectedCount >= limit;

  const handleConnect = async (provider: string, data: any) => {
    if (isLimitReached) return;
    setLoading(true);
    setStatus(null);
    try {
        // API call to /cloud/connect/{provider}
        await api.post(`/cloud/connect/${provider}`, data);
        
        // Store credentials in localStorage for the scanner to use (temporary solution for demo)
        localStorage.setItem(`${provider}_credentials`, JSON.stringify(data));
        
        setStatus({ type: 'success', message: 'Bağlantı başarıyla sağlandı. Tarama için hazır.' });
        checkLimits(); // Refresh limits
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
          {isLimitReached && !checkingLimits && (
              <div className="mb-6 bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg flex items-center gap-3">
                  <div className="bg-amber-500/20 p-2 rounded-full">
                      <Shield className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                      <h4 className="font-bold text-amber-700 text-sm font-mono">PAKET LİMİTİNE ULAŞILDI ({connectedCount}/{limit})</h4>
                      <p className="text-xs text-amber-800/80 font-mono mt-1">
                          Yeni bir bulut hesabı bağlamak için mevcut bağlantıyı silin veya paketinizi yükseltin.
                      </p>
                  </div>
                  <Button variant="outline" size="sm" className="ml-auto border-amber-200 text-amber-800 hover:bg-amber-100 font-mono text-xs" onClick={() => window.location.href='/settings/billing'}>
                      YÜKSELT
                  </Button>
              </div>
          )}
          <div className="mb-8">
            <h2 className="text-lg font-bold text-foreground mb-1">Sağlayıcı Seçimi</h2>
            <p className="text-sm text-muted-foreground">Otomatik denetim için hedef altyapıyı seçin.</p>
          </div>
          
          <Tabs defaultValue="aws" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-muted p-1 mb-8 rounded-lg border border-border/50">
              <TabsTrigger value="aws" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-all">AWS</TabsTrigger>
              <TabsTrigger value="azure" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-all">Azure {(!userPlan || !['PRO', 'ENTERPRISE'].includes(userPlan)) && <span className="ml-2 text-[10px] opacity-70">🔒</span>}</TabsTrigger>
              <TabsTrigger value="gcp" className="rounded-md data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-none font-mono text-xs font-semibold tracking-wide text-muted-foreground transition-all">GCP {userPlan !== 'ENTERPRISE' && <span className="ml-2 text-[10px] opacity-70">🔒</span>}</TabsTrigger>
            </TabsList>

            {/* AWS Tab */}
            <TabsContent value="aws" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Alert className="bg-blue-50/50 border-blue-200 text-blue-900">
                <Shield className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-xs font-bold text-blue-700">SADECE OKUMA ERİŞİMİ GEREKLİ</AlertTitle>
                <AlertDescription className="text-[10px] text-blue-800/80 leading-relaxed mt-1">
                  Güvenliğiniz için lütfen IAM Kullanıcısına sadece <strong>ReadOnlyAccess</strong> veya <strong>SecurityAudit</strong> yetkisi verin. 
                  Yönetici yetkisine (Admin) ihtiyacımız yoktur.
                </AlertDescription>
              </Alert>
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
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 font-mono rounded-lg tracking-wide text-xs shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading || (isLimitReached && !checkingLimits)} 
                onClick={() => handleConnect('aws', awsForm)}
              >
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cloud className="mr-2 h-4 w-4" />}
                SAĞLAYICIYA BAĞLAN
              </Button>
            </TabsContent>

            {/* Azure Tab */}
            <TabsContent value="azure" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               {(!userPlan || !['PRO', 'ENTERPRISE'].includes(userPlan)) ? (
                  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-muted/30">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">Azure Integration Locked</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6 font-mono text-sm leading-relaxed">
                        Azure altyapı taraması sadece <strong>Trust Architect (PRO)</strong> ve üzeri paketlerde mevcuttur.
                    </p>
                    <Button onClick={() => window.location.href = '/settings/billing'} className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white border-0 font-mono text-xs h-10 px-8">
                        UPGRADE TO PRO
                    </Button>
                  </div>
               ) : (
                <>
                  <Alert className="bg-blue-50/50 border-blue-200 text-blue-900">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-xs font-bold text-blue-700">SADECE OKUMA ERİŞİMİ GEREKLİ</AlertTitle>
                    <AlertDescription className="text-[10px] text-blue-800/80 leading-relaxed mt-1">
                      Güvenliğiniz için lütfen Service Principal'a sadece <strong>Reader</strong> veya <strong>Viewer</strong> yetkisi verin. 
                      Write/Owner yetkisine ihtiyacımız yoktur.
                    </AlertDescription>
                  </Alert>
                   <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="az-tenant" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">TENANT ID (DIRECTORY ID)</Label>
                            <Input 
                                id="az-tenant" 
                                placeholder="00000000-0000-0000-0000-000000000000" 
                                className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11"
                                value={azureForm.tenantId}
                                onChange={(e) => setAzureForm({...azureForm, tenantId: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="az-client" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">CLIENT ID (APPLICATION ID)</Label>
                            <Input 
                                id="az-client" 
                                placeholder="00000000-0000-0000-0000-000000000000" 
                                className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11"
                                value={azureForm.clientId}
                                onChange={(e) => setAzureForm({...azureForm, clientId: e.target.value})}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="az-secret" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">CLIENT SECRET</Label>
                            <Input 
                                id="az-secret" 
                                type="password" 
                                placeholder="Value..." 
                                className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11"
                                value={azureForm.clientSecret}
                                onChange={(e) => setAzureForm({...azureForm, clientSecret: e.target.value})}
                            />
                        </div>
                   </div>
                   <Button 
                    className="w-full h-12 bg-blue-600 text-white hover:bg-blue-700 font-mono rounded-lg tracking-wide text-xs shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={loading || (isLimitReached && !checkingLimits)}
                    onClick={() => handleConnect('azure', azureForm)}
                   >
                     {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cloud className="mr-2 h-4 w-4" />}
                     AZURE BAĞLAN
                   </Button>
                </>
               )}
            </TabsContent>

            {/* GCP Tab */}
            <TabsContent value="gcp" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               {(!userPlan || userPlan !== 'ENTERPRISE') ? (
                  <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-xl bg-muted/30">
                    <Shield className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-bold mb-2">GCP Integration Locked</h3>
                    <p className="text-muted-foreground text-center max-w-md mb-6 font-mono text-sm leading-relaxed">
                        Google Cloud Platform (GCP) altyapı taraması sadece <strong>Total Authority (Enterprise)</strong> paketinde mevcuttur.
                    </p>
                    <Button onClick={() => window.location.href = '/settings/billing'} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0 font-mono text-xs h-10 px-8">
                        UPGRADE TO ENTERPRISE
                    </Button>
                  </div>
               ) : (
                <>
                  <Alert className="bg-blue-50/50 border-blue-200 text-blue-900">
                    <Shield className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-xs font-bold text-blue-700">SADECE OKUMA ERİŞİMİ GEREKLİ</AlertTitle>
                    <AlertDescription className="text-[10px] text-blue-800/80 leading-relaxed mt-1">
                      Güvenliğiniz için Service Account'a sadece <strong>Viewer</strong> veya <strong>Security Reviewer</strong> rolleri atayın.
                      Owner/Editor yetkisine ihtiyacımız yoktur.
                    </AlertDescription>
                  </Alert>
                   <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="gcp-key" className="text-xs font-mono font-medium tracking-wide text-muted-foreground">SERVICE ACCOUNT JSON</Label>
                            <textarea 
                                id="gcp-key" 
                                placeholder='{ "type": "service_account", "project_id": "...", ... }' 
                                className="font-mono bg-background border border-border/80 focus-visible:ring-primary rounded-lg min-h-[120px] p-3 text-xs resize-y"
                                value={gcpForm.serviceAccountJson}
                                onChange={(e) => setGcpForm({...gcpForm, serviceAccountJson: e.target.value})}
                            />
                             <p className="text-[10px] text-muted-foreground">
                                Paste the full content of your Service Account JSON key file here.
                            </p>
                        </div>
                   </div>
                    <Button 
                    className="w-full h-12 bg-yellow-600 text-white hover:bg-yellow-700 font-mono rounded-lg tracking-wide text-xs shadow-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed" 
                    disabled={loading || (isLimitReached && !checkingLimits)}
                    onClick={() => handleConnect('gcp', gcpForm)}
                   >
                     {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Cloud className="mr-2 h-4 w-4" />}
                     GCP BAĞLAN
                   </Button>
                </>
               )}
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

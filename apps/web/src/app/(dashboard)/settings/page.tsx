"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Loader2 } from "lucide-react";
import { auth } from "@/lib/api";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await auth.getProfile();
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) {
     return <div className="flex h-[50vh] items-center justify-center text-sm font-mono text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        AYARLAR YÜKLENİYOR...
     </div>
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border/60 pb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground font-mono">Sistem Ayarları</h1>
          <p className="text-sm text-muted-foreground font-mono">
            Yapılandırma & Kullanıcı Tercihleri
          </p>
        </div>
        <Button className="h-10 bg-primary text-primary-foreground font-mono text-xs font-semibold tracking-wide hover:bg-primary/90 rounded-lg shadow-sm">
            <Save className="mr-2 h-3.5 w-3.5" />
            Değişiklikleri Kaydet
        </Button>
      </div>

      <div className="grid gap-8">
         {/* Profile Section */}
         <div className="border border-border bg-card p-8 rounded-xl shadow-sm">
             <div className="mb-6">
                 <h2 className="text-lg font-bold text-foreground font-mono tracking-tight">Kullanıcı Profili</h2>
                 <p className="text-sm text-muted-foreground font-mono mt-1">Hesap bilgilerinizi yönetin.</p>
             </div>
             
             <div className="grid gap-6 max-w-xl">
                 <div className="grid gap-2">
                     <Label className="text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">Ad Soyad</Label>
                     <Input 
                        className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11" 
                        defaultValue={user?.name || ""} 
                        placeholder="Adınızı giriniz"
                     />
                 </div>
                  <div className="grid gap-2">
                     <Label className="text-xs font-semibold font-mono text-muted-foreground uppercase tracking-wide">E-posta Adresi</Label>
                     <Input 
                        className="font-mono bg-background border-border/80 focus-visible:ring-primary rounded-lg h-11" 
                        defaultValue={user?.email || ""} 
                        disabled 
                     />
                 </div>
             </div>
         </div>

         {/* Notifications Section */}
         <div className="border border-border bg-card p-8 rounded-xl shadow-sm">
             <div className="mb-6">
                 <h2 className="text-lg font-bold text-foreground font-mono tracking-tight">Bildirimler</h2>
                 <p className="text-sm text-muted-foreground font-mono mt-1">Uyarı tercihlerini yapılandırın.</p>
             </div>
             
             <div className="space-y-6">
                 <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                         <Label className="text-sm font-bold font-mono text-foreground">E-posta Bildirimleri</Label>
                         <p className="text-xs text-muted-foreground font-mono">Günlük özetleri e-posta ile alın.</p>
                     </div>
                     <Switch />
                 </div>
                 <div className="flex items-center justify-between">
                     <div className="space-y-0.5">
                         <Label className="text-sm font-bold font-mono text-foreground">Kritik Zafiyet Uyarıları</Label>
                         <p className="text-xs text-muted-foreground font-mono">Yüksek riskli bulgular için anlık bildirim.</p>
                     </div>
                     <Switch defaultChecked />
                 </div>
             </div>
         </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { CreditCard, Check, Shield, Zap, Lock, Key, Globe, PlayCircle, LayoutTemplate, FileText, Server, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { payment, auth } from "@/lib/api";
import { useRouter, useSearchParams } from "next/navigation";

const GUMROAD_CORE_URL = "https://gumroad.com/l/kivvat-core";
const GUMROAD_PRO_URL = "https://gumroad.com/l/kivvat-pro";

export default function BillingPage() {
  const [loading, setLoading] = useState(false);
  const [activating, setActivating] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [licenseKey, setLicenseKey] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await auth.getProfile();
      setUserInfo(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!licenseKey) return;
    setActivating(true);
    try {
      await payment.activate(licenseKey);
      alert("Lisans başarıyla aktif edildi! PRO özelliklere erişebilirsiniz.");
      setLicenseKey("");
      // Refresh profile to update plan UI
      fetchProfile();
      router.refresh(); 
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || "Lisans doğrulanamadı.");
    } finally {
      setActivating(false);
    }
  };

  /* Expiration Logic */
  const expiresAt = userInfo?.licenseExpiresAt ? new Date(userInfo.licenseExpiresAt) : null;
  const daysRemaining = expiresAt ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const isExpired = daysRemaining <= 0;
  const isPro = (userInfo?.plan === "CORE" || userInfo?.plan === "PRO" || userInfo?.plan === "ENTERPRISE") && !isExpired;

  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  return (
    <div className="space-y-8">
      {reason === 'upgrade_required' && (
        <div className="bg-destructive/15 text-destructive border border-destructive/20 p-4 rounded-lg flex items-center gap-3 animate-in slide-in-from-top-2">
            <Lock className="h-5 w-5" />
            <div>
                <h4 className="font-bold text-sm font-mono uppercase tracking-wider">Erişim Reddedildi</h4>
                <p className="text-xs font-mono">Panel özelliklerini kullanmak için lütfen geçerli bir lisans aktifleştirin veya satın alın.</p>
            </div>
        </div>
      )}

      <div>
        <h2 className="text-3xl font-bold tracking-tight font-mono">Faturalandırma & Lisans</h2>
        <p className="text-muted-foreground font-mono text-sm">Abonelik durumunuzu ve ödeme geçmişinizi yönetin.</p>
      </div>

      {/* Current Plan Status */}
      <Card className={`border-l-4 ${isPro ? 'border-l-primary/50' : 'border-l-destructive/50'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
                <CardTitle className="text-lg font-mono flex items-center gap-2">
                    Mevcut Plan
                    {isExpired && userInfo?.plan === "PRO" && <Badge variant="destructive" className="text-[10px]">SÜRESİ DOLDU</Badge>}
                </CardTitle>
                <CardDescription className="font-mono text-xs">
                    {isPro 
                        ? `Lisansınız ${expiresAt?.toLocaleDateString('tr-TR')} tarihinde sona erecek.` 
                        : "Ücretsiz plan kullanıyorsunuz veya lisans süreniz doldu."}
                </CardDescription>
            </div>
            <div className="text-right">
                <Badge variant={isPro ? "default" : "secondary"} className="font-mono text-sm px-3 py-1">
                {isPro ? "PRO" : "FREE"}
                </Badge>
                {isPro && (
                    <div className="text-[10px] text-muted-foreground font-mono mt-1">
                        {daysRemaining} Gün Kaldı
                    </div>
                )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* License Activation (Show if FREE key or EXPIRED) */}
      {(!isPro || isExpired) && (
        <Card className={isExpired ? "border-destructive/30 bg-destructive/5" : ""}>
          <CardHeader>
            <CardTitle className="text-lg font-mono flex items-center gap-2">
                <Key className="h-5 w-5 text-primary" />
                {isExpired ? "Lisans Yenileme" : "Lisans Anahtarı Aktivasyonu"}
            </CardTitle>
            <CardDescription className="font-mono text-xs">
              {isExpired 
                ? "Mevcut lisansınızın süresi doldu. Devam etmek için yeni bir anahtar girin." 
                : "Gumroad üzerinden satın aldığınız lisans anahtarını girerek üyeliğinizi yükseltin."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-center">
              <Input 
                placeholder="XXXX-XXXX-XXXX-XXXX" 
                value={licenseKey} 
                onChange={(e) => setLicenseKey(e.target.value)}
                className="font-mono max-w-md" 
              />
              <Button onClick={handleActivate} disabled={activating || !licenseKey} className="font-mono">
                {activating ? "Doğrulanıyor..." : "Aktif Et (+30 Gün)"}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono ml-1">
                * DEMO için anahtar: <span className="text-foreground font-bold">PRO-DEMO-KEY</span> (Mevcut sürenize 30 gün ekler)
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6 pt-4">
        {/* PLAN 1: COMPLIANCE CORE */}
        <Card className={`flex flex-col h-full transition-all ${userInfo?.plan === 'CORE' ? 'opacity-60 grayscale scale-95 border-primary/50' : 'hover:border-primary/50'}`}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">GİRİŞ SEVİYESİ</div>
                    {userInfo?.plan === 'CORE' && <Badge variant="secondary" className="text-[10px]">MEVCUT</Badge>}
                </div>
                <CardTitle className="font-mono text-xl">COMPLIANCE CORE</CardTitle>
                <CardDescription className="font-mono text-xs mt-1">Küçük ölçekli ajanslar ve start-uplar için.</CardDescription>
                <div className="text-3xl font-bold font-mono mt-4">$199 <span className="text-sm font-normal text-muted-foreground">/ay</span></div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs flex-1">
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Tek Standart (KVKK veya GDPR)</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> 1 Bulut Hesabı Bağlantısı</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Temel Varlık Envanteri</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Politika Yönetimi & İmza</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> Otomatik Tarama (Günlük)</div>
            </CardContent>
            <CardFooter>
                 <Button 
                    className="w-full font-mono bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white hover:translate-y-0 transition-colors rounded-none uppercase tracking-wider" 
                    disabled={userInfo?.plan === 'CORE'}
                    onClick={() => window.open(GUMROAD_CORE_URL, "_blank")}
                >
                    {userInfo?.plan === 'CORE' ? "MEVCUT PLAN" : "SEÇ & BAŞLA"}
                 </Button>
            </CardFooter>
        </Card>

        {/* PLAN 2: TRUST ARCHITECT (Popular) - Maps to PRO */}
        <Card className={`flex flex-col h-full relative shadow-md transition-all ${userInfo?.plan === 'PRO' ? 'opacity-60 grayscale scale-95 border-primary shadow-none bg-background' : 'border-primary bg-primary/5 hover:shadow-lg'}`}>
            {userInfo?.plan !== 'PRO' && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-[9px] font-bold font-mono tracking-wider uppercase">
                    EN ÇOK TERCİH EDİLEN
                </div>
            )}
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="font-mono text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ORTA ÖLÇEK</div>
                    {userInfo?.plan === 'PRO' && <Badge variant="default" className="text-[10px]">MEVCUT</Badge>}
                </div>
                <CardTitle className="font-mono text-xl text-primary">TRUST ARCHITECT</CardTitle>
                <CardDescription className="font-mono text-xs mt-1">Yurt dışına iş yapan SaaS şirketleri için.</CardDescription>
                <div className="text-3xl font-bold font-mono mt-4">$499 <span className="text-sm font-normal text-muted-foreground">/ay</span></div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs flex-1">
                <div className="flex items-center gap-2 font-bold"><Globe className="h-4 w-4 text-primary" /> 3 Bulut Hesabı (AWS/Azure)</div>
                <div className="flex items-center gap-2 font-bold"><Shield className="h-4 w-4 text-primary" /> 3 Uyumluluk Standardı</div>
                <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-primary" /> Olay Yönetimi (Incidents)</div>
                <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-primary" /> Tedarikçi Yönetimi (Vendors)</div>
                <div className="flex items-center gap-2"><Check className="h-4 w-4 text-primary" /> SSL/TLS Sertifika Takibi</div>
                <div className="pl-6 text-muted-foreground">+ Tüm Core Özellikleri</div>
            </CardContent>
            <CardFooter>
                 <Button 
                    className="w-full font-mono bg-primary text-white hover:bg-primary/90 hover:translate-y-0 transition-colors rounded-none uppercase tracking-wider"
                    disabled={userInfo?.plan === 'PRO'}
                    onClick={() => window.open(GUMROAD_PRO_URL, "_blank")}
                >
                    {userInfo?.plan === 'PRO' ? "MEVCUT PLAN" : "SEÇ & BAŞLA"}
                </Button>
            </CardFooter>
        </Card>

        {/* PLAN 3: TOTAL AUTHORITY - Maps to ENTERPRISE */}
        <Card className={`flex flex-col h-full transition-all ${userInfo?.plan === 'ENTERPRISE' ? 'opacity-60 grayscale scale-95 border-primary/50' : 'hover:border-primary/50'}`}>
            <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                    <div className="font-mono text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">KURUMSAL</div>
                    {userInfo?.plan === 'ENTERPRISE' && <Badge variant="secondary" className="text-[10px]">MEVCUT</Badge>}
                </div>
                <CardTitle className="font-mono text-xl">TOTAL AUTHORITY</CardTitle>
                <CardDescription className="font-mono text-xs mt-1">Büyük şirketler ve holdingler için.</CardDescription>
                <div className="text-3xl font-bold font-mono mt-4">$1,199 <span className="text-sm font-normal text-muted-foreground">/ay</span></div>
            </CardHeader>
            <CardContent className="space-y-3 font-mono text-xs flex-1">
                <div className="flex items-center gap-2"><Globe className="h-4 w-4 text-primary" /> Sınırsız Bulut Hesabı</div>
                <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-primary" /> Sınırsız Standart</div>
                <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-primary" /> Denetçi Portalı (Audit Share)</div>
                <div className="flex items-center gap-2"><LayoutTemplate className="h-4 w-4 text-primary" /> Öncelikli 7/24 Destek</div>
                <div className="flex items-center gap-2"><Server className="h-4 w-4 text-primary" /> Özel Sözleşme & Fatura</div>
            </CardContent>
            <CardFooter>
                 <Button 
                    className="w-full font-mono bg-white text-neutral-900 border-2 border-neutral-900 hover:bg-neutral-900 hover:text-white hover:translate-y-0 transition-colors rounded-none uppercase tracking-wider" 
                    disabled={userInfo?.plan === 'ENTERPRISE'}
                    onClick={() => window.open("mailto:sales@kivvat.com", "_blank")}
                >
                    {userInfo?.plan === 'ENTERPRISE' ? "MEVCUT PLAN" : "SEÇ & BAŞLA"}
                 </Button>
            </CardFooter>
        </Card>
      </div>
      
      {/* SPECIAL SOLUTION: FAST TRACK */}
      <FastTrackCard />
    </div>
  );
}

function FastTrackCard() {
    const shineRef = useRef(null);
    const router = useRouter();
    
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(shineRef.current, 
                { x: "-100%" }, 
                { 
                    x: "200%", 
                    duration: 1.5, 
                    ease: "power2.inOut", 
                    repeat: -1, 
                    repeatDelay: 3 
                }
            );
        });
        return () => ctx.revert();
    }, []);

    return (
        <div className="max-w-4xl mx-auto mt-12 border-t border-border/50 pt-12">
            <div className="bg-[#0b0b0b] border border-[#252525] p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden group hover:border-[#444] transition-colors rounded-none shadow-2xl">
                 
                 {/* Shine Effect */}
                 <div ref={shineRef} className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-[-20deg] pointer-events-none z-0" />

                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                 <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-[#e7e6d9] text-[#0b0b0b] px-3 py-1 text-[10px] font-bold tracking-widest uppercase font-mono">ÖZEL ÇÖZÜM</span>
                        <span className="text-xs font-bold text-primary tracking-widest uppercase font-mono">PROJE BAZLI</span>
                    </div>
                    <h3 className="text-3xl font-bold text-[#e7e6d9] mb-4 font-mono">CERTIFICATION FAST-TRACK</h3>
                    <p className="text-[#888] mb-6 text-lg leading-relaxed font-mono text-sm">
                        Abonelik yerine acil belgeye mi ihtiyacınız var? 90 gün içinde denetime hazır hale gelme garantili hızlandırılmış paket.
                    </p>
                    <ul className="grid sm:grid-cols-2 gap-3">
                        <li className="flex items-center text-xs text-[#e7e6d9] font-medium font-mono">
                            <Check className="h-3 w-3 text-primary mr-2" />
                            90 Gün Garanti
                        </li>
                        <li className="flex items-center text-xs text-[#e7e6d9] font-medium font-mono">
                            <Check className="h-3 w-3 text-primary mr-2" />
                            Uzman Destekli Gap Analizi
                        </li>
                        <li className="flex items-center text-xs text-[#e7e6d9] font-medium font-mono">
                            <Check className="h-3 w-3 text-primary mr-2" />
                            Otomatik Kanıt Paketleme
                        </li>
                        <li className="flex items-center text-xs text-[#e7e6d9] font-medium font-mono">
                            <Check className="h-3 w-3 text-primary mr-2" />
                            Tek Seferlik Ödeme
                        </li>
                    </ul>
                 </div>

                 <div className="flex flex-col items-center flex-shrink-0 relative z-10">
                    <div className="text-center mb-6">
                        <span className="block text-4xl font-bold text-[#e7e6d9] font-mono">$2,900</span>
                        <span className="text-xs text-[#888] uppercase tracking-wider font-mono">Tek Seferlik / 3 Ay Erişim</span>
                    </div>
                    <Button className="h-14 px-8 bg-[#e7e6d9] text-[#0b0b0b] hover:bg-white font-mono uppercase tracking-widest text-xs w-full" onClick={() => router.push('/contact')}>
                        HIZLI BAŞVURU
                    </Button>
                 </div>
            </div>
        </div>
    );
}

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-sm mx-auto w-full">
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter text-neutral-900 font-mono">
            GİRİŞ_YAP
        </h2>
        <p className="text-neutral-500 text-xs font-mono">
            Güvenli konsol erişimi için kimlik doğrulayın.
        </p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">E-Posta Adresi</Label>
            <Input id="email" type="email" placeholder="isim@sirket.com" className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
        </div>

        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Şifre</Label>
                <Link href="#" className="text-[10px] text-primary hover:text-primary/80 font-mono underline-offset-4 hover:underline">ŞİFRE_SIFIRLA?</Link>
            </div>
            <Input id="password" type="password" className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
        </div>

        <Link href="/dashboard" className="block w-full pt-2"> 
            {/* Direct link to dashboard for demo purposes */}
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-mono uppercase tracking-widest rounded-none text-xs border border-transparent hover:border-primary-foreground/20 transition-all">
                SİSTEME_BAĞLAN
            </Button>
        </Link>
      </div>

      <div className="pt-6 border-t border-neutral-100 text-center">
        <p className="text-xs font-mono text-neutral-400">
            HESABINIZ YOK MU?{" "}
            <Link href="/register" className="text-neutral-900 font-bold hover:text-primary transition-colors ml-1">
                KAYIT_OL
            </Link>
        </p>
      </div>

    </div>
  );
}

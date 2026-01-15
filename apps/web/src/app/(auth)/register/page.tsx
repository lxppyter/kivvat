import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-sm mx-auto w-full">
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold tracking-tighter text-neutral-900 font-mono">
            KAYIT_OL
        </h2>
        <p className="text-neutral-500 text-xs font-mono">
            Saniyeler içinde güvenli çalışma alanı oluşturun.
        </p>
      </div>

      <div className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Ad Soyad</Label>
                <Input id="name" placeholder="Ahmet Yılmaz" className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="company" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Şirket</Label>
                <Input id="company" placeholder="Kivvat A.Ş." className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">İş E-Postası</Label>
            <Input id="email" type="email" placeholder="isim@sirket.com" className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Parola</Label>
            <Input id="password" type="password" className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
            <p className="text-[10px] text-neutral-400 font-mono">Minimum 8 karakter, 1 sembol.</p>
        </div>

        <Link href="/dashboard" className="block w-full pt-2">
            <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-mono uppercase tracking-widest rounded-none text-xs border border-transparent hover:border-primary-foreground/20 transition-all">
                ERİŞİMİ_BAŞLAT
            </Button>
        </Link>
      </div>

      <div className="pt-6 border-t border-neutral-100 text-center">
        <p className="text-xs font-mono text-neutral-400">
            ZATEN HESABINIZ VAR MI?{" "}
            <Link href="/login" className="text-neutral-900 font-bold hover:text-primary transition-colors ml-1">
                GİRİŞ_YAP
            </Link>
        </p>
      </div>

    </div>
  );
}

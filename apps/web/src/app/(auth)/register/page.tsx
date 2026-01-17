"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          company_name: formData.company,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Registration failed");
      }

      router.push("/login"); // Redirect to login on success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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

      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="name" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Ad Soyad</Label>
                <Input id="name" value={formData.name} onChange={handleChange} placeholder="Ahmet Yılmaz" required className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
            </div>
            <div className="space-y-2">
                <Label htmlFor="company" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Şirket</Label>
                <Input id="company" value={formData.company} onChange={handleChange} placeholder="Kivvat A.Ş." className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
            </div>
        </div>

        <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">İş E-Postası</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} placeholder="isim@sirket.com" required className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
        </div>

        <div className="space-y-2">
            <Label htmlFor="password" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Parola</Label>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required minLength={8} className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
            <p className="text-[10px] text-neutral-400 font-mono">Minimum 8 karakter, 1 sembol.</p>
        </div>

        {error && (
            <div className="text-red-500 text-xs font-mono">{error}</div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-mono uppercase tracking-widest rounded-none text-xs border border-transparent hover:border-primary-foreground/20 transition-all">
            {isLoading ? "KAYDEDİLİYOR..." : "ERİŞİMİ_BAŞLAT"}
        </Button>
      </form>

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

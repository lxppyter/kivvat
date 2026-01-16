"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter(); 
  const [formData, setFormData] = useState({
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
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        // Handle 401 Unauthorized specifically if needed, or generic error
        const data = await res.json();
        throw new Error(data.message || "Login failed");
      }

      const data = await res.json();
      if (data.access_token) {
        Cookies.set("token", data.access_token, { expires: 1/96 }); // 15 mins
        if (data.refresh_token) {
          Cookies.set("refresh_token", data.refresh_token, { expires: 7 }); // 7 days
        }
      }

      // Login successful
      // For now, we just redirect to dashboard.
      router.push("/dashboard"); 
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
            GİRİŞ_YAP
        </h2>
        <p className="text-neutral-500 text-xs font-mono">
            Güvenli konsol erişimi için kimlik doğrulayın.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <Label htmlFor="email" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">E-Posta Adresi</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required placeholder="isim@sirket.com" className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
        </div>

        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <Label htmlFor="password" className="font-mono text-[10px] uppercase text-neutral-400 tracking-widest">Şifre</Label>
                <Link href="#" className="text-[10px] text-primary hover:text-primary/80 font-mono underline-offset-4 hover:underline">ŞİFRE_SIFIRLA?</Link>
            </div>
            <Input id="password" type="password" value={formData.password} onChange={handleChange} required className="h-12 rounded-none border-neutral-200 bg-neutral-50 focus:bg-white focus:border-primary focus:ring-0 font-mono text-sm" />
        </div>

        {error && (
            <div className="text-red-500 text-xs font-mono">{error}</div>
        )}

        <Button type="submit" disabled={isLoading} className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-mono uppercase tracking-widest rounded-none text-xs border border-transparent hover:border-primary-foreground/20 transition-all">
            {isLoading ? "BAĞLANILIYOR..." : "SİSTEME_BAĞLAN"}
        </Button>
      </form>

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

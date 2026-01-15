"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react"; // Assuming Shield icon comes from lucide-react

export function LandingNavbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <Shield className="h-6 w-6 text-primary" />
          <span className="text-lg font-bold tracking-tight text-neutral-900">Kivvat</span>
          <span className="mono-badge text-xs text-neutral-400 ml-2 group-hover:text-primary transition-colors hidden sm:inline-block">/ GÜVENLİK_KONSOLU</span>
        </Link>
        <div className="flex items-center gap-8">

            <Link href="/login" className="text-sm font-bold text-neutral-900 hover:text-primary transition-colors uppercase tracking-wider font-mono">
                GİRİŞ
            </Link>
            <Link href="/register">
                 <Button size="sm" className="rounded-none bg-primary hover:bg-primary/90 text-white font-mono text-xs uppercase tracking-widest px-6 h-10 border border-transparent">
                    KAYIT_OL
                </Button>
            </Link>
        </div>
      </div>
    </nav>
  );
}

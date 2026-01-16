"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ShieldCheck, ListCheck, FileText, Settings, Shield, Link as LinkIcon, LogOut, Database, ScrollText } from "lucide-react";
import { cn } from "@/lib/utils";
import { auth } from "@/lib/api";
import Cookies from "js-cookie";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await auth.getProfile();
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user profile", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-border bg-background/50 backdrop-blur-xl z-40 print:hidden">
      <div className="flex h-16 items-center px-6 border-b border-border/50">
        <Shield className="h-5 w-5 text-primary mr-2.5" />
        <span className="text-lg font-bold tracking-tight text-foreground font-mono">
          KIVVAT_OS
        </span>
      </div>

      <div className="flex flex-col gap-1 p-4 mb-auto">
        {[
          { icon: LayoutDashboard, label: "Genel Bakış", href: "/dashboard" },
          { icon: Database, label: "Varlıklar", href: "/assets" },
          { icon: ScrollText, label: "Politikalar", href: "/policies" },
          { icon: FileText, label: "Raporlar", href: "/reports" },
          { icon: LinkIcon, label: "Bağlantı", href: "/connection" },
          { icon: ListCheck, label: "Görevler", href: "/tasks" },
          { icon: ShieldCheck, label: "Uyumluluk", href: "/compliance" },
          { icon: Settings, label: "Ayarlar", href: "/settings" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-mono font-medium transition-all tracking-wide",
              "text-muted-foreground hover:bg-muted hover:text-foreground",
              pathname === item.href && "bg-muted text-foreground font-bold shadow-sm"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="absolute bottom-6 left-0 w-full px-4">
        <div className="flex items-center gap-3 p-3 bg-card border border-border/60 rounded-xl shadow-sm hover:border-border transition-colors group cursor-pointer">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 text-primary font-bold font-mono text-xs">
            {user ? (user.name ? user.name.slice(0, 2).toUpperCase() : user.email.slice(0, 2).toUpperCase()) : 'TR'}
          </div>
          <div className="flex flex-col flex-1 overflow-hidden">
            <span className="text-sm font-bold text-foreground font-mono truncate">
                {user ? (user.companyName || user.name || user.email.split('@')[0]) : 'Yükleniyor...'}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono truncate">
                {user?.subscription?.plan || 'PLAN: FREE TRIAL'}
            </span>
          </div>
          <button onClick={handleLogout} className="text-muted-foreground hover:text-destructive transition-colors" title="Çıkış Yap">
             <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

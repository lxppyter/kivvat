"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Settings, Shield, Link as LinkIcon, ShieldCheck, ListCheck, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
// UI Components
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navigation = [
  { name: "Genel Bakış", href: "/dashboard", icon: LayoutDashboard },
  { name: "Raporlar", href: "/reports", icon: FileText },
  { name: "Bağlantı", href: "/connection", icon: LinkIcon },
  { name: "Görevler", href: "/tasks", icon: ListCheck },
  { name: "Uyumluluk", href: "/compliance", icon: ShieldCheck },
  { name: "Ayarlar", href: "/settings", icon: Settings },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 sm:px-8">
          {/* Logo Section */}
          <div className="flex items-center gap-2 mr-8">
            <Shield className="h-6 w-6 text-primary" />
            <span className="text-lg font-bold tracking-tight text-foreground font-mono">
              KIVVAT_OS
            </span>
          </div>

          {/* Navigation Items (Tabs) */}
          <nav className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors rounded-md whitespace-nowrap",
                    isActive
                      ? "bg-muted text-foreground font-semibold"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4 ml-auto">
             <Button variant="ghost" size="icon" className="text-muted-foreground">
                <Bell className="h-5 w-5" />
             </Button>
             <div className="h-8 w-px bg-border/60 mx-1" />
             <div className="flex items-center gap-3">
                 <div className="hidden md:flex flex-col items-end">
                     <span className="text-sm font-bold text-foreground">Admin User</span>
                     <span className="text-[10px] text-muted-foreground">Sistem Yöneticisi</span>
                 </div>
                 <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src="/avatars/01.png" alt="@admin" />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">AU</AvatarFallback>
                 </Avatar>
             </div>
          </div>
        </div>
      </div>
    </header>
  );
}

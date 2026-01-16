"use client";

import { useEffect, useState } from "react";
import { Bell, Search, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { auth } from "@/lib/api";

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string; email: string } | null>(null);

  useEffect(() => {
    auth.getProfile()
      .then((res) => setUser(res.data))
      .catch(() => {
        // Silent fail or redirect to login if critical
      });
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("refresh_token");
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-border bg-background/80 px-6 backdrop-blur-xl">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
             type="text"
             placeholder="Komut ara..."
             className="h-9 w-64 rounded-md border border-input bg-background pl-9 pr-4 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
        </Button>
        
        <div className="flex items-center gap-4 pl-4 border-l border-border">
          <div className="flex flex-col items-end hidden md:flex">
            <span className="text-sm font-medium leading-none">
              {user?.name || user?.email || "Yükleniyor..."}
            </span>
            <span className="text-xs text-muted-foreground">Operatör</span>
          </div>
          
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center border border-border">
             <User className="h-4 w-4 text-muted-foreground" />
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleLogout}
            className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            title="Çıkış Yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}

"use client";

import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

import { ShareDialog } from "@/components/audit/share-dialog";
import Cookies from "js-cookie";

export function Header() {
  const [isAuditor, setIsAuditor] = useState(false);

  useEffect(() => {
     setIsAuditor(Cookies.get("user_role") === "AUDITOR");
  }, []);

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
        {!isAuditor && <ShareDialog />}
      </div>
    </header>
  );
}

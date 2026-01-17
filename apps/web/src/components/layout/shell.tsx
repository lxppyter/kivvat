"use client";
import { useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { toast } from "sonner";
import { Header } from "@/components/layout/header";
import { cn } from "@/lib/utils";
import { AuditorBanner } from "@/components/audit/auditor-banner";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  
  useEffect(() => {
      let isToasting = false;
      const handleAccessDenied = () => {
          if (isToasting) return;
          isToasting = true;
          
          toast.error("Erişim Reddedildi 🔒", {
              description: "Erişim izniniz iptal edilmiş veya süresi dolmuş. Giriş sayfasına yönlendiriliyorsunuz...",
              duration: 4000
          });

          setTimeout(() => { isToasting = false; }, 4500);
      };

      window.addEventListener("access_denied", handleAccessDenied);
      return () => window.removeEventListener("access_denied", handleAccessDenied);
  }, []);

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased text-sm flex-col">
       <AuditorBanner />
       <div className="flex flex-1">
          <Sidebar />
          <div className="flex-1 ml-64 flex flex-col">
            <Header />
            <main className={cn("flex-1 overflow-y-auto p-8 md:p-12", className)} {...props}>
                <div className="mx-auto max-w-6xl space-y-8">
                    {children}
                </div>
            </main>
          </div>
       </div>
    </div>
  );
}

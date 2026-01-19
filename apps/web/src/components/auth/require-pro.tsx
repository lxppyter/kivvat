"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/api';
import { Loader2, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function RequirePro({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    checkPlan();
  }, []);

  const checkPlan = async () => {
    try {
      const res = await auth.getProfile();
      const user = res.data;
      
      if (user.plan === 'PRO' || user.plan === 'ENTERPRISE') {
          setIsAllowed(true);
      } else {
          // Block
          setIsAllowed(false);
      }
    } catch (error) {
      console.error("Plan check failed", error);
      setIsAllowed(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      return (
        <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
  }

  if (!isAllowed) {
      return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in fade-in zoom-in duration-500">
              <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center">
                  <Lock className="h-10 w-10 text-muted-foreground" />
              </div>
              <div className="space-y-2 max-w-md">
                  <h2 className="text-2xl font-bold font-mono">Erişim Kısıtlı</h2>
                  <p className="text-muted-foreground text-sm font-mono leading-relaxed">
                      Bu özellik (Olay/Tedarikçi Yönetimi) sadece <strong>TRUST ARCHITECT</strong> ve <strong>TOTAL AUTHORITY</strong> planlarında mevcuttur.
                  </p>
              </div>
              <Link href="/settings/billing">
                  <Button className="font-mono">Paketi Yükselt</Button>
              </Link>
          </div>
      );
  }

  return <>{children}</>;
}

"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { auth } from '@/lib/api';

export default function RequireSubscription({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, [pathname]);

  const checkSubscription = async () => {
    try {
      // Allow access to billing page always
      if (pathname === '/settings/billing' || pathname === '/settings/profile') {
        setIsAllowed(true);
        setLoading(false);
        return;
      }

      const res = await auth.getProfile();
      const user = res.data;
      
      const expiresAt = user.licenseExpiresAt ? new Date(user.licenseExpiresAt) : null;
      const daysRemaining = expiresAt ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
      const isExpired = daysRemaining <= 0;
      
      // Strict Check: FREE or EXPIRED -> Block
      if (user.plan === 'FREE' || isExpired) {
          router.push('/settings/billing?reason=upgrade_required');
          return;
      }

      setIsAllowed(true);
    } catch (error) {
      console.error("Subscription check failed", error);
      // On error (e.g. 401), maybe redirect to login? 
      // Or let the AuthGuard handle it. For now, block.
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
      // Optional: Loading spinner
      return <div className="flex h-screen items-center justify-center font-mono text-xs">Authenticating...</div>;
  }

  return isAllowed ? <>{children}</> : null;
}

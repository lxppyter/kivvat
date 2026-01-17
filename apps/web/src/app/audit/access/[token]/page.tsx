"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { audit } from "@/lib/api";
import Cookies from "js-cookie";
import { Loader2, ShieldCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AuditAccessPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const token = params.token as string;
    if (!token) {
        setStatus('error');
        return;
    }

    // Attempt to exchange token for access
    audit.access(token)
        .then((res) => {
            const { access_token, user } = res.data;
            
            // Set Cookies
            Cookies.set("token", access_token, { expires: 1/12 }); // 2 hours
            Cookies.set("user_role", user.role); // For UI logic
            
            setStatus('success');
            
            // Redirect after short delay
            setTimeout(() => {
                router.push("/dashboard");
            }, 1000);
        })
        .catch((err) => {
            console.error(err);
            setStatus('error');
            setErrorMsg(err.response?.data?.message || "Geçersiz veya süresi dolmuş bağlantı.");
        });
  }, [params, router]);

  return (
    <div className="min-h-screen grid place-items-center bg-zinc-950 text-white font-mono">
        <div className="max-w-md w-full p-8 border border-zinc-800 rounded-lg bg-zinc-900/50 backdrop-blur text-center space-y-6">
            
            {status === 'loading' && (
                <>
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500" />
                    <h2 className="text-xl font-bold">Denetim Erişimi Doğrulanıyor...</h2>
                    <p className="text-zinc-400 text-sm">Lütfen güvenli bağlantı kurulurken bekleyiniz.</p>
                </>
            )}

            {status === 'success' && (
                <>
                    <ShieldCheck className="h-16 w-16 mx-auto text-green-500 animate-in zoom-in duration-300" />
                    <h2 className="text-xl font-bold text-green-400">Erişim Onaylandı</h2>
                    <p className="text-zinc-400 text-sm">Dashboard'a yönlendiriliyorsunuz...</p>
                </>
            )}

            {status === 'error' && (
                <>
                    <XCircle className="h-16 w-16 mx-auto text-red-500" />
                    <h2 className="text-xl font-bold text-red-400">Erişim Reddedildi</h2>
                    <p className="text-zinc-400 text-sm">{errorMsg}</p>
                    <Button variant="outline" className="mt-4" onClick={() => router.push('/login')}>
                        Giriş Sayfasına Dön
                    </Button>
                </>
            )}

        </div>
    </div>
  );
}

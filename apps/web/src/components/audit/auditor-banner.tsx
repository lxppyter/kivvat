"use client";

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Eye } from "lucide-react";

export function AuditorBanner() {
    const [isAuditor, setIsAuditor] = useState(false);
    useEffect(() => {
        setIsAuditor(Cookies.get("user_role") === "AUDITOR");
    }, []);

    if (!isAuditor) return null;

    return (
        <div className="bg-amber-600 text-white px-4 py-2 text-center text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-2">
            <Eye className="h-4 w-4" />
            Auditor Mode: Read-Only Access Active
        </div>
    );
}

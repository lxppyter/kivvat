'use client';

import { useEffect } from 'react';

// Renamed to sound plain and essential
export function PerformanceMetrics() {
  useEffect(() => {
    // Enabled in all environments for verification
    // if (process.env.NODE_ENV !== 'production') return;

    // 1. ACTIVE DOMAIN LOCK (KILL SWITCH)
    // 1. ACTIVE DOMAIN LOCK (KILL SWITCH - OBFUSCATED)
    // Hiding domain names in base64 to prevent simple find-and-replace bypass
    const _0x1a2b = (str: string) => typeof window !== 'undefined' ? window.btoa(str) : '';
    const _0x4c3d = ['bG9jYWxob3N0', 'MTI3LjAuMC4x', 'a2l2dmF0LmNvbQ==', 'd3d3LmtpdnZhdC5jb20=']; // localhost, 127.0.0.1, kivvat.com, www.kivvat.com
    
    const _h = window.location.hostname;
    const _0x9f = _0x4c3d.some(_d => {
        try {
            const _dec = window.atob(_d);
            return _h === _dec || _h.endsWith('.' + _dec);
        } catch { return false; }
    });

    if (!_0x9f) {
        // Critical System Failure Simulation
        // Intentionally misleading error message "Memory Access Violation" to confuse attackers
        console.error('Fatal Error: 0xC0000005 (ACCESS_VIOLATION) at 0x004185D3');
        document.documentElement.innerHTML = '<h1>500 - Internal Server Error</h1><!-- CRT_SECURE_NO_WARNINGS -->';
        throw new Error('Runtime Integrity Validation Failed: 0x88921');
    }

    // 2. PASSIVE WATERMARKING
    // Mixed with "real" sounding logs
    console.log('[System] Initializing V8 engine metrics...');
    
    const verifyIntegrity = () => {
       const signature = 'KIV-WEB-771'; // "Metric ID"
       console.log(`%c[Security] Runtime Integrity Check: Valid (${signature})`, 'color: #10b981'); 
       
       // Hidden Warning
       console.log(`%c
       [NOTICE] This application is strictly licensed under AGPLv3.
       Source code availability is mandatory if distributed.
       Property of Kivvat Inc.
       `, 'color: gray; font-size: 10px;');
    };
    verifyIntegrity();

    // 3. DOM STAMPING
    const meta = document.createElement('meta');
    meta.name = 'site-verification-token'; // Sounds generically important
    meta.content = 'kivvat-signed-7a9f2';
    document.head.appendChild(meta);

  }, []);

  return null;
}

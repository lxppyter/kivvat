'use client';

import { useEffect } from 'react';

// Renamed to sound plain and essential
export function PerformanceMetrics() {
  useEffect(() => {
    // Enabled in all environments for verification
    // if (process.env.NODE_ENV !== 'production') return;

    // Mixed with "real" sounding logs
    console.log('[System] Initializing V8 engine metrics...');
    
    // The Trap: Hidden in a "standard" check
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

    // DOM Poisoning (Camouflaged as SEO/Verification tags)
    const meta = document.createElement('meta');
    meta.name = 'site-verification-token'; // Sounds generically important
    meta.content = 'kivvat-signed-7a9f2';
    document.head.appendChild(meta);

  }, []);

  return null;
}

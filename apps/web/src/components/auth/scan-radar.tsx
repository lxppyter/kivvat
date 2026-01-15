"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ShieldCheck, Server, Database, Cloud, Lock, AlertTriangle } from "lucide-react";

export function ScanRadar() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const ctx = gsap.context(() => {
        
        // 1. Radar Sweep (Circular or Line)
        // Let's do a "Grid Scan" line moving down
        gsap.to(".scan-line", {
            top: "100%",
            duration: 3,
            repeat: -1,
            ease: "linear",
            opacity: 0,
            yoyo: false // One way scan
        });

        // 2. Random Node Activation
        const nodes = gsap.utils.toArray<HTMLElement>(".scan-node");
        nodes.forEach((node) => {
            gsap.to(node, {
                opacity: 0.8,
                duration: Math.random() * 1 + 0.5,
                repeat: -1,
                yoyo: true,
                delay: Math.random() * 2,
                ease: "power1.inOut"
            });
        });

        // 3. Central Shield Pulse
        gsap.to(".core-shield", {
            scale: 1.1,
            boxShadow: "0 0 30px rgba(13, 148, 136, 0.4)",
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });

        // 4. "Found Issue" Simulation
        // One node turns red briefly then green
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 2 });
        tl.to(".node-warning", { color: "#ef4444", scale: 1.2, duration: 0.5 }) // Turn Red
          .to(".node-warning", { color: "#10b981", scale: 1, duration: 0.5, delay: 1 }); // Turn Green (Fixed)

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full aspect-square bg-[#0b0b0b] border border-[#333] rounded-full relative overflow-hidden shadow-2xl flex items-center justify-center">
        
        {/* Background Grid (Radial) */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: `radial-gradient(#333 1px, transparent 1px)`, backgroundSize: "20px 20px" }}>
        </div>
        
        {/* Rotating Outer Ring */}
        <div className="absolute inset-4 border border-dashed border-[#333] rounded-full animate-spin-slow" style={{ animationDuration: "30s" }} />
        <div className="absolute inset-12 border border-[#222] rounded-full" />
        
        {/* Scanning Line */}
        <div className="scan-line absolute top-0 left-0 w-full h-[2px] bg-primary shadow-[0_0_20px_rgba(13,148,136,0.8)] z-10 opacity-50" />

        {/* Central Core */}
        <div className="core-shield relative z-20 w-32 h-32 bg-[#111] border border-primary/30 rounded-full flex items-center justify-center">
            <ShieldCheck className="w-12 h-12 text-primary core-icon" />
            <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "3s" }} />
        </div>

        {/* Orbiting Nodes (Static layout, opacity animated) */}
        {/* Top Node: Cloud */}
        <div className="scan-node absolute top-16 left-1/2 -translate-x-1/2 bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
             <Cloud className="w-6 h-6 text-sky-400" />
        </div>

        {/* Right Node: DB */}
        <div className="scan-node absolute top-1/2 right-12 -translate-y-1/2 bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
             <Database className="w-6 h-6 text-purple-400" />
        </div>

        {/* Bottom Node: Server (Warning Sim) */}
        <div className="scan-node absolute bottom-16 left-1/2 -translate-x-1/2 bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
             <Server className="node-warning w-6 h-6 text-neutral-400" />
        </div>

        {/* Left Node: Lock */}
        <div className="scan-node absolute top-1/2 left-12 -translate-y-1/2 bg-[#1a1a1a] p-3 rounded-lg border border-[#333]">
             <Lock className="w-6 h-6 text-emerald-400" />
        </div>

        {/* Connecting Lines (Decorative SVG) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-neutral-700">
            <line x1="50%" y1="50%" x2="50%" y2="20%" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="80%" y2="50%" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="50%" y2="80%" strokeWidth="1" />
            <line x1="50%" y1="50%" x2="20%" y2="50%" strokeWidth="1" />
        </svg>

        {/* Status Text */}
        <div className="absolute bottom-8 font-mono text-xs text-primary bg-[#0b0b0b]/80 px-4 py-1 rounded-full border border-primary/20">
            SYSTEM_STATUS: SECURE
        </div>

    </div>
  );
}

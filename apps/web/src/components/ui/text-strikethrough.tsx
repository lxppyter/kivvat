"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextStrikethroughProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  delay?: number;
}

export function TextStrikethrough({ children, className = "", color = "#ef4444", delay = 0.5 }: TextStrikethroughProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
        if (!pathRef.current) return;

        const length = pathRef.current.getTotalLength();
        
        gsap.set(pathRef.current, {
            strokeDasharray: length,
            strokeDashoffset: length,
            opacity: 1
        });

        gsap.to(pathRef.current, {
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%",
            },
            strokeDashoffset: 0,
            duration: 0.6,
            delay: delay,
            ease: "power2.out"
        });

    }, containerRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <span ref={containerRef} className={`relative inline-block ${className}`}>
      <span className="relative z-0">{children}</span>
      <svg
        className="absolute top-1/2 left-0 w-[110%] h-[120%] -translate-y-1/2 -translate-x-[5%] pointer-events-none z-10 opacity-80"
        viewBox="0 0 100 20"
        preserveAspectRatio="none"
        fill="none"
      >
        {/* A messy scribble path */}
        <path
          ref={pathRef}
          d="M0 10 C 20 5, 40 15, 100 10 M 90 12 C 70 18, 10 5, 5 10 M 5 12 C 30 15, 60 5, 95 12"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0 }}
        />
      </svg>
    </span>
  );
}

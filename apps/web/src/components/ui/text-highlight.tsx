"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextHighlightProps {
  children: React.ReactNode;
  className?: string;
  color?: string;
  delay?: number;
}

export function TextHighlight({ children, className = "", color = "#6236f4", delay = 0 }: TextHighlightProps) {
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
        duration: 1.2,
        delay: delay,
        ease: "power3.out"
      });

    }, containerRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <span ref={containerRef} className={`relative inline-block whitespace-nowrap ${className}`}>
      <span className="relative z-10">{children}</span>
      <svg
        className="absolute -bottom-2 left-0 w-full h-[0.6em] -z-0 pointer-events-none"
        viewBox="0 0 200 9"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          ref={pathRef}
          d="M2.00025 6.99997C25.3336 4.66663 80.0003 0.333298 198.001 2.49997"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          style={{ opacity: 0 }}
        />
      </svg>
    </span>
  );
}

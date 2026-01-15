"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface TextRotatorProps {
  words: string[];
  className?: string;
  interval?: number;
}

export function TextRotator({ words, className = "", interval = 3000 }: TextRotatorProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const activeIndex = useRef(0);

  useEffect(() => {
    if (words.length <= 1) return;

    const ctx = gsap.context(() => {
        const intervalId = setInterval(() => {
            const nextIndex = (activeIndex.current + 1) % words.length;
            
            const currentEl = containerRef.current?.children[activeIndex.current];
            const nextEl = containerRef.current?.children[nextIndex];

            if (currentEl && nextEl) {
                // Exit current
                gsap.to(currentEl, {
                    y: -20,
                    opacity: 0,
                    duration: 0.5,
                    ease: "power2.in",
                    onComplete: () => {
                        gsap.set(currentEl, { y: 20 }); // reset position for next entry
                    }
                });

                // Enter next
                setTimeout(() => {
                    gsap.fromTo(nextEl, 
                        { y: 20, opacity: 0, display: "inline-block" },
                        { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
                    );
                }, 200); // slight overlap/delay
            }

            activeIndex.current = nextIndex;
        }, interval);

        return () => clearInterval(intervalId);
    }, containerRef);

    return () => ctx.revert();
  }, [words, interval]);

  return (
    <span ref={containerRef} className={`relative inline-flex flex-col h-[1em] overflow-hidden ${className} min-w-[3ch] align-top`}>
      {words.map((word, idx) => (
        <span 
            key={idx} 
            className="absolute left-0 top-0 whitespace-nowrap"
            style={{ 
                opacity: idx === 0 ? 1 : 0, 
                transform: idx === 0 ? "translateY(0)" : "translateY(20px)" 
            }}
        >
            {word}
        </span>
      ))}
      <span className="invisible">{words.reduce((a, b) => a.length > b.length ? a : b)}</span> {/* Spacer to keep width */}
    </span>
  );
}

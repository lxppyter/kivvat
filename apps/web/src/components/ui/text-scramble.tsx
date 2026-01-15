"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function TextScramble({ children, className = "" }: { children: string, className?: string }) {
    const elementRef = useRef<HTMLSpanElement>(null);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
    
    useEffect(() => {
        const el = elementRef.current;
        if (!el) return;

        let interval: NodeJS.Timeout;
        const originalText = children;
        
        const scramble = () => {
            let iteration = 0;
            clearInterval(interval);
            
            interval = setInterval(() => {
                el.innerText = originalText
                    .split("")
                    .map((letter, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("");
                
                if (iteration >= originalText.length) { 
                    clearInterval(interval);
                }
                
                iteration += 1 / 3;
            }, 30);
        };

        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: el,
                start: "top 80%",
                onEnter: scramble
            });
        });

        // Also scramble on hover
        el.addEventListener("mouseenter", scramble);

        return () => {
            ctx.revert();
            clearInterval(interval);
            el.removeEventListener("mouseenter", scramble);
        };
    }, [children]);

    return (
        <span ref={elementRef} className={`cursor-default ${className}`}>
            {children}
        </span>
    );
}

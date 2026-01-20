import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "neon" | "destructive" | "link" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer",
          
          // Variants
          variant === "default" &&
            "bg-primary text-primary-foreground hover:bg-primary/90 shadow-none hover:shadow-none hover:translate-y-0 -skew-x-12 rounded-sm",
          variant === "destructive" &&
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
          variant === "outline" &&
            "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
          variant === "secondary" &&
            "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
          variant === "neon" &&
            "bg-transparent border border-secondary text-secondary shadow-[0_0_10px_inset_var(--color-secondary)] hover:bg-secondary hover:text-secondary-foreground hover:shadow-[0_0_20px_var(--color-secondary)]",
          variant === "link" && "text-primary underline-offset-4 hover:underline",

          // Sizes
          size === "default" && "h-11 px-6 py-2",
          size === "sm" && "h-9 rounded-lg px-3",
          size === "lg" && "h-12 rounded-xl px-8 text-base",
          size === "icon" && "h-10 w-10",
          className
        )}
        {...props}
      >
        {variant === "default" ? (
             <span className="skew-x-12 inline-flex items-center justify-center w-full h-full pointer-events-none">
                 {children}
             </span>
        ) : children}
      </button>
    );
  }
);
Button.displayName = "Button";

export { Button };

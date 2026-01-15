"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Custom context for managing state
const AccordionContext = React.createContext<{
  openItems: string[];
  toggleItem: (value: string) => void;
  type: "single" | "multiple";
} | null>(null);

const Accordion = ({
  type = "single",
  collapsible = false,
  defaultValue,
  className,
  children,
  ...props
}: {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string; // Simplification for 'single' default
  className?: string;
  children: React.ReactNode;
}) => {
  const [openItems, setOpenItems] = React.useState<string[]>(
    defaultValue ? [defaultValue] : []
  );

  const toggleItem = (value: string) => {
    setOpenItems((prev) => {
      if (type === "single") {
         if (prev.includes(value)) {
            return collapsible ? [] : [value];
         }
         return [value];
      } else {
        // multiple
        if (prev.includes(value)) return prev.filter((i) => i !== value);
        return [...prev, value];
      }
    });
  };

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem, type }}>
      <div className={cn("space-y-1", className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
};

const AccordionItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => (
   // Pass value to children via context clone? No, simpler to just use composition.
   // We react to context in trigger/content using this value.
  <div ref={ref} className={cn("border-b", className)} data-value={value} {...props}>
     {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            // @ts-ignore
            return React.cloneElement(child, { value });
        }
        return child;
     })}
  </div>
));
AccordionItem.displayName = "AccordionItem";

const AccordionTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionTrigger must be used within Accordion");
  // The 'value' comes from the parent Item via cloneElement if using standard pattern,
  // Or we expect the user to pass it? 
  // Standard shadcn expects Item to wrap it.
  
  // To keep compatible with Shadcn API:
  // The Item needs to provide context or we assume parent had 'value'.
  // Since we don't have a sub-context for Item, we cheat slightly by reading data-attribute or enforcing API.
  // Actually, simpler: Let's assume standard usage `AccordionItem value="foo"> <Trigger>...`
  // We can use a context for the Item too.
  
  return (
    <button
      ref={ref}
      onClick={() => value && context.toggleItem(value)} // Value must be injected
      className={cn(
        "flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn(
          "h-4 w-4 shrink-0 transition-transform duration-200",
          value && context.openItems.includes(value) && "rotate-180"
        )}
      />
    </button>
  );
});
AccordionTrigger.displayName = "AccordionTrigger";

const AccordionContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value?: string }
>(({ className, children, value, ...props }, ref) => {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error("AccordionContent must be used within Accordion");

  const isOpen = value ? context.openItems.includes(value) : false;

  return (
    <AnimatePresence initial={false}>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
          className="overflow-hidden"
        >
          <div ref={ref} className={cn("pb-4 pt-0", className)} {...props}>
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
AccordionContent.displayName = "AccordionContent";

// Helper components to bridge the gap between pure div structure and context
// Re-implementing Item to Provider for cleaner API match with Shadcn
const AccordionItemWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { value: string }
>(({ className, value, children, ...props }, ref) => {
   return (
       <AccordionItemContext.Provider value={{ value }}>
           <div ref={ref} className={cn("border-b", className)} {...props}>
               {children}
           </div>
       </AccordionItemContext.Provider>
   )
});
AccordionItemWrapper.displayName = "AccordionItem";

const AccordionItemContext = React.createContext<{ value: string } | null>(null);

const TriggerWrapper = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, children, ...props }, ref) => {
    const itemContext = React.useContext(AccordionItemContext);
    const rootContext = React.useContext(AccordionContext);
    const isOpen = itemContext && rootContext ? rootContext.openItems.includes(itemContext.value) : false;

    return (
        <button
            ref={ref}
            onClick={() => itemContext && rootContext?.toggleItem(itemContext.value)}
            className={cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline", className)}
            {...props}
        >
            {children}
             <ChevronDown
                className={cn(
                "h-4 w-4 shrink-0 transition-transform duration-200",
                isOpen && "rotate-180"
                )}
            />
        </button>
    )
})
TriggerWrapper.displayName = "AccordionTrigger";

const ContentWrapper = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, children, ...props }, ref) => {
    const itemContext = React.useContext(AccordionItemContext);
    const rootContext = React.useContext(AccordionContext);
    const isOpen = itemContext && rootContext ? rootContext.openItems.includes(itemContext.value) : false;

    return (
        <AnimatePresence initial={false}>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }} // "Lambda" snappy feel
                    className="overflow-hidden"
                >
                    <div ref={ref} className={cn("pb-4 pt-0", className)} {...props}>
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
})
ContentWrapper.displayName = "AccordionContent";

export { Accordion, AccordionItemWrapper as AccordionItem, TriggerWrapper as AccordionTrigger, ContentWrapper as AccordionContent };

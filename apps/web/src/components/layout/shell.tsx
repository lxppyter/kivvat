import { Sidebar } from "@/components/layout/sidebar";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans antialiased text-sm">
      <Sidebar />
      <main className={cn("flex-1 overflow-y-auto p-8 md:p-12", className)} {...props}>
        <div className="mx-auto max-w-6xl space-y-8">
            {children}
        </div>
      </main>
    </div>
  );
}

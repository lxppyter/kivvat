import Link from "next/link";
import { LayoutDashboard, ShieldCheck, ListTodo, FileText, Settings, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { title: "Dashboard", href: "/", icon: LayoutDashboard },
  { title: "Compliance", href: "/compliance", icon: ShieldCheck },
  { title: "Task Manager", href: "/tasks", icon: ListTodo },
  { title: "Reports", href: "/reports", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-white/10 glass bg-background/50 backdrop-blur-xl transition-all">
      <div className="flex h-16 items-center px-6 border-b border-white/10">
        <Shield className="h-8 w-8 text-primary mr-3" />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-heading">
          Kivvat
        </span>
      </div>
      
      <nav className="p-4 space-y-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              "text-muted-foreground hover:text-white hover:bg-white/5",
              item.href === "/" && "bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.title}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-8 left-0 w-full px-6">
        <div className="rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 p-4 border border-white/5">
          <p className="text-xs text-muted-foreground mb-2">System Status</p>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-semibold text-green-500">Operational</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

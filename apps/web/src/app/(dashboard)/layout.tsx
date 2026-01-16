import { Shell } from "@/components/layout/shell";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      <Shell>{children}</Shell>
    </div>
  );
}

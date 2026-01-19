import { Shell } from "@/components/layout/shell";
import RequireSubscription from "@/components/auth/require-subscription";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white min-h-screen text-slate-900">
      <Shell>
        <RequireSubscription>{children}</RequireSubscription>
      </Shell>
    </div>
  );
}

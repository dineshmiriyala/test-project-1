import { AppShell } from "@/components/layout/app-shell";
import { ProtectedRoute } from "@/components/guards/protected-route";

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <AppShell>{children}</AppShell>
    </ProtectedRoute>
  );
}

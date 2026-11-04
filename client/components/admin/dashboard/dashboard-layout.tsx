"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { useSession } from "@/hooks/use-session";
import { adminLoginHref } from "@/lib/admin-routes";
import { ErrorState } from "@/components/feedback/error-state";
import { useAuthStore } from "@/store/auth.store";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useSession();
  const signingOut = useAuthStore((state) => state.isSigningOut);
  useEffect(() => {
    if (!signingOut && !session.isLoading && session.isUnauthorized)
      router.replace(adminLoginHref(pathname));
  }, [session.isLoading, session.isUnauthorized, pathname, router, signingOut]);
  if (signingOut)
    return (
      <main className="grid min-h-dvh place-items-center" role="status">
        Signing out…
      </main>
    );
  if (session.isLoading || session.isUnauthorized)
    return (
      <main className="grid min-h-dvh place-items-center" role="status">
        Verifying admin session…
      </main>
    );
  if (session.isError || !session.isAuthenticated)
    return (
      <main className="mx-auto max-w-xl px-6 py-24">
        <ErrorState
          title="Session could not be verified"
          description="The server may be unavailable. Try again to verify your session."
          onRetry={() => void session.refresh()}
        />
      </main>
    );
  return (
    <div
      className="flex h-dvh w-full overflow-hidden bg-muted/20"
      data-admin-verified
    >
      <DashboardSidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overscroll-y-contain p-4 sm:p-6">
          <div className="flex min-w-0 flex-1 flex-col">{children}</div>
        </main>
      </div>
    </div>
  );
}

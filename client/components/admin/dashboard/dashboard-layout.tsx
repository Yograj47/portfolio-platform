"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { useSession } from "@/hooks/use-session";
import { Skeleton } from "@/components/ui/skeleton";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isLoading, isError } = useSession();

  useEffect(() => {
    if (isError) {
      router.replace("/login");
    }
  }, [isError, router]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-muted/20">
      <DashboardSidebar />

      {/* Main View Container */}
      <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
        <DashboardHeader />

        {/* Bound Main Region to Remaining Vertical Height */}
        <main className="flex flex-1 flex-col min-h-0 overflow-hidden p-6">
          {isLoading ? (
            <div className="flex flex-1 flex-col min-h-0 space-y-6">
              <div className="space-y-2 shrink-0">
                <Skeleton className="h-7 w-48 rounded-lg" />
                <Skeleton className="h-4 w-72 rounded-lg" />
              </div>
              <Skeleton className="flex-1 min-h-0 w-full rounded-xl" />
            </div>
          ) : (
            <div className="flex flex-1 flex-col min-h-0 overflow-hidden">
              {children}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
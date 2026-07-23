"use client";

import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardHeader } from "./dashboard-header";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const router = useRouter();
  const { isLoading, isError } = useSession();

  useEffect(() => {
    if (isError) {
      router.replace("/login")
    }
  }, [isError, router])

  console.log("Loading state:", isLoading)
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }


  return (
    <div className="flex min-h-screen bg-muted/20">
      <DashboardSidebar />

      <div className="flex flex-1 flex-col">
        <DashboardHeader />

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
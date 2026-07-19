import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { Toaster } from "@/components/ui/toaster";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DashboardLayout>
      {children}
      <Toaster />
    </DashboardLayout>
  );
}
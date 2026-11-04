import { LoginGate } from "@/components/admin/login-gate";
import { adminDestination } from "@/lib/admin-routes";
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return (
    <main className="flex min-h-screen items-center justify-center bg-background p-6">
      <LoginGate next={adminDestination(params.next)} />
    </main>
  );
}

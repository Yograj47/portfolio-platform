"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/hooks/use-session";
import { LoginForm } from "@/components/forms/login-form";
import { adminDestination } from "@/lib/admin-routes";
import { useAuthStore } from "@/store/auth.store";
export function LoginGate({ next }: { next: string }) {
  const router = useRouter();
  const session = useSession();
  useEffect(() => {
    useAuthStore.getState().setSigningOut(false);
  }, []);
  useEffect(() => {
    if (!session.isLoading && session.isAuthenticated)
      router.replace(adminDestination(next));
  }, [session.isLoading, session.isAuthenticated, next, router]);
  if (session.isLoading || session.isAuthenticated)
    return <p role="status">Verifying admin session…</p>;
  return (
    <div className="w-full max-w-md space-y-5">
      {session.isError && !session.isUnauthorized && (
        <p role="alert" className="text-sm text-muted-foreground">
          Couldn’t restore a session. You can try signing in below.
        </p>
      )}
      <LoginForm redirectTo={next} />
    </div>
  );
}

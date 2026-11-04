"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useSession() {
  const signingOut = useAuthStore((state) => state.isSigningOut);
  const sessionQuery = useQuery({
    enabled: !signingOut,
    queryKey: ["auth-user"],
    queryFn: async ({ signal }) => {
      const response = await authService.me(signal);
      if (signal.aborted)
        throw new DOMException("Session check cancelled", "AbortError");
      useAuthStore.getState().setUser(response.data.data);
      return response.data.data;
    },
    retry: false,
    networkMode: "always",
    staleTime: 0,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
  });
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  return {
    user: sessionQuery.data ?? null,
    isAuthenticated:
      sessionQuery.isSuccess &&
      sessionQuery.isFetchedAfterMount &&
      authenticated,
    isLoading:
      sessionQuery.isPending ||
      (!sessionQuery.isFetchedAfterMount && !sessionQuery.isError),
    isError: sessionQuery.isError,
    isUnauthorized:
      (axios.isAxiosError(sessionQuery.error) &&
        [401, 403].includes(sessionQuery.error.response?.status ?? 0)) ||
      (sessionQuery.isSuccess &&
        sessionQuery.isFetchedAfterMount &&
        !authenticated),
    refresh: sessionQuery.refetch,
  };
}

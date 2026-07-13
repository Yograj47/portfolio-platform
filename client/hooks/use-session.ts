"use client";

import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useSession() {

    const {
        user,
        isAuthenticated,
        isLoading: authLoading,
        setUser,
    } = useAuthStore();

    const sessionQuery = useQuery({
        queryKey: ["auth-user"],

        queryFn: async () => {
            const response = await authService.me();

            setUser(response.data.data);

            return response.data.data;
        },

        enabled: !isAuthenticated,

        retry: false,
    });

    return {
        user,
        isAuthenticated,
        isLoading:
            authLoading || sessionQuery.isLoading,
        isError: sessionQuery.isError,
        refresh: sessionQuery.refetch,
    };
}
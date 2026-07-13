"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
    const router = useRouter();

    const {
        user,
        isAuthenticated,
        isLoading: authLoading,
        setUser,
        setAccessToken,
        logout: clearAuth,
    } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: authService.login,

        onSuccess: async (response) => {
            setAccessToken(response.data.data.accessToken);

            const me = await authService.me();

            setUser(me.data.data);

            router.replace("/dashboard");
        },
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,

        onSuccess: () => {
            clearAuth();

            router.replace("/login");
        },
    });

    return {
        user,
        isAuthenticated,
        isLoading: authLoading,

        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,

        logout: logoutMutation.mutate,

        loginLoading: loginMutation.isPending,
        logoutLoading: logoutMutation.isPending,
    };
}
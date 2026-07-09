import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";

export function useAuth() {
    const router = useRouter();

    const {
        user,
        isAuthenticated,
        isLoading,
        setUser,
        logout: clearAuth
    } = useAuthStore();

    const loginMutation = useMutation({
        mutationFn: authService.login,

        onSuccess: async () => {
            const response = await authService.me();

            setUser(response.data.data);

            router.push("/dashboard");
        }
    });

    const logoutMutation = useMutation({
        mutationFn: authService.logout,

        onSuccess: () => {
            clearAuth();

            router.push("/login");
        }
    });

    const meQuery = useQuery({
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
            isLoading || meQuery.isLoading,

        login: loginMutation.mutate,
        loginAsync: loginMutation.mutateAsync,

        logout: logoutMutation.mutate,

        loginLoading: loginMutation.isPending,
        logoutLoading: logoutMutation.isPending,
    };
}
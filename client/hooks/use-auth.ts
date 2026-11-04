"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { authService } from "@/services/auth.service";

import { useAuthStore } from "@/store/auth.store";
import { UpdateProfileData } from "@/lib/validations/profile";
import { adminDestination, ADMIN_LOGIN } from "@/lib/admin-routes";
import { showError, showSuccess } from "@/lib/toast";

export function useAuth(redirectTo?: string) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    user,
    isAuthenticated,
    setUser,
    setAccessToken,
    logout: clearAuth,
    setSigningOut,
  } = useAuthStore();

  const loginMutation = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries();
      clearAuth();
      queryClient.removeQueries({
        predicate: (query) => query.queryKey[0] !== "auth-user",
      });
    },
    mutationFn: async (data: { email: string; password: string }) => {
      const response = await authService.login(data);
      setAccessToken(response.data.data.accessToken);
      return (await authService.me()).data.data;
    },
    onSuccess: (profile) => {
      setUser(profile);
      queryClient.setQueryData(["auth-user"], profile);
      router.replace(adminDestination(redirectTo));
    },
    onError: () => {
      clearAuth();
    },
  });

  const logoutMutation = useMutation({
    onMutate: async () => {
      await queryClient.cancelQueries();
      setSigningOut(true);
    },
    mutationFn: authService.logout,

    onSuccess: () => {
      clearAuth();
      queryClient.clear();

      router.replace(ADMIN_LOGIN);
    },
    onError: () => {
      setSigningOut(false);
      showError("Sign-out could not be confirmed. Please try again.");
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => authService.updateProfile(data),

    onSuccess: (response) => {
      setUser(response.data.data);
      void queryClient.invalidateQueries({ queryKey: ["public-profile"] });
      void queryClient.invalidateQueries({ queryKey: ["media"] });
      showSuccess("Profile saved.");
    },
    onError: () =>
      showError("Profile could not be saved. Check the fields and try again."),
  });

  return {
    user,
    isAuthenticated,

    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,

    logout: logoutMutation.mutate,

    updateProfile: updateProfileMutation.mutate,
    updateProfileAsync: updateProfileMutation.mutateAsync,

    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    logoutLoading: logoutMutation.isPending,
    updateProfileLoading: updateProfileMutation.isPending,
  };
}

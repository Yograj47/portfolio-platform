"use client";

import { useQuery } from "@tanstack/react-query";

import { authService } from "@/services/auth.service";

export function usePublicProfile() {
    return useQuery({
        queryKey: ["public-profile"],
        queryFn: async () => {
            const response =
                await authService.profile();

            return response.data.data;
        },
    });
}
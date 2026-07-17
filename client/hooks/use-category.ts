"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { categoryService } from "@/services/category.service";

import type {
    CreateCategorySchema,
    UpdateCategorySchema,
} from "@/lib/validations/category";

export function useCategory() {
    const queryClient = useQueryClient();

    // ======================
    // Queries
    // ======================

    const categoriesQuery = useQuery({
        queryKey: ["categories"],

        queryFn: async () => {
            const response = await categoryService.findAll();
            return response.data.data;
        },
    });

    // ======================
    // Mutations
    // ======================

    const createMutation = useMutation({
        mutationFn: (data: CreateCategorySchema) =>
            categoryService.create(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateCategorySchema;
        }) => categoryService.update(id, data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            categoryService.remove(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },
    });

    // ======================
    // Return API
    // ======================

    return {
        categories: categoriesQuery.data ?? [],

        loading: categoriesQuery.isLoading,
        error: categoriesQuery.isError,

        refetch: categoriesQuery.refetch,

        createCategory: createMutation.mutate,
        createCategoryAsync: createMutation.mutateAsync,

        updateCategory: updateMutation.mutate,
        updateCategoryAsync: updateMutation.mutateAsync,

        deleteCategory: deleteMutation.mutate,
        deleteCategoryAsync: deleteMutation.mutateAsync,

        creating: createMutation.isPending,
        updating: updateMutation.isPending,
        deleting: deleteMutation.isPending,
    };
}
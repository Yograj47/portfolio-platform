"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { categoryService } from "@/services/category.service";

import {
    CreateCategorySchema,
    UpdateCategorySchema,
} from "@/lib/validations/category";

import {
    showError,
    showSuccess,
} from "@/lib/toast";

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
            showSuccess("Category created.");

            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },

        onError: () => {
            showError("Failed to create category.");
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
            showSuccess("Category updated.");

            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },

        onError: () => {
            showError("Failed to update category.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            categoryService.remove(id),

        onSuccess: () => {
            showSuccess("Category deleted.");

            queryClient.invalidateQueries({
                queryKey: ["categories"],
            });
        },

        onError: () => {
            showError("Failed to delete category.");
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
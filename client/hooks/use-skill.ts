"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { skillService } from "@/services/skill.service";

import {
    CreateSkillSchema,
    UpdateSkillSchema,
} from "@/lib/validations/skill";

import {
    showSuccess,
    showError,
} from "@/lib/toast";

export function useSkill() {
    const queryClient = useQueryClient();

    const skillsQuery = useQuery({
        queryKey: ["skills"],
        queryFn: async () => {
            const response = await skillService.findAll();
            return response.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateSkillSchema) =>
            skillService.create(data),

        onSuccess: () => {
            showSuccess("Skill created.");

            queryClient.invalidateQueries({
                queryKey: ["skills"],
            });
        },

        onError: () => {
            showError("Failed to create skill.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateSkillSchema;
        }) => skillService.update(id, data),

        onSuccess: () => {
            showSuccess("Skill updated.");

            queryClient.invalidateQueries({
                queryKey: ["skills"],
            });
        },

        onError: () => {
            showError("Failed to update skill.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            skillService.remove(id),

        onSuccess: () => {
            showSuccess("Skill deleted.");

            queryClient.invalidateQueries({
                queryKey: ["skills"],
            });
        },

        onError: () => {
            showError("Failed to delete skill.");
        },
    });

    return {
        skills: skillsQuery.data ?? [],

        loading: skillsQuery.isLoading,
        error: skillsQuery.isError,

        refetch: skillsQuery.refetch,

        createSkill: createMutation.mutate,
        createSkillAsync: createMutation.mutateAsync,

        updateSkill: updateMutation.mutate,
        updateSkillAsync: updateMutation.mutateAsync,

        deleteSkill: deleteMutation.mutate,
        deleteSkillAsync: deleteMutation.mutateAsync,

        creating: createMutation.isPending,
        updating: updateMutation.isPending,
        deleting: deleteMutation.isPending,
    };
}
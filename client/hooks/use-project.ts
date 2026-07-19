"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { projectService } from "@/services/project.service";

import {
    CreateProjectSchema,
    UpdateProjectSchema,
} from "@/lib/validations/project";

import {
    showSuccess,
    showError,
} from "@/lib/toast";

export function useProject() {
    const queryClient = useQueryClient();

    const projectsQuery = useQuery({
        queryKey: ["projects"],
        queryFn: async () => {
            const response = await projectService.findAll();
            return response.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateProjectSchema) =>
            projectService.create(data),

        onSuccess: () => {
            showSuccess("Project created.");

            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },

        onError: () => {
            showError("Failed to create project.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateProjectSchema;
        }) => projectService.update(id, data),

        onSuccess: () => {
            showSuccess("Project updated.");

            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },

        onError: () => {
            showError("Failed to update project.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            projectService.remove(id),

        onSuccess: () => {
            showSuccess("Project deleted.");

            queryClient.invalidateQueries({
                queryKey: ["projects"],
            });
        },

        onError: () => {
            showError("Failed to delete project.");
        },
    });

    return {
        projects: projectsQuery.data ?? [],

        loading: projectsQuery.isLoading,
        error: projectsQuery.isError,

        refetch: projectsQuery.refetch,

        createProject: createMutation.mutate,
        createProjectAsync: createMutation.mutateAsync,

        updateProject: updateMutation.mutate,
        updateProjectAsync: updateMutation.mutateAsync,

        deleteProject: deleteMutation.mutate,
        deleteProjectAsync: deleteMutation.mutateAsync,

        creating: createMutation.isPending,
        updating: updateMutation.isPending,
        deleting: deleteMutation.isPending,
    };
}
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
    projectMediaService,
    type CreateProjectMediaData,
    type UpdateProjectMediaData,
    type ProjectMedia,
} from "@/services/project-media.service";
import { showError, showSuccess } from "@/lib/toast";

export const PROJECT_MEDIA_QUERY_KEYS = {
    all: ["project-media"] as const,
    byProject: (projectId: string) =>
        ["project-media", "project", projectId] as const,
    detail: (id: string) => ["project-media", id] as const,
};

interface UpdateProjectMediaInput {
    id: string;
    data: UpdateProjectMediaData;
}

export type ReorderMediaItem = {
    id: string;
    displayOrder: number;
};

export function useProjectMedia(projectId?: string) {
    const queryClient = useQueryClient();

    // Fetch media for a specific project
    const projectMediaListQuery = useQuery({
        queryKey: PROJECT_MEDIA_QUERY_KEYS.byProject(projectId ?? ""),
        queryFn: async () => {
            if (!projectId) return [];
            const response = await projectMediaService.findAll(projectId);
            return response.data.data;
        },
        enabled: Boolean(projectId),
    });

    // Attach Media to Project
    const attachMutation = useMutation<ProjectMedia, Error, CreateProjectMediaData>({
        mutationFn: async (data) => {
            const response = await projectMediaService.create(data);
            return response.data.data;
        },
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: PROJECT_MEDIA_QUERY_KEYS.byProject(variables.projectId),
            });
            queryClient.invalidateQueries({ queryKey: ["media"] });
            showSuccess("Media attached to project successfully.");
        },
        onError: (error) => {
            showError(error.message || "Failed to attach media to project.");
        },
    });

    // Update Single Project Media (e.g. Set Cover)
    const updateMutation = useMutation<ProjectMedia, Error, UpdateProjectMediaInput>({
        mutationFn: async ({ id, data }) => {
            const response = await projectMediaService.update(id, data);
            return response.data.data;
        },
        onSuccess: (updatedItem) => {
            queryClient.invalidateQueries({
                queryKey: PROJECT_MEDIA_QUERY_KEYS.byProject(updatedItem.projectId),
            });
            showSuccess("Project media updated successfully.");
        },
        onError: () => {
            showError("Failed to update project media.");
        },
    });

    // Batch Reorder Media
    const reorderMutation = useMutation<ProjectMedia[], Error, ReorderMediaItem[]>({
        mutationFn: async (items) => {
            const results = await Promise.all(
                items.map((item) =>
                    projectMediaService.update(item.id, { displayOrder: item.displayOrder })
                )
            );
            return results.map((res) => res.data.data);
        },
        onSuccess: () => {
            if (projectId) {
                queryClient.invalidateQueries({
                    queryKey: PROJECT_MEDIA_QUERY_KEYS.byProject(projectId),
                });
            }
        },
        onError: () => {
            showError("Failed to reorder images.");
        },
    });

    // Restore Project Media
    const restoreMutation = useMutation<ProjectMedia, Error, string>({
        mutationFn: async (id: string) => {
            const response = await projectMediaService.restore(id);
            return response.data.data;
        },
        onSuccess: (restoredItem) => {
            queryClient.invalidateQueries({
                queryKey: PROJECT_MEDIA_QUERY_KEYS.byProject(restoredItem.projectId),
            });
            showSuccess("Project media restored successfully.");
        },
        onError: () => {
            showError("Failed to restore project media.");
        },
    });

    // Remove / Detach Media
    const removeMutation = useMutation<ProjectMedia, Error, string>({
        mutationFn: async (id: string) => {
            const response = await projectMediaService.remove(id);
            return response.data.data;
        },
        onSuccess: (removedItem) => {
            queryClient.invalidateQueries({
                queryKey: PROJECT_MEDIA_QUERY_KEYS.byProject(removedItem.projectId),
            });
            queryClient.invalidateQueries({ queryKey: ["media"] });
            showSuccess("Project media detached successfully.");
        },
        onError: () => {
            showError("Failed to detach project media.");
        },
    });

    return {
        // List Query
        projectMedia: projectMediaListQuery.data ?? [],
        loading: projectMediaListQuery.isLoading,
        loadingProjectMedia: projectMediaListQuery.isLoading,
        projectMediaError: projectMediaListQuery.isError,
        refetchProjectMedia: projectMediaListQuery.refetch,

        // Attach
        attachMedia: attachMutation.mutate,
        attachMediaAsync: attachMutation.mutateAsync,
        attaching: attachMutation.isPending,

        // Update
        updateProjectMedia: updateMutation.mutate,
        updateProjectMediaAsync: updateMutation.mutateAsync,
        updating: updateMutation.isPending,

        // Reorder
        reorderMedia: reorderMutation.mutate,
        reorderMediaAsync: reorderMutation.mutateAsync,
        reordering: reorderMutation.isPending,

        // Restore
        restoreProjectMedia: restoreMutation.mutate,
        restoreProjectMediaAsync: restoreMutation.mutateAsync,
        restoring: restoreMutation.isPending,

        // Remove / Detach
        removeMedia: removeMutation.mutate,
        removeMediaAsync: removeMutation.mutateAsync,
        removeProjectMedia: removeMutation.mutate,
        removeProjectMediaAsync: removeMutation.mutateAsync,
        removing: removeMutation.isPending,
    };
}
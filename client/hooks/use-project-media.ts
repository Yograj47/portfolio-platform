"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import {
    projectMediaService,
    type CreateProjectMediaData,
    type UpdateProjectMediaData,
} from "@/services/project-media.service";

import {
    showError,
    showSuccess,
} from "@/lib/toast";

export function useProjectMedia(
    projectId: string,
) {
    const queryClient = useQueryClient();

    const projectMediaQuery = useQuery({
        queryKey: ["project-media", projectId],
        queryFn: async () => {
            const response =
                await projectMediaService.findAll(
                    projectId,
                );

            return response.data.data;
        },
        enabled: !!projectId,
    });

    const invalidate = () => {
        queryClient.invalidateQueries({
            queryKey: ["project-media", projectId],
        });
    };

    const createMutation = useMutation({
        mutationFn: (
            data: CreateProjectMediaData,
        ) => projectMediaService.create(data),

        onSuccess: () => {
            showSuccess(
                "Image attached to project.",
            );
            invalidate();
        },

        onError: () => {
            showError(
                "Failed to attach image.",
            );
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateProjectMediaData;
        }) =>
            projectMediaService.update(
                id,
                data,
            ),

        onSuccess: () => {
            invalidate();
        },

        onError: () => {
            showError(
                "Failed to update project image.",
            );
        },
    });

    const reorderMutation = useMutation({
        mutationFn: (items: { id: string; displayOrder: number }[]) =>
            Promise.all(
                items.map((item) =>
                    projectMediaService.update(item.id, { displayOrder: item.displayOrder })
                )
            ),
        onSuccess: () => {
            invalidate();
        },
        onError: () => {
            showError("Failed to update image order.");
        },
    });

    const removeMutation = useMutation({
        mutationFn: (id: string) =>
            projectMediaService.remove(id),

        onSuccess: () => {
            showSuccess(
                "Image removed from project.",
            );
            invalidate();
        },

        onError: () => {
            showError(
                "Failed to remove project image.",
            );
        },
    });

    return {
        projectMedia:
            projectMediaQuery.data ?? [],

        loading: projectMediaQuery.isLoading,
        error: projectMediaQuery.isError,

        refetch: projectMediaQuery.refetch,

        attachMedia: createMutation.mutate,
        attachMediaAsync:
            createMutation.mutateAsync,

        updateProjectMedia:
            updateMutation.mutate,
        updateProjectMediaAsync:
            updateMutation.mutateAsync,

        reorderMedia: reorderMutation.mutate,
        reorderMediaAsync: reorderMutation.mutateAsync,
        reordering: reorderMutation.isPending,

        removeMedia: removeMutation.mutate,
        removeMediaAsync:
            removeMutation.mutateAsync,

        attaching: createMutation.isPending,
        updating: updateMutation.isPending,
        removing: removeMutation.isPending,
    };
}
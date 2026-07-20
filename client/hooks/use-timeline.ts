"use client";

import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { timelineService } from "@/services/timeline.service";

import {
    CreateTimelineSchema,
    UpdateTimelineSchema,
} from "@/lib/validations/timeline";

import {
    showSuccess,
    showError,
} from "@/lib/toast";

export function useTimeline() {
    const queryClient = useQueryClient();

    const timelinesQuery = useQuery({
        queryKey: ["timelines"],
        queryFn: async () => {
            const response = await timelineService.findAll();
            return response.data.data;
        },
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateTimelineSchema) =>
            timelineService.create(data),

        onSuccess: () => {
            showSuccess("Timeline created.");

            queryClient.invalidateQueries({
                queryKey: ["timelines"],
            });
        },

        onError: () => {
            showError("Failed to create timeline.");
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string;
            data: UpdateTimelineSchema;
        }) => timelineService.update(id, data),

        onSuccess: () => {
            showSuccess("Timeline updated.");

            queryClient.invalidateQueries({
                queryKey: ["timelines"],
            });
        },

        onError: () => {
            showError("Failed to update timeline.");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) =>
            timelineService.remove(id),

        onSuccess: () => {
            showSuccess("Timeline deleted.");

            queryClient.invalidateQueries({
                queryKey: ["timelines"],
            });
        },

        onError: () => {
            showError("Failed to delete timeline.");
        },
    });

    return {
        timelines: timelinesQuery.data ?? [],

        loading: timelinesQuery.isLoading,
        error: timelinesQuery.isError,

        refetch: timelinesQuery.refetch,

        createTimeline: createMutation.mutate,
        createTimelineAsync: createMutation.mutateAsync,

        updateTimeline: updateMutation.mutate,
        updateTimelineAsync: updateMutation.mutateAsync,

        deleteTimeline: deleteMutation.mutate,
        deleteTimelineAsync: deleteMutation.mutateAsync,

        creating: createMutation.isPending,
        updating: updateMutation.isPending,
        deleting: deleteMutation.isPending,
    };
}
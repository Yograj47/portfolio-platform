"use client";

import { useQuery } from "@tanstack/react-query";

import { projectService } from "@/services/project.service";

export function usePublicProject(id: string) {
    const projectQuery = useQuery({
        queryKey: ["public-project", id],

        queryFn: async () => {
            const response =
                await projectService.findOne(id);

            return response.data.data;
        },

        enabled: !!id,
    });

    return {
        project: projectQuery.data,

        loading: projectQuery.isLoading,
        error: projectQuery.isError,

        refetch: projectQuery.refetch,
    };
}
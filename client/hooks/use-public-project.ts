"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";

export function usePublicProject(slug: string) {
    const [cachedId, setCachedId] = useState<string | null>(null);

    // Sync sessionStorage into React state on mount
    useEffect(() => {
        if (slug) {
            const id = sessionStorage.getItem(`project_id_${slug}`);
            if (id) setCachedId(id);
        }
    }, [slug]);

    // Fallback query if no cached ID in sessionStorage
    const listQuery = useQuery({
        queryKey: ["public-projects"],
        queryFn: async () => {
            const res = await projectService.findAll();
            return res.data?.data ?? res.data ?? [];
        },
        enabled: !cachedId && Boolean(slug),
    });

    const resolvedId =
        cachedId ||
        listQuery.data?.find((p: { slug: string; id: string }) => p.slug === slug)
            ?.id ||
        "";

    // Fetch project details
    const projectQuery = useQuery({
        queryKey: ["public-project", resolvedId],
        queryFn: async () => {
            const res = await projectService.findOne(resolvedId);
            return res.data?.data ?? res.data;
        },
        enabled: Boolean(resolvedId),
    });

    return {
        project: projectQuery.data,
        loading: (!cachedId && listQuery.isLoading) || projectQuery.isLoading,
        error: listQuery.isError || projectQuery.isError,
        refetch: projectQuery.refetch,
    };
}
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";

function getStorageId(slug: string): string | null {
    if (typeof window === "undefined" || !slug) return null;
    return sessionStorage.getItem(`project_id_${slug}`);
}

export function usePublicProject(slug: string) {
    const [prevSlug, setPrevSlug] = useState(slug);
    const [cachedId, setCachedId] = useState<string | null>(() => getStorageId(slug));

    // Sync cachedId during render when slug changes (avoids Effect cascading renders)
    if (slug !== prevSlug) {
        setPrevSlug(slug);
        setCachedId(getStorageId(slug));
    }

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
"use client";
import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
export function usePublicProject(slug: string) {
  const query = useQuery({
    queryKey: ["public-project", slug],
    retry: false,
    queryFn: async ({ signal }) =>
      (await projectService.findBySlug(slug, signal)).data.data,
    enabled: Boolean(slug),
  });
  return {
    project: query.data,
    loading: query.isLoading,
    error: query.isError,
    refetch: query.refetch,
  };
}

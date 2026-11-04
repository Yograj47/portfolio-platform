"use client";

import { useQuery } from "@tanstack/react-query";
import { projectService } from "@/services/project.service";
import type { Project } from "@/types/portfolio";

interface UsePublicProjectsProps {
  category?: string;
  featured?: boolean;
}

export function usePublicProjects({
  category,
  featured,
}: UsePublicProjectsProps = {}) {
  const projectsQuery = useQuery({
    queryKey: ["public-projects"],

    retry: false,
    queryFn: async ({ signal }) => {
      const response = await projectService.findAll(signal);

      return response.data.data;
    },
    select: (allProjects) => {
      let projects = allProjects;

      if (featured !== undefined) {
        projects = projects.filter(
          (project: Project) => project.featured === featured,
        );
      }

      if (category) {
        projects = projects.filter(
          (project: Project) =>
            project.category?.id === category ||
            project.category?.slug === category,
        );
      }

      return projects;
    },
  });

  return {
    projects: projectsQuery.data ?? [],
    loading: projectsQuery.isLoading,
    error: projectsQuery.isError,
    refetch: projectsQuery.refetch,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";

import { projectService } from "@/services/project.service";

interface UsePublicProjectsProps {
    category?: string;
    featured?: boolean;
}

export function usePublicProjects({
    category,
    featured,
}: UsePublicProjectsProps = {}) {
    const projectsQuery = useQuery({
        queryKey: [
            "public-projects",
            category,
            featured,
        ],

        queryFn: async () => {
            const response = await projectService.findAll();

            let projects = response.data.data;

            if (featured !== undefined) {
                projects = projects.filter(
                    (project: any) => project.featured === featured
                );
            }

            if (category) {
                projects = projects.filter(
                    (project: any) =>
                        project.category?.id === category ||
                        project.category?.slug === category
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
"use client";

import { ErrorState } from "@/components/feedback/error-state";
import { useState } from "react";

import { usePublicProjects } from "@/hooks/use-public-projects";
import { usePublicCategories } from "@/hooks/use-public-categories";
import { ProjectFilter } from "./project-filter";
import { ProjectGrid } from "./project-grid";
import { ProjectEmpty } from "./project-empty";
import { ProjectsSkeleton } from "./projects-skeleton";

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = usePublicCategories();
  const {
    projects,
    loading: projectsLoading,
    error,
    refetch,
  } = usePublicProjects({
    category: selectedCategory ?? undefined,
  });

  if (error || categoriesError)
    return (
      <ErrorState
        description="Projects could not be loaded. The server may be unavailable. Please try again."
        onRetry={() => {
          void refetch();
          void refetchCategories();
        }}
      />
    );

  if (projectsLoading || categoriesLoading) {
    return <ProjectsSkeleton />;
  }

  return (
    <section className="space-y-8">
      <div className="flex items-center justify-end border-b pb-6">
        <ProjectFilter
          categories={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
      </div>

      {projects.length ? (
        <ProjectGrid projects={projects} />
      ) : (
        <ProjectEmpty onReset={() => setSelectedCategory(null)} />
      )}
    </section>
  );
}

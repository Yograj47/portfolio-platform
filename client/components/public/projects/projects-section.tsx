"use client";

import { useState } from "react";

import { usePublicProjects } from "@/hooks/use-public-projects";
import { usePublicCategories } from "@/hooks/use-public-categories";

import { ProjectsHeader } from "./projects-header";
import { ProjectFilter } from "./project-filter";
import { ProjectGrid } from "./project-grid";
import { ProjectEmpty } from "./project-empty";
import { ProjectSkeleton } from "./project-skeleton";

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] =
    useState<string | null>(null);

  const {
    categories,
    loading: categoriesLoading,
  } = usePublicCategories();

  const {
    projects,
    loading: projectsLoading,
  } = usePublicProjects({
    category: selectedCategory ?? undefined,
  });

  if (projectsLoading || categoriesLoading) {
    return <ProjectSkeleton />;
  }

  return (
    <section className="space-y-8">
      <ProjectsHeader />

      <ProjectFilter
        categories={categories}
        selected={selectedCategory}
        onChange={setSelectedCategory}
      />

      {projects.length ? (
        <ProjectGrid
          projects={projects}
        />
      ) : (
        <ProjectEmpty />
      )}
    </section>
  );
}
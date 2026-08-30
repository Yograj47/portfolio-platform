"use client";

import { useState } from "react";

import { usePublicProjects } from "@/hooks/use-public-projects";
import { usePublicCategories } from "@/hooks/use-public-categories";
import { ProjectFilter } from "./project-filter";
import { ProjectGrid } from "./project-grid";
import { ProjectEmpty } from "./project-empty";
import { ProjectsSkeleton } from "./projects-skeleton";

export function ProjectsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const { categories, loading: categoriesLoading } = usePublicCategories();
  const { projects, loading: projectsLoading } = usePublicProjects({
    category: selectedCategory ?? undefined,
  });

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
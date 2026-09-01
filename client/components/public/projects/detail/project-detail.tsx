"use client";

import { usePublicProject } from "@/hooks/use-public-project";
import { ProjectGallery } from "./project-gallery";
import { ProjectHero } from "./project-hero";
import { ProjectContent } from "./project-content";
import { ProjectDetailSkeleton } from "./project-detail-skeleton";

interface ProjectDetailProps {
  slug: string;
}

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const { project, loading, error } = usePublicProject(slug);

  if (loading) {
    return <ProjectDetailSkeleton />;
  }

  if (error || !project) {
    return (
      <div className="p-8 text-center text-destructive">
        Failed to load project details.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-12 py-4">
      {/* 1. Side-by-Side Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery Preview (Left) */}
        <div className="lg:col-span-7">
          <ProjectGallery mediaList={project.media} />
        </div>

        {/* Product / Project Details & Actions (Right) */}
        <div className="lg:col-span-5">
          <ProjectHero
            title={project.title}
            excerpt={project.excerpt}
            category={project.category}
            isFeatured={project.isFeatured}
            liveUrl={project.liveUrl}
            githubUrl={project.githubUrl}
            technologies={project.technologies}
          />
        </div>
      </div>

      {/* 2. Detailed Body / Architecture Article Section */}
      <div className="pt-8 border-t border-border/60">
        <ProjectContent
          overview={project.overview}
          description={project.description}
        />
      </div>
    </div>
  );
}
"use client";

import {
  ExternalLink,
} from "lucide-react";

import { FaGithub } from "react-icons/fa6";

import { Badge } from "@/components/ui/badge";

import { usePublicProject } from "@/hooks/use-public-project";

import { ProjectSkeleton } from "./project-skeleton";

interface ProjectDetailProps {
  id: string;
}

export function ProjectDetail({
  id,
}: ProjectDetailProps) {
  const {
    project,
    loading,
  } = usePublicProject(id);

  if (loading) {
    return <ProjectSkeleton />;
  }

  if (!project) {
    return (
      <div className="rounded-md border py-20 text-center">
        <h2 className="text-xl font-semibold">
          Project not found
        </h2>

        <p className="mt-2 text-muted-foreground">
          The requested project does not exist.
        </p>
      </div>
    );
  }

  return (
    <article className="space-y-10">
      <header className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="outline">
            {project.category.name}
          </Badge>

          {project.featured && (
            <Badge>
              Featured
            </Badge>
          )}
        </div>

        <h1 className="text-4xl font-bold tracking-tight">
          {project.title}
        </h1>

        <p className="max-w-3xl text-lg text-muted-foreground">
          {project.excerpt}
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="font-mono text-lg font-semibold">
          Description
        </h2>

        <div className="prose prose-invert max-w-none whitespace-pre-wrap">
          {project.description}
        </div>
      </section>

      <section className="flex flex-wrap gap-4">
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted"
          >
            <FaGithub className="size-4" />
            Source Code
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-md border px-4 py-2 hover:bg-muted"
          >
            <ExternalLink className="size-4" />
            Live Demo
          </a>
        )}
      </section>
    </article>
  );
}
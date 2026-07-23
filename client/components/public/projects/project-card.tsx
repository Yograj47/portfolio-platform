import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import { FaGithub } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";

import type { Project } from "@/components/project/project-columns";

interface ProjectCardProps {
  project: Project;
}

export function ProjectCard({
  project,
}: ProjectCardProps) {
  return (
    <article className="flex h-full flex-col rounded-md border p-6 transition-colors hover:bg-muted/30">
      <div className="mb-5 flex items-start justify-between gap-4">
        <Badge variant="outline">
          {project.category.name}
        </Badge>

        {project.featured && (
          <Badge>
            Featured
          </Badge>
        )}
      </div>

      <div className="flex-1 space-y-4">
        <h3 className="text-2xl font-semibold">
          {project.title}
        </h3>

        <p className="line-clamp-3 text-muted-foreground">
          {project.excerpt}
        </p>
      </div>

      <div className="mt-8 flex items-center gap-5">
        <Link
          href={`/projects/${project.id}`}
          className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary"
        >
          Open Project

          <ArrowUpRight className="size-4" />
        </Link>

        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <FaGithub className="size-4" />

            Source
          </a>
        )}

        {project.liveUrl && (
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="size-4" />

            Live
          </a>
        )}
      </div>
    </article>
  );
}
import Link from "next/link";
import { ArrowUpRight, ExternalLink, Image as ImageIcon, Sparkles } from "lucide-react";
import { FaGithub } from "react-icons/fa6";

import { Badge } from "@/components/ui/badge";
import { PublicProject } from "@/lib/validations/project";
import Image from "next/image";

interface ProjectCardProps {
  project: PublicProject;
}

export function ProjectCard({ project }: ProjectCardProps) {
  const coverMedia =
    project.media?.find((m) => m.isCover)?.media || project.media?.[0]?.media;
  const mediaCount = project.media?.length ?? 0;

  return (
    <article className="group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5">
      <div>
        {/* Cover Image Container */}
        {/* Cover Image Container */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-muted">
          {coverMedia ? (
            <Image
              src={coverMedia.url}
              alt={coverMedia.alt || project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-linear-to-br from-muted/80 to-muted/30 text-muted-foreground">
              <ImageIcon className="size-8 opacity-40" />
              <span className="text-xs font-medium">No preview available</span>
            </div>
          )}

        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60" />

        {/* Badges */}
        <div className="absolute inset-x-4 top-4 flex items-center justify-between gap-2">
          <Badge
            variant="outline"
            className="rounded-full border-border/60 bg-background/70 px-3 py-1 text-xs font-medium backdrop-blur-md"
          >
            {project.category.name}
          </Badge>

          {project.featured && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-amber-500 backdrop-blur-md">
              <Sparkles className="size-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        {mediaCount > 1 && (
          <div className="absolute bottom-3 right-3 rounded-md border border-white/10 bg-black/50 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md">
            +{mediaCount} photos
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="space-y-2.5 p-6">
        <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors duration-200 group-hover:text-primary sm:text-2xl">
          <Link
            href={`/projects/${project.slug}`}
            onClick={() => {
              sessionStorage.setItem(`project_id_${project.slug}`, project.id);
            }}>
            <span className="absolute inset-0 z-0" />
            {project.title}
          </Link>
        </h3>

        <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
          {project.excerpt}
        </p>
      </div>
    </div>

      {/* Card Actions */ }
  <div className="relative z-10 flex items-center justify-between border-t border-border/40 px-6 py-4">
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => {
        sessionStorage.setItem(`project_id_${project.slug}`, project.id);
      }}
      className="group/link inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-colors hover:text-primary"
    >
      View Project
      <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
    </Link>

    <div className="flex items-center gap-2">
      {project.githubUrl && (
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="View Source Code"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-background hover:text-foreground"
        >
          <FaGithub className="size-4" />
        </a>
      )}

      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Live Demo"
          className="inline-flex size-8 items-center justify-center rounded-lg border border-border/50 bg-background/50 text-muted-foreground transition-colors hover:border-foreground/20 hover:bg-background hover:text-foreground"
        >
          <ExternalLink className="size-4" />
        </a>
      )}
    </div>
  </div>
    </article >
  );
}
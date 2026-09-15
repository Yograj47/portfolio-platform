"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { findEntry, findEntryByPath } from "@/lib/terminal/fileSystem";
import { resolvePath } from "@/lib/terminal/navigation";
import { projectService } from "@/services/project.service";
import { TerminalCommand } from "@/types/terminal.type";
import { PublicProject } from "@/lib/validations/project";
import { TERMINAL_PATHS } from "@/components/public/terminal/workspace/terminal-workspace.type";

function OpenProjectHandler({ slug }: { slug: string }) {
  const { data: projects, isLoading } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const res = await projectService.findAll();
      return (res.data?.data ?? res.data ?? []) as PublicProject[];
    },
  });

  React.useEffect(() => {
    if (!projects || isLoading) return;

    const matchedProject = projects.find(
      (p) =>
        p.slug.toLowerCase() === slug.toLowerCase() ||
        p.title.toLowerCase() === slug.toLowerCase()
    );

    if (matchedProject) {
      sessionStorage.setItem(
        `project_id_${matchedProject.slug}`,
        matchedProject.id
      );
      window.open(`/projects/${matchedProject.slug}`, "_blank", "noopener,noreferrer");
    }
  }, [projects, isLoading, slug]);

  if (isLoading) {
    return (
      <span className="font-mono text-sm text-muted-foreground animate-pulse">
        Opening project &apos;{slug}&apos;...
      </span>
    );
  }

  const matchedProject = projects?.find(
    (p) =>
      p.slug.toLowerCase() === slug.toLowerCase() ||
      p.title.toLowerCase() === slug.toLowerCase()
  );

  if (!matchedProject) {
    return (
      <span className="font-mono text-sm text-destructive">
        open: project &apos;{slug}&apos; not found.
      </span>
    );
  }

  return (
    <span className="font-mono text-sm text-primary">
      Opened /projects/{matchedProject.slug} in a new tab.
    </span>
  );
}

export const openCommand: TerminalCommand = {
  name: "open",
  description: "Open a workspace item, directory, or project in a new tab.",

  execute(args, context) {
    const rawTarget = args.join(" ").trim();

    if (!rawTarget) {
      return {
        output: (
          <span className="text-destructive">
            Missing target.
          </span>
        ),
      };
    }

    // Handle 'open .' inside /Projects or /Blogs
    const target = rawTarget === "." ? context.cwd : rawTarget;

    // 1. Resolve virtual file/directory path relative to context.cwd
    const resolvedPath = resolvePath(context.cwd, target);

    if (resolvedPath) {
      // Check if it matches a root workspace entry (e.g., /Projects, /Blogs, Skills.db)
      const entry = findEntryByPath(resolvedPath) || findEntry(target);

      if (entry && entry.route) {
        window.open(entry.route, "_blank", "noopener,noreferrer");
        return {
          output: (
            <span className="text-primary">
              Opened {entry.route} in a new tab.
            </span>
          ),
        };
      }
    }

    // 2. Resolve dynamic project targets (supports absolute & relative project paths)
    const cleanTarget = target.toLowerCase().replace(/^\/+|\/+$/g, "");
    const isAtProjectsDir = context.cwd === TERMINAL_PATHS.PROJECTS;
    const projectPrefixRegex = /^projects?\//i;

    let projectSlug = "";

    if (isAtProjectsDir) {
      projectSlug = cleanTarget.replace(projectPrefixRegex, "");
    } else if (projectPrefixRegex.test(cleanTarget)) {
      projectSlug = cleanTarget.replace(projectPrefixRegex, "");
    } else {
      return {
        output: (
          <span className="text-destructive">
            open: {rawTarget} not found.
          </span>
        ),
      };
    }

    return {
      output: <OpenProjectHandler slug={projectSlug} />,
    };
  },
};
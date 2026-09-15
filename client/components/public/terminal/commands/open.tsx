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
        output: <span className="text-destructive">Missing target.</span>,
      };
    }

    // 1. Resolve '.' to current working directory
    const target = rawTarget === "." ? context.cwd : rawTarget;

    // 2. Try static Virtual File System resolution first (e.g. 'open .', 'open /blogs', 'open Skills.db')
    const resolvedPath = resolvePath(context.cwd, target);

    if (resolvedPath) {
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

    // 3. Normalize relative/absolute paths for dynamic project routes
    //    E.g., '../project/grocerypro' from '/Blog' resolves via path logic to '/Projects/grocerypro'
    let normalizedPath = target;

    // Standardize leading relative syntax into path format
    if (target.startsWith("./") || target.startsWith("../")) {
      // Resolve path against context.cwd to flatten relative references
      const segments = context.cwd.split("/").filter(Boolean);
      const parts = target.split("/");

      for (const part of parts) {
        if (part === "..") {
          segments.pop();
        } else if (part !== "." && part !== "") {
          segments.push(part);
        }
      }
      normalizedPath = "/" + segments.join("/");
    }

    // Clean up normalized string for slug extraction (e.g. "/projects/grocerypro" -> "projects/grocerypro")
    const cleanTarget = normalizedPath.toLowerCase().replace(/^\/+|\/+$/g, "");
    const isAtProjectsDir = context.cwd === TERMINAL_PATHS.PROJECTS;
    const projectPrefixRegex = /^projects?\//i;

    let projectSlug = "";

    if (isAtProjectsDir && !projectPrefixRegex.test(cleanTarget)) {
      // Direct slug inside /Projects directory
      projectSlug = cleanTarget;
    } else if (projectPrefixRegex.test(cleanTarget)) {
      // Target starts with project/ or projects/ (or resolved to /projects/...)
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
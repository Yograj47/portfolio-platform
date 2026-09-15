"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { findEntryByPath, rootWorkspace } from "@/lib/terminal/fileSystem";
import { TerminalCommand } from "@/types/terminal.type";
import { TERMINAL_PATHS } from "../workspace/terminal-workspace.type";
import { resolvePath } from "@/lib/terminal/navigation";
import { projectService } from "@/services/project.service";
import { PublicProject } from "@/lib/validations/project";

function ProjectsList() {
  const { data: projects, isLoading, isError } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const res = await projectService.findAll();
      return (res.data?.data ?? res.data ?? []) as PublicProject[];
    },
  });

  if (isLoading) {
    return (
      <div className="font-mono text-sm text-muted-foreground animate-pulse">
        Loading project index...
      </div>
    );
  }

  if (isError || !projects) {
    return (
      <div className="font-mono text-sm text-destructive">
        Error loading projects workspace.
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="font-mono text-sm text-muted-foreground">
        No projects found in directory.
      </div>
    );
  }

  return (
    <div className="space-y-4 font-mono text-sm">
      <p className="text-muted-foreground">Workspace: /Projects</p>

      <div className="grid grid-cols-[180px_220px_1fr] gap-x-4 gap-y-2">
        <span className="font-semibold">Slug</span>
        <span className="font-semibold">Title</span>
        <span className="font-semibold">Excerpt</span>

        <div className="col-span-3 border-b border-border/40" />

        {projects.map((project) => (
          <React.Fragment key={project.id}>
            <span className="font-semibold text-primary">
              {project.slug}
            </span>
            <span className="truncate text-foreground">
              {project.title}
            </span>
            <span className="truncate text-muted-foreground">
              {project.excerpt}
            </span>
          </React.Fragment>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Run <code className="text-foreground">open [slug]</code> to inspect individual project details.
      </p>
    </div>
  );
}

function renderWorkspace() {
  return (
    <div className="space-y-4 font-mono text-sm">
      <p className="text-muted-foreground">Workspace: /</p>

      <div className="grid grid-cols-[110px_180px_180px_1fr] gap-y-2">
        <span className="font-semibold">Type</span>
        <span className="font-semibold">Name</span>
        <span className="font-semibold">Alias</span>
        <span className="font-semibold">Description</span>

        <div className="col-span-4 border-b border-border/40" />

        {rootWorkspace.map((item) => (
          <div key={item.name} className="contents">
            <span className="capitalize text-muted-foreground">
              {item.type}
            </span>
            <span>
              {item.name}
              {item.type === "directory" ? "/" : ""}
            </span>
            <span className="text-primary">{item.aliases.join(", ")}</span>
            <span className="text-muted-foreground">{item.description}</span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Commands are case-insensitive. You can use either the file name or any listed alias.
      </p>
    </div>
  );
}

export const lsCommand: TerminalCommand = {
  name: "ls",
  description: "List workspace items.",

  execute(args, context) {
    const path = resolvePath(
      context.cwd,
      args.join(" ").trim()
    );

    if (!path) {
      return {
        output: (
          <span className="text-destructive">
            ls: path not found
          </span>
        ),
      };
    }

    if (path === TERMINAL_PATHS.ROOT) {
      return {
        output: renderWorkspace(),
      };
    }

    const entry = findEntryByPath(path);

    if (!entry) {
      return {
        output: (
          <span className="text-destructive">
            ls: cannot access {path}: No such file or directory.
          </span>
        ),
      };
    }

    switch (entry.path) {
      case TERMINAL_PATHS.PROJECTS:
        return {
          output: <ProjectsList />,
        };

      case TERMINAL_PATHS.BLOG:
        return {
          output: (
            <span>
              Blog directory is currently unavailable.
            </span>
          ),
        };

      default:
        return {
          output: (
            <span className="text-destructive">
              ls: {entry.name} is not a directory.
            </span>
          ),
        };
    }
  },
};
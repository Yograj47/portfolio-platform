import { ProjectCard } from "./project-card";

import type { Project } from "@/components/project/project-columns";

interface ProjectGridProps {
  projects: Project[];
}

export function ProjectGrid({
  projects,
}: ProjectGridProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
        />
      ))}
    </div>
  );
}
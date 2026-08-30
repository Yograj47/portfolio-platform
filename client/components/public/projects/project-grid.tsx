import type { PublicProject } from "@/lib/validations/project";
import { ProjectCard } from "./project-card";

interface ProjectGridProps {
  projects: PublicProject[];
}

export function ProjectGrid({ projects }: ProjectGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
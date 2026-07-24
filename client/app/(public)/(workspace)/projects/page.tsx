import { FileView } from "@/components/public/layout/file-view";

import { ProjectsSection } from "@/components/public/projects/projects-section";

export default function ProjectsPage() {
  return (
    <FileView
      title="Projects"
      meta="Folder"
    >
      <ProjectsSection />
    </FileView>
  );
}
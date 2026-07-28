import { FileView } from "@/components/public/layout/file-view";
import { ProjectsSection } from "@/components/public/projects/projects-section";

export default function ProjectsPage() {
  return (
    <FileView
      title="Projects"
      meta="Directory"
      folder
      description="
        Selected projects covering full-stack development, system design, and experimentation.
    "
    >
      <ProjectsSection />
    </FileView>
  );
}
import { FileView } from "@/components/public/layout/file-view";
import { ProjectDetail } from "@/components/public/projects/project-detail";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({
  params,
}: ProjectPageProps) {
  const { id } = await params;

  return (
    <FileView
      title="Project.md"
      meta="Markdown"
    >
      <ProjectDetail id={id} />
    </FileView>
  );
}
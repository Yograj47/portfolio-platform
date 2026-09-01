import { FileView } from "@/components/public/layout/file-view";
import { ProjectDetail } from "@/components/public/projects/detail/project-detail";

interface ProjectPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  return (
    <FileView title={`${id}.md`} meta="Markdown">
      <ProjectDetail slug={id} />
    </FileView>
  );
}
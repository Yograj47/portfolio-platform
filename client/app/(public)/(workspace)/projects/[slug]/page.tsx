import { FileView } from "@/components/public/layout/file-view";
import { ProjectDetail } from "@/components/public/projects/detail/project-detail";

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  return (
    <FileView>
      <ProjectDetail slug={slug} />
    </FileView>
  );
}

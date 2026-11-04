import { ProjectDetailSkeleton } from "@/components/public/projects/detail/project-detail-skeleton";
export default function Loading() {
  return (
    <div role="status" aria-label="Loading project details">
      <div aria-hidden="true"><ProjectDetailSkeleton /></div>
    </div>
  );
}

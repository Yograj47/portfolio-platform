import { TablePageSkeleton } from "@/components/admin/skeletons/table-page-skeleton";

export default function Loading() {
  return <TablePageSkeleton columnCount={3} rowCount={6} hasAction />;
}
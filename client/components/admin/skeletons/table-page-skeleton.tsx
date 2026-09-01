"use client";

import { PageHeaderSkeleton } from "./page-header.skeleton";
import { TableSkeleton } from "./table-skeleton";

interface TablePageSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  hasAction?: boolean;
}

export function TablePageSkeleton({
  rowCount = 5,
  columnCount = 4,
  hasAction = true,
}: TablePageSkeletonProps) {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton hasAction={hasAction} />
      <TableSkeleton rowCount={rowCount} columnCount={columnCount} />
    </div>
  );
}
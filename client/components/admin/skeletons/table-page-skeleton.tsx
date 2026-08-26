"use client";

import { TableSkeleton } from "./table-skeleton";
import { PageHeaderSkeleton } from "./page-header.skeleton";

export function TablePageSkeleton() {
  return (
    <div className="space-y-6">
      <PageHeaderSkeleton />
      <TableSkeleton />
    </div>
  );
}
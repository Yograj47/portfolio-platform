"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface PageHeaderSkeletonProps {
  hasAction?: boolean;
}

export function PageHeaderSkeleton({
  hasAction = true,
}: PageHeaderSkeletonProps) {
  return (
    <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1">
      <div className="space-y-1.5 min-w-0">
        <Skeleton className="h-4 w-48 sm:w-64" />
      </div>

      {hasAction && (
        <Skeleton className="h-9 w-28 rounded-md shrink-0" />
      )}
    </div>
  );
} 
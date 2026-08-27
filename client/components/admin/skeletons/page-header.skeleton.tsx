"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface PageHeaderSkeletonProps {
  hasAction?: boolean;
}

export function PageHeaderSkeleton({ hasAction = true }: PageHeaderSkeletonProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-8 w-36 sm:w-48" />
        <Skeleton className="h-4 w-48 sm:w-64" />
      </div>
      {hasAction && <Skeleton className="h-9 w-28 rounded-md shrink-0" />}
    </div>
  );
}
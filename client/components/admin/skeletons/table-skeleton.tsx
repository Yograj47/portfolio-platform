"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function TableSkeleton() {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
      {/* Table Header Row Skeleton */}
      <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
        <Skeleton className="h-3 w-12" />
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-6" />
      </div>

      {/* Table Body Rows Skeleton */}
      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between px-4 py-3.5">
            {/* Order Slot */}
            <Skeleton className="h-4 w-8 font-mono" />

            {/* Name + Icon Swatch */}
            <div className="flex items-center gap-2.5">
              <Skeleton className="size-7 rounded-md" />
              <Skeleton className="h-4 w-28" />
            </div>

            {/* Icon Name */}
            <Skeleton className="h-4 w-20 font-mono" />

            {/* Color Swatch */}
            <div className="flex items-center gap-2">
              <Skeleton className="size-3.5 rounded-full" />
              <Skeleton className="h-3 w-14 font-mono" />
            </div>

            {/* Level Progress Segment */}
            <div className="flex items-center gap-3">
              <Skeleton className="h-2 w-20 rounded-full" />
              <Skeleton className="h-5 w-10 rounded-md" />
            </div>

            {/* Actions Menu */}
            <Skeleton className="size-8 rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}
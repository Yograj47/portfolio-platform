"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  showHeader?: boolean;
}

export function TableSkeleton({
  rowCount = 5,
  columnCount = 4,
  showHeader = true,
}: TableSkeletonProps) {
  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
      {showHeader && (
        <div className="flex items-center justify-between border-b bg-muted/40 px-4 py-3">
          {Array.from({ length: columnCount }).map((_, i) => (
            <Skeleton
              key={i}
              className={`h-3 ${
                i === 0
                  ? "w-24"
                  : i === columnCount - 1
                  ? "w-8"
                  : "w-16 sm:w-28"
              }`}
            />
          ))}
        </div>
      )}

      <div className="divide-y">
        {Array.from({ length: rowCount }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex items-center justify-between px-4 py-3.5"
          >
            {Array.from({ length: columnCount }).map((_, colIndex) => {
              // Action column (Last item)
              if (colIndex === columnCount - 1) {
                return (
                  <Skeleton
                    key={colIndex}
                    className="size-8 rounded-md shrink-0"
                  />
                );
              }

              // First data column (Primary identifier)
              if (colIndex === 0) {
                return (
                  <div
                    key={colIndex}
                    className="flex items-center gap-2.5 min-w-30"
                  >
                    <Skeleton className="h-4 w-32" />
                  </div>
                );
              }

              return (
                <Skeleton
                  key={colIndex}
                  className="hidden h-4 w-20 sm:block sm:w-28"
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
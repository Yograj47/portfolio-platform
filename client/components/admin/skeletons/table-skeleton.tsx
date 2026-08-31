"use client";

import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
  showHeader?: boolean;
  showSearch?: boolean;
}

export function TableSkeleton({
  rowCount = 5,
  columnCount = 4,
  showHeader = true,
  showSearch = true,
}: TableSkeletonProps) {
  return (
    <div className="flex flex-1 min-h-0 w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
      {/* Search Toolbar Skeleton */}
      {showSearch && (
        <div className="shrink-0 flex items-center justify-between border-b border-border/60 px-4 py-3 bg-card">
          <Skeleton className="h-9 w-full max-w-xs sm:max-w-sm rounded-md" />
        </div>
      )}

      {/* Table Header Skeleton */}
      {showHeader && (
        <div className="shrink-0 flex items-center justify-between border-b border-border/60 bg-muted/90 px-4 py-3">
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

      {/* Internal Table Content Area */}
      <div className="flex-1 min-h-0 overflow-auto divide-y divide-border/40">
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

              // First column (Primary identifier)
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
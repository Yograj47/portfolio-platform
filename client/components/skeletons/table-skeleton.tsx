import { Skeleton } from "@/components/ui/skeleton";

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

export function TableSkeleton({
  rows = 8,
  columns = 4,
}: TableSkeletonProps) {
  return (
    <div className="overflow-hidden rounded-lg border">
      {/* Header */}
      <div className="flex border-b p-4">
        {Array.from({ length: columns }).map((_, index) => (
          <div key={index} className="flex-1">
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>

      {/* Rows */}
      {Array.from({ length: rows }).map((_, row) => (
        <div
          key={row}
          className="flex items-center border-b p-4 last:border-b-0"
        >
          {Array.from({ length: columns }).map((_, col) => (
            <div key={col} className="flex-1">
              <Skeleton
                className={
                  col === columns - 1
                    ? "ml-auto h-8 w-8 rounded-md"
                    : "h-4 w-3/4"
                }
              />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
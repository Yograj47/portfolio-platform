import { Skeleton } from "@/components/ui/skeleton";

interface StatsCardSkeletonProps {
  count?: number;
}

export function StatsCardSkeleton({
  count = 4,
}: StatsCardSkeletonProps) {
  return (
    <div
      className={`grid gap-4 md:grid-cols-2 xl:grid-cols-${count}`}
    >
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="rounded-lg border p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>

          <Skeleton className="h-8 w-20" />

          <Skeleton className="h-3 w-32" />
        </div>
      ))}
    </div>
  );
}
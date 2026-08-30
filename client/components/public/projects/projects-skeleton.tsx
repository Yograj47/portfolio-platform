import { Skeleton } from "@/components/ui/skeleton";

interface ProjectsSkeletonProps {
  cardCount?: number;
}

export function ProjectsSkeleton({ cardCount = 6 }: ProjectsSkeletonProps) {
  return (
    <div className="space-y-8">
      {/* 1. Filter & Search Bar Skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search Input */}
        <Skeleton className="h-10 w-full sm:w-72 rounded-xl" />

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Skeleton className="h-9 w-16 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-24 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-20 shrink-0 rounded-full" />
          <Skeleton className="h-9 w-28 shrink-0 rounded-full" />
        </div>
      </div>

      {/* 2. Project Cards Grid Skeleton */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card/40 p-5 space-y-4"
          >
            {/* Card Thumbnail */}
            <Skeleton className="aspect-video w-full rounded-xl" />

            {/* Card Header & Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-6 w-1/2 rounded-md" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>

            {/* Card Footer: Tech Badges */}
            <div className="flex items-center gap-2 pt-2 border-t border-border/40">
              <Skeleton className="h-5 w-16 rounded-md" />
              <Skeleton className="h-5 w-14 rounded-md" />
              <Skeleton className="h-5 w-18 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
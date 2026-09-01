import { Skeleton } from "@/components/ui/skeleton";

export function TimelineSkeleton() {
  return (
    <div className="space-y-10">
      {Array.from({ length: 2 }).map((_, yearIndex) => (
        <div key={yearIndex} className="space-y-6">
          {/* Year Badge Skeleton */}
          <div className="flex items-center gap-4 py-2">
            <Skeleton className="h-10 w-24 rounded-lg" />
            <Skeleton className="h-px flex-1" />
          </div>

          {/* Items Skeleton */}
          <div className="space-y-6 pl-2">
            {Array.from({ length: 2 }).map((_, itemIndex) => (
              <div
                key={itemIndex}
                className="relative border-l-2 border-border/40 pl-6 sm:pl-8"
              >
                {/* Node circle */}
                <Skeleton className="absolute -left-4.25 top-0 size-8 rounded-full" />

                {/* Card Container */}
                <div className="space-y-3 rounded-xl border p-5">
                  <div className="flex justify-between">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-20 rounded-full" />
                      <Skeleton className="h-6 w-44" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-28 rounded-md" />
                  </div>
                  <Skeleton className="h-12 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
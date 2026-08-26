export function SkillsSkeleton() {
  return (
    <div className="flex flex-col items-center justify-between gap-8 py-4 lg:flex-row lg:items-center">
      {/* Radial Wheel Skeleton */}
      <div className="relative flex aspect-square w-full max-w-135 items-center justify-center p-4">
        {/* Outer Circular Ring Skeleton */}
        <div className="size-full animate-pulse rounded-full border-12 border-muted/40 bg-transparent" />

        {/* Inner Center Circle Skeleton */}
        <div className="absolute flex size-44 flex-col items-center justify-center rounded-full border border-border bg-card/50 p-4">
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-2.5 w-20 animate-pulse rounded bg-muted/60" />
        </div>
      </div>

      {/* Side Details Panel Skeleton */}
      <div className="flex w-full max-w-xs flex-col justify-between gap-6">
        {/* Total Count Card Skeleton */}
        <div className="flex justify-end">
          <div className="w-28 rounded-xl border bg-card p-4 text-right shadow-xs">
            <div className="ml-auto h-8 w-10 animate-pulse rounded bg-muted" />
            <div className="mt-2 ml-auto h-2.5 w-16 animate-pulse rounded bg-muted/60" />
          </div>
        </div>

        {/* Selected Skill Detail Card Skeleton */}
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="size-12 animate-pulse rounded-xl bg-muted" />
            <div className="space-y-2">
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div>
              <div className="flex justify-between">
                <div className="h-3 w-16 animate-pulse rounded bg-muted/60" />
                <div className="h-3 w-8 animate-pulse rounded bg-muted" />
              </div>
              
              {/* Segmented Bar Skeleton */}
              <div className="mt-2.5 flex gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-2.5 flex-1 animate-pulse rounded-sm bg-muted"
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="h-3 w-10 animate-pulse rounded bg-muted/60" />
              <div className="h-3 w-20 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
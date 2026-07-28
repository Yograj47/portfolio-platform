export function TimelineSkeleton() {
  return (
    <div className="space-y-12">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="space-y-6"
        >
          <div className="h-8 w-24 animate-pulse rounded bg-muted" />

          <div className="h-36 animate-pulse rounded-md border bg-muted" />
        </div>
      ))}
    </div>
  );
}
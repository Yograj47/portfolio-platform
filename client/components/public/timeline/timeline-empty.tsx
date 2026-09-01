import { Layers } from "lucide-react";

export function TimelineEmpty() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Layers className="size-6 text-muted-foreground" />
      </div>

      <h3 className="mt-4 text-base font-semibold text-foreground">
        No Timeline Logs Found
      </h3>

      <p className="mt-1 text-sm text-muted-foreground">
        Milestones and career history entries will appear here soon.
      </p>
    </div>
  );
}
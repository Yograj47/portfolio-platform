import type { Timeline } from "@/components/admin/timeline/timeline-columns";
import { TimelineItem } from "./timeline-item";

interface TimelineYearProps {
  year: string;
  items: Timeline[];
}

export function TimelineYear({ year, items }: TimelineYearProps) {
  return (
    <section className="space-y-6">
      {/* Year Sticky Header Badge */}
      <div className="sticky top-0 z-10 flex items-center gap-4 bg-background/80 py-2 backdrop-blur-xs">
        <span className="rounded-lg border bg-muted/50 px-3 py-1 font-mono text-2xl font-extrabold tracking-tight text-foreground">
          {year}
        </span>
        <div className="h-px flex-1 bg-border/60" />
      </div>

      <div className="space-y-6 pl-2">
        {items.map((item) => (
          <TimelineItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
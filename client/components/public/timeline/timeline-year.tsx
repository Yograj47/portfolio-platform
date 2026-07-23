import type { Timeline } from "@/components/timeline/timeline-columns";

import { TimelineItem } from "./timeline-item";

interface TimelineYearProps {
  year: string;
  items: Timeline[];
}

export function TimelineYear({
  year,
  items,
}: TimelineYearProps) {
  return (
    <section className="space-y-8">
      <div className="border-b pb-3">
        <h2 className="font-mono text-3xl font-bold">
          {year}
        </h2>
      </div>

      <div className="space-y-10">
        {items.map((item) => (
          <TimelineItem
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </section>
  );
}
import { format } from "date-fns";


import type { Timeline } from "@/components/timeline/timeline-columns";
import { TimelineType } from "@/lib/enums/timeline";

interface TimelineItemProps {
  item: Timeline;
}

const symbols: Record<TimelineType, string> = {
  EDUCATION: "◆",
  EXPERIENCE: "●",
  CERTIFICATION: "▲",
};

export function TimelineItem({
  item,
}: TimelineItemProps) {
  return (
    <article className="relative border-l pl-8">
      <span className="absolute -left-2.25 top-1 flex size-4 items-center justify-center rounded-full bg-background text-sm">
        {symbols[item.type]}
      </span>

      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-mono text-xs uppercase text-muted-foreground">
              {item.type}
            </p>

            <h3 className="text-xl font-semibold">
              {item.title}
            </h3>

            <p className="text-muted-foreground">
              {item.organization}
            </p>
          </div>

          <span className="font-mono text-xs text-muted-foreground">
            {format(
              new Date(item.startDate),
              "MMM yyyy"
            )}{" "}
            —
            {" "}
            {item.current
              ? "Present"
              : item.endDate
                ? format(
                    new Date(item.endDate),
                    "MMM yyyy"
                  )
                : ""}
          </span>
        </div>

        {item.description && (
          <p className="leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}

        {item.location && (
          <p className="text-sm text-muted-foreground">
            📍 {item.location}
          </p>
        )}
      </div>
    </article>
  );
}
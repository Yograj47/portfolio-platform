import { format } from "date-fns";
import { GraduationCap, Briefcase, Award, MapPin, Calendar } from "lucide-react";

import type { Timeline } from "@/components/admin/timeline/timeline-columns";
import { TimelineType } from "@/lib/enums/timeline";

interface TimelineItemProps {
  item: Timeline;
}

const typeConfig: Record<
  TimelineType,
  { label: string; icon: React.ElementType; color: string }
> = {
  EDUCATION: {
    label: "Education",
    icon: GraduationCap,
    color: "text-blue-500 bg-blue-500/10 border-blue-500/20",
  },
  EXPERIENCE: {
    label: "Experience",
    icon: Briefcase,
    color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
  },
  CERTIFICATION: {
    label: "Certification",
    icon: Award,
    color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  },
};

export function TimelineItem({ item }: TimelineItemProps) {
  const config = typeConfig[item.type] || typeConfig.EXPERIENCE;
  const Icon = config.icon;

  const startDateFormatted = item.startDate
    ? format(new Date(item.startDate), "MMM yyyy")
    : "";
    
  const endDateFormatted = item.current
    ? "Present"
    : item.endDate
    ? format(new Date(item.endDate), "MMM yyyy")
    : "";

  return (
    <article className="group relative border-l-2 border-border/60 pl-6 sm:pl-8 pb-2 transition-colors hover:border-border">
      {/* Node Dot Icon */}
      <span className="absolute -left-4.25 top-0 flex size-8 items-center justify-center rounded-full border bg-background text-foreground shadow-xs transition-transform group-hover:scale-110 group-hover:border-primary">
        <Icon className="size-4 text-muted-foreground group-hover:text-primary" />
      </span>

      <div className="space-y-3 rounded-xl border bg-card/50 p-5 shadow-2xs transition-all hover:bg-card hover:shadow-xs">
        {/* Header Row */}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${config.color}`}
              >
                {config.label}
              </span>
              {item.current && (
                <span className="inline-flex items-center rounded-full bg-emerald-500/15 px-2 py-0.5 font-mono text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  Active
                </span>
              )}
            </div>

            <h3 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {item.title}
            </h3>

            <p className="font-medium text-muted-foreground text-sm">
              {item.organization}
            </p>
          </div>

          {/* Date Badge */}
          <div className="flex items-center gap-1.5 rounded-md border bg-muted/40 px-2.5 py-1 font-mono text-xs text-muted-foreground">
            <Calendar className="size-3.5" />
            <span>
              {startDateFormatted} {endDateFormatted && `— ${endDateFormatted}`}
            </span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        )}

        {/* Location Footer */}
        {item.location && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="size-3.5 shrink-0 text-muted-foreground/70" />
            <span>{item.location}</span>
          </div>
        )}
      </div>
    </article>
  );
}
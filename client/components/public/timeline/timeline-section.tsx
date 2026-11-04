"use client";

import { useMemo } from "react";
import { useTimelinesQuery } from "@/hooks/use-portfolio-content";
import { ErrorState } from "@/components/feedback/error-state";

import { TimelineEmpty } from "./timeline-empty";
import { TimelineSkeleton } from "./timeline-skeleton";
import { TimelineYear } from "./timeline-year";
import type { Timeline } from "@/types/portfolio";

export function TimelineSection() {
  const {
    data: timelines = [],
    isLoading: loading,
    isError,
    refetch,
  } = useTimelinesQuery();

  const grouped = useMemo(() => {
    return (timelines || []).reduce(
      (acc: Record<number, Timeline[]>, item: Timeline) => {
        const year = new Date(item.startDate).getFullYear();

        if (!acc[year]) {
          acc[year] = [];
        }

        acc[year].push(item);
        return acc;
      },
      {} as Record<number, Timeline[]>,
    );
  }, [timelines]);

  if (loading) {
    return <TimelineSkeleton />;
  }

  if (isError) return <ErrorState onRetry={() => void refetch()} />;

  const years = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <section className="space-y-12">
      {years.length ? (
        years.map((year) => (
          <TimelineYear key={year} year={String(year)} items={grouped[year]} />
        ))
      ) : (
        <TimelineEmpty />
      )}
    </section>
  );
}

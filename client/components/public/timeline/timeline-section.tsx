"use client";

import { useMemo } from "react";

import { useTimeline } from "@/hooks/use-timeline";

import { TimelineEmpty } from "./timeline-empty";
import { TimelineSkeleton } from "./timeline-skeleton";
import { TimelineYear } from "./timeline-year";
import { Timeline } from "@/components/admin/timeline/timeline-columns";

export function TimelineSection() {
    const {
        timelines,
        loading,
    } = useTimeline();

    const grouped = useMemo(() => {
        return timelines.reduce(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (acc: any, item: Timeline) => {
                const year = new Date(
                    item.startDate
                ).getFullYear();

                if (!acc[year]) {
                    acc[year] = [];
                }

                acc[year].push(item);

                return acc;
            },
            {} as Record<number, typeof timelines>
        );
    }, [timelines]);

    if (loading) {
        return <TimelineSkeleton />;
    }

    const years = Object.keys(grouped)
        .map(Number)
        .sort((a, b) => b - a);

    return (
        <section className="space-y-12">

            {years.length ? (
                years.map((year) => (
                    <TimelineYear
                        key={year}
                        year={String(year)}
                        items={grouped[year]}
                    />
                ))
            ) : (
                <TimelineEmpty />
            )}
        </section>
    );
}
"use client";

import { useMemo } from "react";

import { OrderedDataTable } from "@/components/data-table/ordered-data-table";

import type { Timeline } from "@/types/portfolio";
import { getTimelineColumns } from "./timeline-columns";

interface TimelineTableProps {
  data: Timeline[];
  loading: boolean;

  onEdit: (timeline: Timeline) => void;
  onDelete: (timeline: Timeline) => void;
}

export function TimelineTable({
  data,
  loading,
  onEdit,
  onDelete,
}: TimelineTableProps) {
  const columns = useMemo(
    () =>
      getTimelineColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

  return (
    <OrderedDataTable
      collection="timeline"
      columns={columns}
      data={data}
      loading={loading}
      emptyTitle="No timeline entries"
      emptyDescription="Create your first timeline entry."
    />
  );
}

"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";

import {
  Timeline,
  getTimelineColumns,
} from "./timeline-columns";

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
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyTitle="No timeline entries"
      emptyDescription="Create your first timeline entry."
    />
  );
}
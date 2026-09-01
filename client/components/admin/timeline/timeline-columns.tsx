"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "@/components/data-table/data-table-actions";
import { TimelineType } from "@/lib/enums/timeline";
import { TIMELINE_TYPE_OPTIONS } from "@/lib/constants/timeline-type-options";

export interface Timeline {
  id: string;
  title: string;
  organization: string;
  location?: string | null;
  description?: string | null;
  type: TimelineType;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  displayOrder: number;
}

interface Props {
  onEdit: (timeline: Timeline) => void;
  onDelete: (timeline: Timeline) => void;
}

const formatDateSafe = (dateString?: string | null) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return isValid(date) ? format(date, "MMM yyyy") : "-";
};

export function getTimelineColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Timeline>[] {
  return [
    {
      accessorKey: "displayOrder",
      header: "Order",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          #{row.original.displayOrder}
        </span>
      ),
    },
    {
      accessorKey: "title",
      header: "Title & Organization",
      cell: ({ row }) => {
        const { title, organization } = row.original;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{title}</span>
            <span className="text-xs text-muted-foreground">{organization}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "location",
      header: "Location",
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground">
          {row.original.location || "—"}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const typeOption = TIMELINE_TYPE_OPTIONS.find(
          (opt) => opt.value === row.original.type
        );
        return (
          <Badge variant="secondary" className="capitalize">
            {typeOption?.label ?? row.original.type}
          </Badge>
        );
      },
    },
    {
      id: "duration",
      header: "Duration",
      cell: ({ row }) => {
        const start = formatDateSafe(row.original.startDate);
        const end = row.original.current
          ? "Present"
          : formatDateSafe(row.original.endDate);

        return (
          <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
            {start} – {end}
          </span>
        );
      },
    },
    {
      accessorKey: "current",
      header: "Status",
      cell: ({ row }) => (
        <Badge
          variant={row.original.current ? "default" : "outline"}
          className="text-[11px]"
        >
          {row.original.current ? "Active" : "Completed"}
        </Badge>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DataTableActions
            onEdit={() => onEdit(row.original)}
            onDelete={() => onDelete(row.original)}
          />
        </div>
      ),
    },
  ];
}
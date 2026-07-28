"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "@/components/data-table/data-table-actions";
import { TimelineType } from "@/lib/enums/timeline";

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

export function getTimelineColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Timeline>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },

    {
      accessorKey: "organization",
      header: "Organization",
    },

    {
      accessorKey: "location",
      header: "Location",

      cell: ({ row }) =>
        row.original.location || "-",
    },

    {
      accessorKey: "type",
      header: "Type",

      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.type}
        </Badge>
      ),
    },

    {
      id: "duration",
      header: "Duration",

      cell: ({ row }) => {
        const start = format(
          new Date(row.original.startDate),
          "MMM yyyy"
        );

        const end = row.original.current
          ? "Present"
          : row.original.endDate
            ? format(
              new Date(row.original.endDate),
              "MMM yyyy"
            )
            : "-";

        return (
          <span className="whitespace-nowrap">
            {start} - {end}
          </span>
        );
      },
    },

    {
      accessorKey: "current",
      header: "Current",

      cell: ({ row }) => (
        <Badge
          variant={
            row.original.current
              ? "default"
              : "outline"
          }
        >
          {row.original.current ? "Yes" : "No"}
        </Badge>
      ),
    },

    {
      accessorKey: "displayOrder",
      header: "Order",
    },

    {
      id: "actions",

      cell: ({ row }) => (
        <DataTableActions
          onEdit={() => onEdit(row.original)}
          onDelete={() => onDelete(row.original)}
        />
      ),
    },
  ];
}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format, isValid } from "date-fns";
import { DataTableActions } from "@/components/data-table/data-table-actions";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

interface Props {
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

const formatDateSafe = (dateString?: string | null) => {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return isValid(date) ? format(date, "MMM d, yyyy") : "—";
};

export function getCategoryColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <span className="font-medium text-foreground">
          {row.original.name}
        </span>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => (
        <span
          className="block max-w-175 truncate text-xs text-muted-foreground"
          title={row.original.description || undefined}
        >
          {row.original.description || "—"}
        </span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">
          {formatDateSafe(row.original.createdAt)}
        </span>
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
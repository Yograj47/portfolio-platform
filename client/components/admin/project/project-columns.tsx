"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";

import { DataTableActions } from "@/components/data-table/data-table-actions";

import { ProjectStatus } from "@/lib/enums/project";

export interface Project {
  id: string;
  title: string;

  category: {
    id: string;
    name: string;
  };

  status: ProjectStatus;
  featured: boolean;
  displayOrder: number;
  githubUrl?: string | null;
  liveUrl?: string | null;

  excerpt: string;
  description: string;
}

interface Props {
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}

export function getProjectColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Project>[] {
  return [
    {
      accessorKey: "title",
      header: "Title",
    },

    {
      accessorKey: "category.name",
      header: "Category",
      cell: ({ row }) => row.original.category.name,
    },

    {
      accessorKey: "status",
      header: "Status",

      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.status}
        </Badge>
      ),
    },

    {
      accessorKey: "featured",
      header: "Featured",

      cell: ({ row }) => (
        <Badge
          variant={
            row.original.featured
              ? "default"
              : "outline"
          }
        >
          {row.original.featured
            ? "Yes"
            : "No"}
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
          onDelete={() =>
            onDelete(row.original)
          }
        />
      ),
    },
  ];
}
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableActions } from "../data-table/data-table-actions";

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

export function getCategoryColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Category>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => row.original.description || "-",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString(),
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
      )
    },
  ];
}
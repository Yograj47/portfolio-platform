"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { DataTableActions } from "@/components/data-table/data-table-actions";

export interface Skill {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  level: number;
  displayOrder: number;
}

interface Props {
  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export function getSkillColumns({
  onEdit,
  onDelete,
}: Props): ColumnDef<Skill>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },

    {
      accessorKey: "icon",
      header: "Icon",

      cell: ({ row }) =>
        row.original.icon || "-",
    },

    {
      accessorKey: "color",
      header: "Color",

      cell: ({ row }) =>
        row.original.color ? (
          <div className="flex items-center gap-2">
            <div
              className="size-4 rounded-full border"
              style={{
                background: row.original.color,
              }}
            />

            {row.original.color}
          </div>
        ) : (
          "-"
        ),
    },

    {
      accessorKey: "level",
      header: "Level",

      cell: ({ row }) => (
        <Badge>
          {row.original.level}%
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
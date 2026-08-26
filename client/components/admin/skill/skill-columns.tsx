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
      accessorKey: "displayOrder",
      header: "Order",
      cell: ({ row }) => (
        <span className="font-mono text-xs font-semibold text-muted-foreground">
          #{String(row.original.displayOrder).padStart(2, "0")}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => {
        const skill = row.original;
        const color = skill.color || "#3b82f6";

        return (
          <div className="flex items-center gap-2.5">
            <div
              className="flex size-7 items-center justify-center rounded-md border text-xs font-bold uppercase text-white shadow-2xs"
              style={{ backgroundColor: color }}
            >
              {skill.name.charAt(0)}
            </div>
            <span className="font-medium text-foreground">{skill.name}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "icon",
      header: "Icon",
      cell: ({ row }) => (
        <span className="font-mono text-xs text-muted-foreground">
          {row.original.icon || "-"}
        </span>
      ),
    },
    {
      accessorKey: "color",
      header: "Color",
      cell: ({ row }) =>
        row.original.color ? (
          <div className="flex items-center gap-2 font-mono text-xs">
            <div
              className="size-3.5 rounded-full border border-black/10 shadow-2xs"
              style={{ backgroundColor: row.original.color }}
            />
            <span className="uppercase text-muted-foreground">
              {row.original.color}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        ),
    },
    {
      accessorKey: "level",
      header: "Level",
      cell: ({ row }) => {
        const level = row.original.level;
        const color = row.original.color || "#3b82f6";

        return (
          <div className="flex items-center gap-3">
            <div className="h-2 w-20 overflow-hidden rounded-full bg-muted/60">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${level}%`, backgroundColor: color }}
              />
            </div>
            <Badge variant="secondary" className="font-mono text-[11px]">
              {level}%
            </Badge>
          </div>
        );
      },
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
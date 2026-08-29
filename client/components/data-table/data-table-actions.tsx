"use client";

import { MoreHorizontal, Pencil, Trash2, Image as ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  onImages?: () => void; // Optional prop
}

export function DataTableActions({
  onEdit,
  onDelete,
  onImages,
}: DataTableActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex size-8 items-center justify-center rounded-lg border border-border/60 bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring">
        <MoreHorizontal className="size-4" />
        <span className="sr-only">Open menu</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {onImages && (
          <DropdownMenuItem onClick={onImages} className="cursor-pointer">
            <ImageIcon className="mr-2 size-4 text-muted-foreground" />
            Images
          </DropdownMenuItem>
        )}

        <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
          <Pencil className="mr-2 size-4 text-muted-foreground" />
          Edit
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="mr-2 size-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
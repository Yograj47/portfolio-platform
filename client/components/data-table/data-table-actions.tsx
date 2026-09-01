"use client";

import {
  MoreHorizontal,
  Pencil,
  Trash2,
  Image as ImageIcon,
  RotateCcw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DataTableActionsProps {
  onEdit?: () => void;
  onDelete: () => void;
  onImages?: () => void;
  onRestore?: () => void;
}

export function DataTableActions({
  onEdit,
  onDelete,
  onImages,
  onRestore,
}: DataTableActionsProps) {
  const hasUpperSection = Boolean(onImages || onEdit || onRestore);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={(props) => (
          <Button
            {...props}
            variant="ghost"
            size="icon"
            className="size-8 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground cursor-pointer"
          >
            <MoreHorizontal className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        )}
      />

      <DropdownMenuContent align="end" className="w-44 p-1.5 shadow-md">
        {onImages && (
          <DropdownMenuItem
            onClick={onImages}
            className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium cursor-pointer"
          >
            <ImageIcon className="size-4 text-muted-foreground" />
            <span>Manage Images</span>
          </DropdownMenuItem>
        )}

        {onEdit && (
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium cursor-pointer"
          >
            <Pencil className="size-4 text-muted-foreground" />
            <span>Edit</span>
          </DropdownMenuItem>
        )}

        {onRestore && (
          <DropdownMenuItem
            onClick={onRestore}
            className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium cursor-pointer text-emerald-600 focus:bg-emerald-500/10 focus:text-emerald-600"
          >
            <RotateCcw className="size-4" />
            <span>Restore</span>
          </DropdownMenuItem>
        )}

        {hasUpperSection && <DropdownMenuSeparator className="my-1" />}

        <DropdownMenuItem
          onClick={onDelete}
          className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <Trash2 className="size-4" />
          <span>Delete</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
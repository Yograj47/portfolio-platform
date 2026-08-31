"use client";

import {
  MoreHorizontal,
  Trash2,
  ExternalLink,
  FolderPlus,
  RotateCcw,
  Unlink,
  Image as ImageIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Media } from "@/services/media.service";

export interface MediaCardProps {
  media: Media;
  onDelete: (media: Media) => void;
  onAttach?: () => void;
  onDetach?: () => void;
  onRestore?: (projectMediaId: string) => void;
}

export function MediaCard({
  media,
  onDelete,
  onAttach,
  onDetach,
  onRestore,
}: MediaCardProps) {
  const activeRelation = media.projects?.find((p) => p.isActive);
  const inactiveRelation = media.projects?.find((p) => !p.isActive);

  return (
    <div className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {media.type === "IMAGE" ? (
          <img
            src={media.url}
            alt={media.alt ?? media.fileName}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageIcon className="size-10 text-muted-foreground" />
          </div>
        )}

        {activeRelation?.isCover && (
          <div className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur">
            Cover
          </div>
        )}

        <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button
                  {...props}
                  variant="secondary"
                  size="icon"
                  className="size-8 bg-background/90 shadow-sm backdrop-blur cursor-pointer"
                >
                  <MoreHorizontal className="size-4" />
                  <span className="sr-only">Media actions</span>
                </Button>
              )}
            />

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={(props) => (
                  <a
                    {...props}
                    href={media.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="mr-2 size-4" />
                    Open
                  </a>
                )}
              />

              {/* Restore action for soft-deleted project media links */}
              {inactiveRelation && onRestore && (
                <DropdownMenuItem
                  onClick={() => onRestore(inactiveRelation.id)}
                  className="cursor-pointer"
                >
                  <RotateCcw className="mr-2 size-4" />
                  Restore
                </DropdownMenuItem>
              )}

              {/* Attach action available for General Media */}
              {!activeRelation && onAttach && (
                <DropdownMenuItem
                  onClick={() => onAttach()}
                  className="cursor-pointer"
                >
                  <FolderPlus className="mr-2 size-4" />
                  Attach
                </DropdownMenuItem>
              )}

              {/* Detach action available for active Project Media */}
              {activeRelation && onDetach && (
                <DropdownMenuItem
                  onClick={() => onDetach()}
                  className="cursor-pointer"
                >
                  <Unlink className="mr-2 size-4" />
                  Detach
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                onClick={() => onDelete(media)}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="space-y-1.5 p-3">
        <p className="truncate text-sm font-medium" title={media.fileName}>
          {media.fileName}
        </p>

        <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span>
            {media.width && media.height
              ? `${media.width} × ${media.height}`
              : media.mimeType}
          </span>

          <span>{(media.size / 1024).toFixed(1)} KB</span>
        </div>
      </div>
    </div>
  );
}
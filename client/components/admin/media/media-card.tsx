"use client";

import {
  MoreHorizontal,
  Trash2,
  ExternalLink,
  FolderPlus,
  Unlink,
  Pencil,
  FileText,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { Media } from "@/services/media.service";
import Image from "next/image";

export interface MediaCardProps {
  media: Media;
  onDelete: (media: Media) => void;
  onAttach?: () => void;
  onEdit?: (media: Media) => void;
  onDetachRelation?: (id: string) => void;
}

export function MediaCard({
  media,
  onDelete,
  onAttach,
  onEdit,
  onDetachRelation,
}: MediaCardProps) {
  const activeRelation = media.projects?.find((p) => p.isActive);
  const inUse = Boolean(
    activeRelation || media.avatarUsers?.length || media.resumeUsers?.length,
  );

  return (
    <div className="group overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
      <div className="relative aspect-video overflow-hidden bg-muted">
        {media.type === "IMAGE" ? (
          <Image
            src={media.url}
            alt={media.alt ?? media.fileName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="size-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <FileText className="size-10 text-muted-foreground" />
          </div>
        )}

        {activeRelation?.isCover && (
          <div className="absolute left-3 top-3 rounded-md bg-background/90 px-2 py-1 text-xs font-medium shadow-sm backdrop-blur">
            Cover
          </div>
        )}

        <div className="absolute right-3 top-3">
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

              {/* Files may be reused across projects. */}
              {media.type === "IMAGE" && onAttach && (
                <DropdownMenuItem
                  onClick={() => onAttach()}
                  className="cursor-pointer"
                >
                  <FolderPlus className="mr-2 size-4" />
                  Attach to project
                </DropdownMenuItem>
              )}

              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(media)}>
                  <Pencil className="mr-2 size-4" />
                  Edit details
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                disabled={inUse}
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
        <div className="flex flex-wrap gap-1.5 pt-2 text-xs">
          {Boolean(media.avatarUsers?.length) && (
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              Profile image
            </span>
          )}
          {Boolean(media.resumeUsers?.length) && (
            <span className="rounded-md bg-primary/10 px-2 py-1 text-primary">
              Resume
            </span>
          )}
          {media.projects
            ?.filter((relation) => relation.isActive)
            .map((relation) => (
              <span
                key={relation.id}
                className="flex max-w-full items-center gap-1 rounded-md bg-muted px-2 py-1"
              >
                <span className="truncate">
                  {relation.project.title}
                  {relation.isCover ? " · Cover" : ""}
                </span>
                {onDetachRelation && (
                  <button
                    type="button"
                    title={`Detach from ${relation.project.title}`}
                    aria-label={`Detach from ${relation.project.title}`}
                    className="rounded p-1 hover:bg-background"
                    onClick={() => onDetachRelation(relation.id)}
                  >
                    <Unlink className="size-3" />
                  </button>
                )}
              </span>
            ))}
          {!inUse && (
            <span className="text-muted-foreground">
              Unused · Safe to delete
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

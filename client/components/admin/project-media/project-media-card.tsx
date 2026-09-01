"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Star, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ProjectMedia } from "@/services/project-media.service";
import Image from "next/image";

interface ProjectMediaCardProps {
  item: ProjectMedia;
  isBusy: boolean;
  onSetCover: (item: ProjectMedia) => void;
  onRemove: (id: string) => void;
}

export function ProjectMediaCard({
  item,
  isBusy,
  onSetCover,
  onRemove,
}: ProjectMediaCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 30 : 1,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative aspect-16/10 w-full min-w-0 overflow-hidden rounded-xl border border-border bg-slate-950 shadow-xs"
    >
      {/* Media Image */}
      <Image
        src={item.media.url}
        alt={item.media.alt ?? item.media.fileName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      {/* Top Bar: Cover Badge (Left) + Drag Handle (Right) */}
      <div className="absolute inset-x-2 top-2 z-10 flex items-center justify-between gap-1 pointer-events-none">
        {item.isCover ? (
          <div className="pointer-events-auto flex items-center gap-1 rounded-full bg-black/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
            <Star className="size-2.5 fill-white text-white" />
            <span>Cover</span>
          </div>
        ) : (
          <div />
        )}

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="pointer-events-auto flex size-6 shrink-0 items-center justify-center rounded-md bg-black/70 text-white backdrop-blur-md transition-colors hover:bg-black cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="size-3.5" />
        </button>
      </div>

      {/* Hover Action Overlay: Compact icon buttons that guaranteed fit */}
      <div className="absolute inset-0 z-20 flex items-center justify-center gap-1.5 bg-black/60 backdrop-blur-[2px] opacity-0 transition-opacity duration-200 group-hover:opacity-100 p-2">
        {isBusy ? (
          <Loader2 className="size-5 animate-spin text-white" />
        ) : (
          <>
            {!item.isCover && (
              <Button
                type="button"
                size="icon"
                variant="secondary"
                className="size-7 shrink-0 rounded-md bg-white text-slate-900 hover:bg-slate-100"
                onClick={() => onSetCover(item)}
                title="Set as Cover"
              >
                <Star className="size-3.5" />
              </Button>
            )}
            <Button
              type="button"
              size="icon"
              variant="destructive"
              className="size-7 shrink-0 rounded-md bg-red-600 text-white hover:bg-red-700"
              onClick={() => onRemove(item.id)}
              title="Delete Image"
            >
              <Trash2 className="size-3.5" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Loader2, Star, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectMedia } from "@/services/project-media.service";
import Image from "next/image";

interface SortableMediaCardProps {
    item: ProjectMedia;
    isBusy: boolean;
    onSetCover: (item: ProjectMedia) => void;
    onRemove: (id: string) => void;
}

export function SortableMediaCard({
    item,
    isBusy,
    onSetCover,
    onRemove,
}: SortableMediaCardProps) {
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
        zIndex: isDragging ? 20 : 1,
        opacity: isDragging ? 0.4 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="group relative aspect-16/10 overflow-hidden rounded-xl border border-border/60 bg-muted/30 shadow-sm transition-all hover:border-border hover:shadow-md"
        >
            <Image
                src={item.media.url}
                alt={item.media.alt ?? item.media.fileName}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Drag Handle - Top Right */}
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="absolute right-2 top-2 z-20 rounded-md bg-black/60 p-1.5 text-white/90 backdrop-blur-sm opacity-0 transition-opacity hover:bg-black/80 hover:text-white group-hover:opacity-100 cursor-grab active:cursor-grabbing"
                title="Drag to reorder"
            >
                <GripVertical className="size-4" />
            </button>

            {/* Cover Badge - Top Left */}
            {item.isCover && (
                <span className="absolute left-2.5 top-2.5 z-10 flex items-center gap-1.5 rounded-full bg-black/75 px-3 py-1 font-sans text-[11px] font-medium text-white backdrop-blur-md shadow-xs">
                    <Star className="size-3 fill-white text-white" />
                    Cover
                </span>
            )}

            {/* Action Overlay */}
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/45 backdrop-blur-[1px] opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {isBusy ? (
                    <Loader2 className="size-6 animate-spin text-white" />
                ) : (
                    <>
                        {!item.isCover && (
                            <Button
                                size="sm"
                                variant="secondary"
                                className="h-8 gap-1.5 bg-white/90 px-3 text-xs font-medium text-slate-900 hover:bg-white"
                                onClick={() => onSetCover(item)}
                            >
                                <Star className="size-3.5" />
                                Make Cover
                            </Button>
                        )}
                        <Button
                            size="icon"
                            variant="destructive"
                            className="size-8 rounded-lg bg-red-600/90 hover:bg-red-600"
                            onClick={() => onRemove(item.id)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}
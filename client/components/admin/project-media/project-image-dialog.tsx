"use client";

import { useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2, Image as ImageIcon } from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ImageUpload } from "@/components/admin/media/image-upload";
import { useProjectMedia } from "@/hooks/use-project-media";
import type { Media } from "@/services/media.service";
import type { ProjectMedia } from "@/services/project-media.service";
import { ProjectMediaCard } from "./project-media-card";

interface ProjectImageDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    projectId: string;
    projectTitle: string;
}

export function ProjectImageDialog({
    open,
    onOpenChange,
    projectId,
    projectTitle,
}: ProjectImageDialogProps) {
    const {
        projectMedia,
        loading,
        attachMediaAsync,
        updateProjectMediaAsync,
        removeMediaAsync,
        reorderMediaAsync,
        updating,
        removing,
    } = useProjectMedia(projectId);

    const [localItems, setLocalItems] = useState<ProjectMedia[] | null>(null);
    const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
    const [attaching, setAttaching] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);

    const items =
        localItems ??
        [...projectMedia].sort((a, b) => a.displayOrder - b.displayOrder);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    async function handleMediaChange(media: string | Media | null) {
        // If media is a string (e.g. raw URL), clear selected media and exit
        if (typeof media === "string") {
            setSelectedMedia(null);
            return;
        }

        setSelectedMedia(media);
        if (!media) return;

        try {
            setAttaching(true);
            await attachMediaAsync({
                projectId,
                mediaId: media.id,
                displayOrder: items.length,
                isCover: items.length === 0,
            });
            setLocalItems(null); 
            setSelectedMedia(null);
        } finally {
            setAttaching(false);
        }
    }

    async function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((i) => i.id === active.id);
            const newIndex = items.findIndex((i) => i.id === over.id);

            const reordered = arrayMove(items, oldIndex, newIndex).map(
                (item, index) => ({
                    ...item,
                    displayOrder: index,
                })
            );

            setLocalItems(reordered);

            const payload = reordered.map((item) => ({
                id: item.id,
                displayOrder: item.displayOrder,
            }));

            await reorderMediaAsync(payload);
        }
    }

    async function handleSetCover(item: ProjectMedia) {
        if (item.isCover) return;
        try {
            setActiveId(item.id);
            setLocalItems(null);
            await updateProjectMediaAsync({
                id: item.id,
                data: { isCover: true },
            });
        } finally {
            setActiveId(null);
        }
    }

    async function handleRemove(id: string) {
        try {
            setActiveId(id);
            setLocalItems(null);
            await removeMediaAsync(id);
        } finally {
            setActiveId(null);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-5xl p-6 sm:p-8">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold">Project Images</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Manage and reorder images for{" "}
                        <strong className="text-foreground">{projectTitle}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="mt-4 space-y-6">
                    {/* Main Upload Dropzone */}
                    <div className="rounded-2xl border bg-card/60 p-2">
                        <ImageUpload
                            value={selectedMedia}
                            onChange={handleMediaChange}
                            folder="/portfolio/projects"
                            disabled={attaching}
                        />
                        {attaching && (
                            <div className="flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground">
                                <Loader2 className="size-4 animate-spin" />
                                Attaching image...
                            </div>
                        )}
                    </div>

                    {/* Section Divider Header */}
                    {items.length > 0 && (
                        <div className="flex items-center justify-between border-b pb-3">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                Attached Images ({items.length})
                            </span>
                            <span className="text-xs text-muted-foreground">
                                Drag cards to reorder display
                            </span>
                        </div>
                    )}

                    {/* Image Grid */}
                    {loading ? (
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="aspect-16/10 animate-pulse rounded-2xl bg-muted"
                                />
                            ))}
                        </div>
                    ) : items.length ? (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={items.map((i) => i.id)}
                                strategy={rectSortingStrategy}
                            >
                                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                                    {items.map((item) => (
                                        <ProjectMediaCard
                                            key={item.id}
                                            item={item}
                                            isBusy={
                                                activeId === item.id && (updating || removing)
                                            }
                                            onSetCover={handleSetCover}
                                            onRemove={handleRemove}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    ) : (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-14 text-center">
                            <div className="mb-3 rounded-full bg-muted p-3">
                                <ImageIcon className="size-6 text-muted-foreground" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">
                                No images attached yet
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                                Upload an image above to attach it directly.
                            </p>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
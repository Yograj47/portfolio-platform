"use client";

import { Image as ImageIcon } from "lucide-react";

import type { Media } from "@/services/media.service";
import { MediaCard } from "./media-card";

interface MediaProjectSectionProps {
  projectName: string;
  media: Media[];
  onDelete: (media: Media) => void;
  onDetach?: (projectMediaId: string) => void;
}

export function MediaProjectSection({
  projectName,
  media,
  onDelete,
  onDetach,
}: MediaProjectSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex size-8 items-center justify-center rounded-lg bg-muted">
            <ImageIcon className="size-4 text-muted-foreground" />
          </div>

          <div>
            <h2 className="font-semibold">{projectName}</h2>
            <p className="text-xs text-muted-foreground">
              {media.length} {media.length === 1 ? "image" : "images"}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {media.map((item) => {
          const activeRelation = item.projects?.find((p) => p.isActive);

          return (
            <MediaCard
              key={item.id}
              media={item}
              onDelete={onDelete}
              onDetach={
                activeRelation && onDetach
                  ? () => onDetach(activeRelation.id)
                  : undefined
              }
            />
          );
        })}
      </div>
    </section>
  );
}
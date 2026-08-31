"use client";

import type { Media } from "@/services/media.service";
import { MediaCard } from "./media-card";

interface MediaGridProps {
  media: Media[];
  onDelete: (media: Media) => void;
}

export function MediaGrid({
  media,
  onDelete,
}: MediaGridProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {media.map((item) => (
        <MediaCard
          key={item.id}
          media={item}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
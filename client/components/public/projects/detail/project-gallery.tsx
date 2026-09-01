"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProjectMediaItem } from "@/lib/validations/project";

interface ProjectGalleryProps {
  mediaList?: ProjectMediaItem[];
}

export function ProjectGallery({ mediaList = [] }: ProjectGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!mediaList.length) return null;

  const currentMedia = mediaList[selectedIndex] || mediaList[0];

  return (
    <div className="space-y-3">
      {/* Container with Ambient Blur Fill */}
      <div className="relative aspect-16/10 w-full overflow-hidden border border-border/60 bg-black/5 dark:bg-white/5 shadow-xs">
        {/* Blurred Background to fill empty aspect gaps */}
        <Image
          src={currentMedia.media.url}
          alt=""
          aria-hidden="true"
          fill
          priority
          className="object-cover blur-2xl opacity-40 scale-110 pointer-events-none select-none"
        />

        {/* Uncropped Main Display */}
        <Image
          src={currentMedia.media.url}
          alt={currentMedia.media.fileName || "Project media preview"}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 50vw"
          className="object-contain transition-all duration-300 drop-shadow-md"
        />
      </div>

      {/* Thumbnails */}
      {mediaList.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
          {mediaList.map((item: ProjectMediaItem, idx: number) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${selectedIndex === idx
                  ? "border-primary ring-2 ring-primary/20 scale-[0.98]"
                  : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <Image
                src={item.media.url}
                alt={item.media.fileName || "Thumbnail"}
                fill
                sizes="96px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
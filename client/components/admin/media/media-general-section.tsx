import type { Media } from "@/services/media.service";
import { MediaCard } from "./media-card";

interface MediaGeneralSectionProps {
  media: Media[];
  onDelete: (media: Media) => void;
  onAttach: (media: Media) => void;
  onRestore?: (projectMediaId: string) => void;
}

export function MediaGeneralSection({
  media,
  onDelete,
  onAttach,
  onRestore,
}: MediaGeneralSectionProps) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        General Media ({media.length})
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {media.map((item) => (
          <MediaCard
            key={item.id}
            media={item}
            onDelete={onDelete}
            onAttach={() => onAttach(item)}
            onRestore={onRestore}
          />
        ))}
      </div>
    </section>
  );
}
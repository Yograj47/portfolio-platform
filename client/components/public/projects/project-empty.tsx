import { FolderSearch } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectEmptyProps {
  onReset?: () => void;
}

export function ProjectEmpty({ onReset }: ProjectEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/30 py-16 text-center backdrop-blur-sm">
      <div className="mb-4 flex size-12 items-center justify-center rounded-2xl border bg-muted/60 shadow-inner">
        <FolderSearch className="size-6 text-muted-foreground" />
      </div>

      <h3 className="text-base font-semibold text-foreground">
        No projects match this category
      </h3>

      <p className="mt-1 text-xs text-muted-foreground">
        Try selecting another filter or clear all filters to view all work.
      </p>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          className="mt-5 rounded-full text-xs font-medium"
        >
          Clear Filter
        </Button>
      )}
    </div>
  );
}
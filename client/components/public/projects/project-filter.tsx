"use client";

import { cn } from "@/lib/utils";

interface ProjectFilterProps {
  categories: {
    id: string;
    name: string;
  }[];
  selected: string | null;
  onChange: (category: string | null) => void;
}

export function ProjectFilter({
  categories,
  selected,
  onChange,
}: ProjectFilterProps) {
  return (
    <div className="inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full border bg-muted/40 p-1.5 backdrop-blur-sm scrollbar-none">
      <button
        type="button"
        onClick={() => onChange(null)}
        className={cn(
          "rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
          selected === null
            ? "bg-background text-foreground shadow-sm ring-1 ring-border"
            : "text-muted-foreground hover:text-foreground hover:bg-background/50"
        )}
      >
        All Projects
      </button>

      {categories.map((category) => {
        const isSelected = selected === category.id;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-medium transition-all duration-200",
              isSelected
                ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                : "text-muted-foreground hover:text-foreground hover:bg-background/50"
            )}
          >
            {category.name}
          </button>
        );
      })}
    </div>
  );
}
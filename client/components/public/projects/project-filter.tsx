"use client";

import { useRef, useTransition, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  name: string;
}

interface ProjectFilterProps {
  categories: Category[];
  selected: string | null;
  onChange: (category: string | null) => void;
  debounceMs?: number;
}

export function ProjectFilter({
  categories,
  selected,
  onChange,
  debounceMs = 150,
}: ProjectFilterProps) {
  const [isPending, startTransition] = useTransition();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up timer on component unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSelect = (categoryId: string | null) => {
    if (selected === categoryId) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      startTransition(() => {
        onChange(categoryId);
      });
    }, debounceMs);
  };

  return (
    <nav
      aria-label="Filter projects by category"
      className="group relative flex w-full max-w-full items-center"
    >
      <div
        className={cn(
          "inline-flex w-full items-center gap-1.5 overflow-x-auto rounded-full border border-border/50 bg-muted/30 p-1 backdrop-blur-md transition-opacity scrollbar-none sm:w-auto",
          isPending && "opacity-70"
        )}
      >
        <button
          type="button"
          onClick={() => handleSelect(null)}
          className={cn(
            "relative cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-ring",
            selected === null
              ? "bg-background text-foreground border border-border/60 shadow-xs"
              : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
          )}
        >
          <span>All Projects</span>
        </button>

        {categories.map((category) => {
          const isSelected = selected === category.id;

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => handleSelect(category.id)}
              className={cn(
                "relative shrink-0 cursor-pointer rounded-full px-3.5 py-1.5 text-xs font-medium transition-all duration-200 select-none focus-visible:outline-2 focus-visible:outline-ring",
                isSelected
                  ? "bg-background text-foreground border border-border/60 shadow-xs"
                  : "text-muted-foreground hover:bg-background/40 hover:text-foreground"
              )}
            >
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
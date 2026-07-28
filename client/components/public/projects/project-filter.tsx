"use client";

import { Button } from "@/components/ui/button";

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
    <div className="flex flex-wrap gap-2">
      <Button
        variant={
          selected === null
            ? "default"
            : "outline"
        }
        size="sm"
        onClick={() => onChange(null)}
      >
        All
      </Button>

      {categories.map((category) => (
        <Button
          key={category.id}
          variant={
            selected === category.id
              ? "default"
              : "outline"
          }
          size="sm"
          onClick={() =>
            onChange(category.id)
          }
        >
          {category.name}
        </Button>
      ))}
    </div>
  );
}
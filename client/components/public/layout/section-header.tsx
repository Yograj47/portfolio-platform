import { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: ReactNode;
}

export function SectionHeader({
  title,
  description,
  icon,
}: SectionHeaderProps) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-2">
        {icon}

        <h2 className="font-mono text-xl font-semibold">
          {title}
        </h2>
      </div>

      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      )}
    </header>
  );
}
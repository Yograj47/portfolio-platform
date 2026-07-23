import { ReactNode } from "react";

import {
  FileCode2,
  FolderOpen,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";

interface FileViewProps {
  title: string;
  meta?: string;
  folder?: boolean;
  children: ReactNode;
}

export function FileView({
  title,
  meta,
  folder = false,
  children,
}: FileViewProps) {
  const Icon = folder ? FolderOpen : FileCode2;

  return (
    <section className="px-8 py-6">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="size-5 text-primary" />

            <h1 className="font-mono text-lg font-semibold">
              {title}
            </h1>
          </div>

          {meta && (
            <span className="font-mono text-xs text-muted-foreground">
              {meta}
            </span>
          )}
        </div>

        <Separator />
      </header>

      <div className="py-8">
        {children}
      </div>
    </section>
  );
}
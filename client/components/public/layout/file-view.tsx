import { ReactNode } from "react";
import { FileCode2, FolderOpen, LucideIcon } from "lucide-react";

interface FileViewProps {
  title: string;
  meta?: string;
  description?: string;
  folder?: boolean;
  icon?: LucideIcon;
  actions?: ReactNode;
  children: ReactNode;
}

export function FileView({
  title,
  meta,
  description,
  folder = false,
  icon: CustomIcon,
  actions,
  children,
}: FileViewProps) {
  const Icon = CustomIcon || (folder ? FolderOpen : FileCode2);

  return (
    <section className="space-y-6 px-4 py-6 sm:px-8">
      {/* IDE Header Shell */}
      <header className="rounded-2xl border border-border/60 bg-card/40 p-5 backdrop-blur-xs sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Icon & File Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
              <Icon className="size-4" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h1 className="truncate font-mono text-base font-semibold tracking-tight text-foreground sm:text-lg">
                  {title}
                </h1>
                {meta && (
                  <span className="hidden shrink-0 rounded-md border border-border/60 bg-muted/70 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:inline-block">
                    {meta}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions & Mobile Meta Badge */}
          <div className="flex items-center justify-between gap-3 sm:justify-end">
            {meta && (
              <span className="inline-block shrink-0 rounded-md border border-border/60 bg-muted/70 px-2 py-0.5 font-mono text-[11px] font-medium text-muted-foreground sm:hidden">
                {meta}
              </span>
            )}
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </div>
        </div>

        {/* Subtitle / Description */}
        {description && (
          <p className="mt-4 border-t border-border/40 pt-3 text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </header>

      {/* Main Content Area */}
      <div className="w-full">{children}</div>
    </section>
  );
}
import { Database, Terminal } from "lucide-react";

export function SkillsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {/* Decorative Radial Empty Target */}
      <div className="relative flex size-48 items-center justify-center rounded-full border border-dashed border-muted-foreground/30 bg-muted/10 p-6">
        <div className="flex size-32 items-center justify-center rounded-full border bg-card shadow-xs">
          <Database className="size-10 text-muted-foreground/60" />
        </div>
        
        <div className="absolute top-2 right-4 flex items-center gap-1 rounded-full border bg-card px-2 py-0.5 text-[10px] font-mono text-muted-foreground shadow-xs">
          <Terminal className="size-3" />
          <span>0 items</span>
        </div>
      </div>

      <h3 className="mt-6 font-mono text-lg font-bold tracking-tight">
        &gt; NO_SKILLS_FOUND
      </h3>

      <p className="mt-1 max-w-sm text-xs text-muted-foreground">
        Database record empty. Skills and technology stack entries will appear here soon.
      </p>
    </div>
  );
}
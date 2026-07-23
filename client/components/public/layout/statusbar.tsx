"use client";

export function Statusbar() {
  return (
    <footer className="flex h-8 items-center justify-between border-t bg-muted/30 px-4 text-xs text-muted-foreground">
      <span>Workspace</span>

      <span>Ready</span>
    </footer>
  );
}
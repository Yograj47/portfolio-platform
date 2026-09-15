import React from "react";

export function WelcomeMessage() {
  return (
    <div className="mb-6 space-y-4 font-mono text-xs sm:text-sm">
      {/* System Banner */}
      <div className="space-y-1 border-b border-border/40 pb-3 text-muted-foreground">
        <p className="font-semibold text-foreground">
          Yograj Workspace [Version 1.1.1-release]
        </p>
        <p>(c) Yograj OS Corporation. All rights reserved.</p>
        <p className="text-xs opacity-75">
          Type <span className="font-medium text-primary">help</span> to explore or use <span className="font-medium text-primary">ls</span> to view directory tree.
        </p>
      </div>

      {/* Quick Start Commands */}
      <div className="space-y-2">
        <p className="font-semibold tracking-wide text-foreground">
          Quick Start Commands:
        </p>

        <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-1.5 sm:grid-cols-[150px_1fr]">
          <span className="font-semibold text-primary">help</span>
          <span className="text-muted-foreground">List available commands.</span>

          <span className="font-semibold text-primary">ls</span>
          <span className="text-muted-foreground">Browse workspace items.</span>

          <span className="font-semibold text-primary">open Projects</span>
          <span className="text-muted-foreground">Open a workspace item.</span>

          <span className="font-semibold text-primary">contact</span>
          <span className="text-muted-foreground">Show contact information.</span>

          <span className="font-semibold text-primary">clear</span>
          <span className="text-muted-foreground">Clear terminal history.</span>
        </div>
      </div>

      {/* Tip Notice */}
      <div className="rounded border border-primary/20 bg-primary/5 p-2 text-xs text-muted-foreground">
        <span className="font-medium text-primary">Tip:</span> Commands are case-insensitive. You can use either the file name or any listed alias.
      </div>
    </div>
  );
}
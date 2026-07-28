export function TerminalHeader() {
    return (
        <header className="flex h-12 items-center justify-between border-b px-6 font-mono text-sm">
            <div className="flex items-center gap-3">
                <span className="font-semibold">
                    Portfolio Workspace
                </span>

                <span className="text-muted-foreground">
                    /
                </span>

                <span className="text-muted-foreground">
                    Interactive Shell
                </span>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <span>main</span>

                <span>v1.0.0</span>

                <span className="text-emerald-500">
                    ● Ready
                </span>
            </div>
        </header>
    );
}
import { TerminalEntry } from "@/types/terminal.type";
import { TerminalPrompt } from "./terminal-prompt";
import { TERMINAL_PATHS } from "./workspace/terminal-workspace.type";

interface TerminalHistoryProps {
    history: TerminalEntry[];
}

export function TerminalHistory({
    history,
}: TerminalHistoryProps) {
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3">
            {history.map((entry) => (
                <div key={entry.id}>
                    {entry.type === "command" ? (
                        <div className="flex items-center gap-1 font-mono text-sm leading-none">
                            <TerminalPrompt
                                path={entry.cwd ?? TERMINAL_PATHS.ROOT}
                            />

                            <span>{entry.value}</span>
                        </div>
                    ) : (
                        <div className="pl-2">
                            {entry.value}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
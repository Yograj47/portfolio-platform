import { TerminalEntry } from "@/types/terminal.type";
import { TerminalPrompt } from "./terminal-prompt";

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
                        <div className="flex items-center gap-2">
                            <TerminalPrompt/>

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
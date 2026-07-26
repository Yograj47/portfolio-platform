import { findEntry } from "@/lib/terminal/fileSystem";
import { TerminalCommand } from "@/types/terminal.type";

export const openCommand: TerminalCommand = {
    name: "open",
    description: "Open a workspace item.",
    execute(args) {

        const target = args.join(" ").trim();

        if (!target) {
            return {
                output: (
                    <span className="text-destructive">
                        Missing target.
                    </span>
                ),
            };
        }

        const entry = findEntry(target);

        if (!entry) {
            return {
                output: (
                    <span className="text-destructive">
                        open: '{target}' not found.
                    </span>
                ),
            };
        }

        window.open(entry.route, "_blank", "noopener,noreferrer");
    },
};
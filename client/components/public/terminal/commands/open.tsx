import { findEntryByPath } from "@/lib/terminal/fileSystem";
import { resolvePath } from "@/lib/terminal/navigation";
import { TerminalCommand } from "@/types/terminal.type";

export const openCommand: TerminalCommand = {
    name: "open",
    description: "Open a workspace item.",
    execute(args, context) {

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

        const path = resolvePath(
            context.cwd,
            args.join(" ").trim()
        );

        if (!path) {
            return {
                output: (
                    <span className="text-destructive">
                        cd: path not found
                    </span>
                )
            }
        }

        const entry = findEntryByPath(path);

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
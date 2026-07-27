import { findEntryByPath, rootWorkspace } from "@/lib/terminal/fileSystem";
import { resolvePath } from "@/lib/terminal/navigation";
import { TerminalCommand } from "@/types/terminal.type";

export const cdCommand: TerminalCommand = {
    name: "cd",
    description: "Change directory.",
    execute(args, context) {

        const target = args.join(" ").trim();

        if (!target) {
            return {
                output: (
                    <span className="text-destructive">
                        Missing directory.
                    </span>
                ),
            };
        }

        const path = resolvePath(
            context.cwd,
            target
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
                        cd: directory not found: {target}
                    </span>
                ),
            };
        }

        if (entry.type !== "directory") {
            return {
                output: (
                    <div className="space-y-1">

                        <p className="text-destructive">
                            cd: {entry.name} is not a directory.
                        </p>

                        <p className="text-muted-foreground">
                            Hint: use{" "}
                            <span className="text-primary">
                                open {entry.name}
                            </span>
                        </p>

                    </div>
                ),
            };
        }

        context.setCwd(entry.path);
    },
};
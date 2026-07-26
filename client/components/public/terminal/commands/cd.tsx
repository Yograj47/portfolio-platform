import { rootWorkspace } from "@/lib/terminal/fileSystem";
import { TerminalCommand } from "@/types/terminal.type";
import { TERMINAL_PATHS } from "../workspace/terminal-workspace.type";

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

        switch (target) {
            case "..":
            case "/":
                context.setCwd(
                    TERMINAL_PATHS.ROOT
                );
                return;

        }

        const entry = rootWorkspace.find(
            (item) =>
                item.name.toLowerCase() === target.toLowerCase()
        );

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
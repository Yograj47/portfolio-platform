import { findEntryByPath, rootWorkspace } from "@/lib/terminal/fileSystem";
import { TerminalCommand } from "@/types/terminal.type";
import { TERMINAL_PATHS } from "../workspace/terminal-workspace.type";
import { resolvePath } from "@/lib/terminal/navigation";


function renderWorkspace() {
    return (
        <div className="space-y-4 font-mono text-sm">

            <p className="text-muted-foreground">
                Workspace: /
            </p>

            <div className="grid grid-cols-[110px_180px_180px_1fr] gap-y-2">

                <span className="font-semibold">
                    Type
                </span>

                <span className="font-semibold">
                    Name
                </span>

                <span className="font-semibold">
                    Alias
                </span>

                <span className="font-semibold">
                    Description
                </span>

                <div className="col-span-4 border-b" />

                {rootWorkspace.map((item) => (
                    <div
                        key={item.name}
                        className="contents"
                    >
                        <span className="text-muted-foreground capitalize">
                            {item.type}
                        </span>

                        <span>
                            {item.name}
                            {item.type === "directory" ? "/" : ""}
                        </span>

                        <span className="text-primary">
                            {item.aliases.join(", ")}
                        </span>

                        <span className="text-muted-foreground">
                            {item.description}
                        </span>
                    </div>
                ))}

            </div>

            <p className="text-xs text-muted-foreground">
                Tip: Commands are case-insensitive. You can use either the file name or any listed alias.
            </p>

        </div>
    );
}

function renderProjects() {
    return (
        <div className="space-y-2 font-mono text-sm">

            <p className="text-muted-foreground">
                Workspace: /Projects
            </p>

            <p>
                Loading project index...
            </p>

        </div>
    );
}

export const lsCommand: TerminalCommand = {
    name: "ls",
    description: "List workspace items.",

    execute(args, context) {
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

        if (path === TERMINAL_PATHS.ROOT) {
            return {
                output: renderWorkspace(),
            };
        }

        const entry = findEntryByPath(path);

        if (!entry) {
            return {
                output: (
                    <span className="text-destructive">
                        ls: cannot access {path}: No such file or directory.
                    </span>
                ),
            };
        }

        switch (entry.path) {

            case TERMINAL_PATHS.PROJECTS:
                return {
                    output: renderProjects(),
                };

            case TERMINAL_PATHS.BLOG:
                return {
                    output: (
                        <span>
                            Blog directory is currently unavailable.
                        </span>
                    ),
                };

            default:
                return {
                    output: (
                        <span className="text-destructive">
                            ls: {entry.name} is not a directory.
                        </span>
                    ),
                };
        }
    }
};
import { rootWorkspace } from "@/lib/terminal/fileSystem";
import { TerminalCommand } from "@/types/terminal.type";
import { TERMINAL_PATHS } from "../workspace/terminal-workspace.type";

function renderWorkspace() {
    return (
        <div className="space-y-4 font-mono text-sm">

            <p className="text-muted-foreground">
                Workspace: /
            </p>

            <div className="grid grid-cols-[120px_180px_1fr] gap-y-2">

                <span className="font-semibold">
                    Type
                </span>

                <span className="font-semibold">
                    Name
                </span>

                <span className="font-semibold">
                    Description
                </span>

                <div className="col-span-3 border-b" />

                {rootWorkspace.map((item) => (
                    <div
                        key={item.name}
                        className="contents"
                    >
                        <span className="text-muted-foreground">
                            {item.type}
                        </span>

                        <span>
                            {item.name}
                            {item.type === "directory" ? "/" : ""}
                        </span>

                        <span className="text-muted-foreground">
                            {item.description}
                        </span>
                    </div>
                ))}

            </div>

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

        const target =
            args.join(" ").trim() || context.cwd;

        switch (target.toLowerCase()) {

            case TERMINAL_PATHS.ROOT:
                return {
                    output: renderWorkspace(),
                };

            case "projects":
            case "./projects":
            case "./projects/":
            case "/projects":
                return {
                    output: renderProjects(),
                };

            default:
                return {
                    output: (
                        <span className="text-destructive">
                            ls: cannot access '{target}': No such file or directory.
                        </span>
                    ),
                };
        }
    },
};
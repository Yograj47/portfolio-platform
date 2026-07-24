import { TerminalCommand } from "@/types/terminal.type";

export const helpCommand: TerminalCommand = {
    name: "help",

    execute() {
        return {
            output: (
                <div className="font-mono text-sm">

                    <p className="font-semibold">
                        Portfolio Workspace{" "}
                        <span className="text-muted-foreground">
                            v1.0.0
                        </span>
                    </p>

                    <p className="mt-5 mb-2 text-muted-foreground uppercase tracking-wider">
                        Available Commands
                    </p>

                    <div className="mb-3 border-t" />

                    <div className="grid grid-cols-[170px_1fr] gap-y-2">

                        <span className="font-medium text-primary">
                            help
                        </span>
                        <span className="text-muted-foreground">
                            Show available commands.
                        </span>

                        <span className="font-medium text-primary">
                            ls
                        </span>
                        <span className="text-muted-foreground">
                            List current workspace.
                        </span>

                        <span className="font-medium text-primary">
                            open &lt;target&gt;
                        </span>
                        <span className="text-muted-foreground">
                            Open a workspace item.
                        </span>

                        <span className="font-medium text-primary">
                            clear
                        </span>
                        <span className="text-muted-foreground">
                            Clear terminal history.
                        </span>

                        <span className="font-medium text-primary">
                            about
                        </span>
                        <span className="text-muted-foreground">
                            Display information about me.
                        </span>

                        <span className="font-medium text-primary">
                            contact
                        </span>
                        <span className="text-muted-foreground">
                            Show contact information.
                        </span>

                        <span className="font-medium text-primary">
                            theme
                        </span>
                        <span className="text-muted-foreground">
                            Switch terminal theme.
                        </span>

                    </div>

                </div>
            ),
        };
    },
};
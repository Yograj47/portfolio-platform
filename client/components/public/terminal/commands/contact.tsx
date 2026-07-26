import { TerminalCommand } from "@/types/terminal.type";

export const contactCommand: TerminalCommand = {
    name: "contact",
    description: "Show contact information.",
    available: false,

    execute() {
        return {
            output: (
                <span className="text-muted-foreground">
                    This command will be available in a future release.
                </span>
            ),
        };
    },
};
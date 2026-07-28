import { TerminalCommand } from "@/types/terminal.type";

export const aboutCommand: TerminalCommand = {
    name: "about",
    description: "About me.",
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
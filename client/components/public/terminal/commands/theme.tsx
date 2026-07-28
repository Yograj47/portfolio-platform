import { TerminalCommand } from "@/types/terminal.type";

export const themeCommand: TerminalCommand = {
    name: "theme",
    description: "Switch terminal theme.",
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
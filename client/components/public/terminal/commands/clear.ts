import { TerminalCommand } from "@/types/terminal.type";

export const clearCommand: TerminalCommand = {
    name: "clear",

    execute(_, context) {
        context.clearHistory();

        return {};
    },
};
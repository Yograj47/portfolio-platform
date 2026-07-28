import { TerminalCommand } from "@/types/terminal.type";

export const clearCommand: TerminalCommand = {
    name: "clear",
    description: "Clear terminal history.",
    execute(_, context) {
        context.clearHistory();

        return {};
    },
};
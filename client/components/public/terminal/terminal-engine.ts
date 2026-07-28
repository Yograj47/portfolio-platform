import {
    CommandResult,
    TerminalCommand,
    TerminalContext,
} from "@/types/terminal.type";

export class TerminalEngine {
    constructor(
        private readonly commands: Record<
            string,
            TerminalCommand
        >
    ) { }

    execute(
        input: string,
        context: TerminalContext
    ): CommandResult {
        const trimmed = input.trim();

        if (!trimmed) {
            return {};
        }

        const [name, ...args] =
            trimmed.split(/\s+/);

        const command =
            this.commands[name.toLowerCase()];

        if (!command) {
            return {
                output: `Command not found: ${name}`,
            };
        }

        return (
            command.execute(args, context) ?? {}
        );
    }
}
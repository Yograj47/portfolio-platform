import { TerminalCommand } from "@/types/terminal.type";
import { commandRegistry } from ".";

export const helpCommand: TerminalCommand = {
    name: "help",
    description: "Show available commands.",

    execute() {

        const commands = Object.values(commandRegistry);

        return {
            output: (
                <div className="font-mono text-sm">

                    <p className="font-semibold">
                        Portfolio Workspace{" "}
                        <span className="text-muted-foreground">
                            v1.0.0
                        </span>
                    </p>

                    <p className="mt-5 mb-2 uppercase tracking-wider text-muted-foreground">
                        Available Commands
                    </p>

                    <div className="mb-3 border-t" />

                    <div className="grid grid-cols-[180px_1fr] gap-y-2">

                        {commands.map((command) => (
                            <div
                                key={command.name}
                                className="contents"
                            >
                                <span className="font-medium text-primary">
                                    {command.name}
                                </span>

                                <span
                                    className={
                                        command.available === false
                                            ? "text-yellow-500"
                                            : "text-muted-foreground"
                                    }
                                >
                                    {command.description}
                                    {command.available === false &&
                                        " (Coming soon)"}
                                </span>
                            </div>
                        ))}

                    </div>

                </div>
            ),
        };
    },
};
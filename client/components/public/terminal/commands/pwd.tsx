import { TerminalCommand } from "@/types/terminal.type";

export const pwdCommand: TerminalCommand = {
    name: "pwd",
    description: "Print current working directory.",
    execute(_, context) {
        return {
            output: (
                <div className="font-mono text-sm">
                    <span className="text-primary">
                        {context.cwd}
                    </span>
                </div>
            ),
        };
    },
};
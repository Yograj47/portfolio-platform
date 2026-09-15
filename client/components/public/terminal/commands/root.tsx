import { TerminalCommand } from "@/types/terminal.type";

export const rootCommand: TerminalCommand = {
    name: "root",
    description: "Authenticate as root.",
    execute(args) {
        const password = args.join(" ").trim();

        if (!password) {
            return {
                output: (
                    <span className="text-destructive">
                        Access denied.
                    </span>
                ),
            };
        }

        const secret =
            process.env.NEXT_PUBLIC_TERMINAL_ROOT_PASSWORD;

        if (password !== secret) {
            return {
                output: (
                    <span className="text-destructive">
                        Authentication failed.
                    </span>
                ),
            };
        }

        return {
            output: (
                <span className="text-emerald-500">
                    Access granted.
                </span>
            ),
            action: {
                type: "ROOT_AUTH",
            },
        };
    },

};

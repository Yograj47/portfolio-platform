import { TerminalCommand } from "@/types/terminal.type";

export const rootCommand: TerminalCommand = {
    name: "root",
    description: "",

    execute(args, context) {
        const password =
            args.join(" ").trim();

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
            process.env
                .NEXT_PUBLIC_TERMINAL_ROOT_PASSWORD;

        if (password !== secret) {
            return {
                output: (
                    <span className="text-destructive">
                        Authentication failed.
                    </span>
                ),
            };
        }

        document.cookie =
            "terminal-access=1; Path=/; Max-Age=60; SameSite=Lax";

        context.router.push("/login");

        return {
            output: (
                <span className="text-emerald-500">
                    Access granted.
                </span>
            ),
        };
    },
};
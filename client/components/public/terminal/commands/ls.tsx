import { TerminalCommand } from "@/types/terminal.type";

export const lsCommand: TerminalCommand = {
    name: "ls",

    execute() {
        return {
            output: (
                <div className="space-y-1">
                    <p>README.md</p>
                    <p>Projects/</p>
                    <p>Skills.db</p>
                    <p>Timeline.log</p>
                    <p>Blog/</p>
                </div>
            ),
        };
    },
};
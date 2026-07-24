import { TerminalCommand } from "@/types/terminal.type";

const routes: Record<string, string> = {
    "README.md": "/readme",
    Projects: "/projects",
    "Skills.db": "/skills",
    "Timeline.log": "/timeline",
    Blog: "/blog",
};

export const openCommand: TerminalCommand = {
    name: "open",

    execute(args, context) {
        const target = args.join(" ");

        const route = routes[target];

        if (!route) {
            return {
                output: `Unknown target: ${target}`,
            };
        }

        context.router.push(route);

        return {};
    },
};
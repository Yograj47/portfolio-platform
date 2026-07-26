import { TerminalPath } from "./terminal-workspace.type";

export function resolvePath(
    cwd: TerminalPath,
    target?: string
): TerminalPath | null {

    if (!target || target === ".") {
        return cwd;
    }

    const normalized = target
        .trim()
        .replace(/\\/g, "/")
        .replace(/\/+$/, "");

    switch (normalized.toLowerCase()) {

        case "..":
            return "/";

        case "projects":
        case "./projects":
        case "/projects":
            return "/Projects";

        case "/":
            return "/";

        default:
            return null;
    }
}
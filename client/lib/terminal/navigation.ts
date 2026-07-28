import { findEntry } from "./fileSystem";

import {
    TERMINAL_PATHS,
    TerminalPath,
} from "@/components/public/terminal/workspace/terminal-workspace.type";

export function normalizeTarget(target: string) {
    return target
        .trim()
        .replace(/\\/g, "/")
        .replace(/\/+$/, "");
}

export function resolvePath(
    cwd: TerminalPath,
    target?: string
): TerminalPath | null {

    if (!target || target === ".") {
        return cwd;
    }

    const normalized = normalizeTarget(target);

    switch (normalized) {

        case "/":
            return TERMINAL_PATHS.ROOT;

        case "..":
            return cwd === TERMINAL_PATHS.ROOT
                ? TERMINAL_PATHS.ROOT
                : TERMINAL_PATHS.ROOT;
    }

    if (normalized.startsWith("../")) {

        const entry = findEntry(
            normalized.slice(3)
        );

        return entry?.path ?? null;
    }

    if (normalized.startsWith("./")) {

        const entry = findEntry(
            normalized.slice(2)
        );

        return entry?.path ?? null;
    }

    const entry = findEntry(normalized);

    return entry?.path ?? null;
}
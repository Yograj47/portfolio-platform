import { findEntry } from "./fileSystem";

import {
    TERMINAL_PATHS,
    TerminalPath,
} from "@/components/public/terminal/workspace/terminal-workspace.type";

export function normalizeTarget(target: string) {
    return target
        .trim()
        .replace(/\\/g, "/")
        .replace(/\/+/g, "/")
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

    // Explicit root
    if (normalized === "/") {
        return TERMINAL_PATHS.ROOT;
    }

    const baseSegments =
        cwd === TERMINAL_PATHS.ROOT
            ? []
            : cwd.split("/").filter(Boolean);

    const targetSegments = normalized
        .split("/")
        .filter(Boolean);

    // Absolute path starts from root
    if (normalized.startsWith("/")) {
        baseSegments.length = 0;
    }

    for (const segment of targetSegments) {
        if (segment === ".") {
            continue;
        }

        if (segment === "..") {
            if (baseSegments.length > 0) {
                baseSegments.pop();
            }

            continue;
        }

        baseSegments.push(segment);
    }

    const resolved =
        `/${baseSegments.join("/")}`;

    // Root is valid even though it isn't a FileSystemEntry.
    if (resolved === TERMINAL_PATHS.ROOT) {
        return TERMINAL_PATHS.ROOT;
    }

    const entry = findEntry(resolved);

    return entry?.path ?? null;
}
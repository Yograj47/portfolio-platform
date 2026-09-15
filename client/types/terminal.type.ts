import { ReactNode } from "react";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

import { TerminalPath } from "@/components/public/terminal/workspace/terminal-workspace.type";

export interface TerminalEntry {
    id: string;
    type: "command" | "output";
    value: ReactNode;
    cwd?: TerminalPath;
}

export interface TerminalContext {
    router: AppRouterInstance;
    cwd: TerminalPath;
    setCwd: (path: TerminalPath) => void;
    clearHistory: () => void;
    resetHistory: () => void;
}

export type TerminalAction = {
    type: "ROOT_AUTH";
};

export interface CommandResult {
    output?: ReactNode;
    action?: TerminalAction;
}

export interface TerminalCommand {
    name: string;
    description: string;
    available?: boolean;
    execute: (
        args: string[],
        context: TerminalContext
    ) => CommandResult | void;
}

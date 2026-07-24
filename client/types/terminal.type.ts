import { ReactNode } from "react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export interface TerminalEntry {
    id: string;
    type: "command" | "output";
    value: ReactNode;
}

export interface TerminalContext {
    router: AppRouterInstance;
    clearHistory: () => void;
}

export interface CommandResult {
    output?: ReactNode;
}

export interface TerminalCommand {
    name: string;

    execute: (
        args: string[],
        context: TerminalContext
    ) => CommandResult | void;
}
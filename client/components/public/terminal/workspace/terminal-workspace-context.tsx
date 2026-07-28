"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

import {
    TerminalPath,
    TerminalWorkspace,
} from "./terminal-workspace.type";

const Context =
    createContext<TerminalWorkspace | null>(null);

export function TerminalWorkspaceProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [cwd, setCwd] =
        useState<TerminalPath>("/");

    return (
        <Context.Provider
            value={{
                cwd,
                setCwd,
            }}
        >
            {children}
        </Context.Provider>
    );
}

export function useTerminalWorkspace() {
    const context = useContext(Context);

    if (!context) {
        throw new Error(
            "useTerminalWorkspace must be used inside TerminalWorkspaceProvider."
        );
    }

    return context;
}
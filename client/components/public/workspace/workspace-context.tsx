"use client";

import {
    createContext,
    ReactNode,
    useContext,
} from "react";

import { usePathname } from "next/navigation";

export type WorkspaceType =
    | "terminal"
    | "file"
    | "folder"
    | "database"
    | "log";

interface WorkspaceState {
    name: string;
    type: WorkspaceType;
}

const WorkspaceContext =
    createContext<WorkspaceState | null>(null);

function getWorkspace(pathname: string): WorkspaceState {

    switch (pathname) {

        case "/projects":
            return {
                name: "Projects",
                type: "folder",
            };

        case "/skills":
            return {
                name: "Skills.db",
                type: "database",
            };

        case "/timeline":
            return {
                name: "Timeline.log",
                type: "log",
            };

        case "/blog":
            return {
                name: "Blog",
                type: "folder",
            };

        default:
            return {
                name: "~",
                type: "terminal",
            };
    }
}

export function WorkspaceProvider({
    children,
}: {
    children: ReactNode;
}) {
    const pathname = usePathname();

    const workspace =
        getWorkspace(pathname);

    return (
        <WorkspaceContext.Provider
            value={workspace}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context =
        useContext(WorkspaceContext);

    if (!context) {
        throw new Error(
            "useWorkspace must be used inside WorkspaceProvider"
        );
    }

    return context;
}
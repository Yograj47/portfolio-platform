"use client";

import {
    createContext,
    useContext,
    useState,
    ReactNode,
} from "react";

interface WorkspaceState {
    title: string;
    path: string;

    setWorkspace: (
        title: string,
        path: string
    ) => void;
}

const WorkspaceContext =
    createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({
    children,
}: {
    children: ReactNode;
}) {
    const [title, setTitle] = useState("README.md");

    const [path, setPath] = useState(
        "Portfolio / README.md"
    );

    function setWorkspace(
        title: string,
        path: string
    ) {
        setTitle(title);
        setPath(path);
    }

    return (
        <WorkspaceContext.Provider
            value={{
                title,
                path,
                setWorkspace,
            }}
        >
            {children}
        </WorkspaceContext.Provider>
    );
}

export function useWorkspace() {
    const context = useContext(
        WorkspaceContext
    );

    if (!context) {
        throw new Error(
            "useWorkspace must be used inside WorkspaceProvider"
        );
    }

    return context;
}
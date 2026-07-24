"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

export type WorkspaceType =
  | "terminal"
  | "file"
  | "folder"
  | "database"
  | "log";

interface WorkspaceState {
  name: string;
  type: WorkspaceType;

  setWorkspace: (
    name: string,
    type: WorkspaceType
  ) => void;
}

const WorkspaceContext =
  createContext<WorkspaceState | null>(null);

export function WorkspaceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [name, setName] =
    useState("README.md");

  const [type, setType] =
    useState<WorkspaceType>("file");

  function setWorkspace(
    name: string,
    type: WorkspaceType
  ) {
    setName(name);
    setType(type);
  }

  return (
    <WorkspaceContext.Provider
      value={{
        name,
        type,
        setWorkspace,
      }}
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
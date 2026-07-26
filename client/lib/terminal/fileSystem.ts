import { TERMINAL_PATHS, TerminalPath } from "@/components/public/terminal/workspace/terminal-workspace.type";

export interface FileSystemEntry {
    name: string;
    path: TerminalPath;
    type: "directory" | "file" | "executable";
    route: string;
    description: string;
}
export const rootWorkspace: FileSystemEntry[] = [
    {
        name: "Projects",
        path: TERMINAL_PATHS.PROJECTS,
        type: "directory",
        route: "/projects",
        description: "Browse portfolio projects",
    },
    {
        name: "README.md",
        path: TERMINAL_PATHS.README,
        type: "file",
        route: "/readme",
        description: "Workspace overview",
    },
    {
        name: "Skills.db",
        path: TERMINAL_PATHS.SKILLS,
        type: "file",
        route: "/skills",
        description: "Skills database",
    },
    {
        name: "Timeline.log",
        path: TERMINAL_PATHS.TIMELINE,
        type: "file",
        route: "/timeline",
        description: "Career timeline",
    },
    {
        name: "Blog",
        path: TERMINAL_PATHS.BLOG,
        type: "directory",
        route: "/blogs",
        description: "Technical articles",
    },
    {
        name: "Contact.sh",
        path: TERMINAL_PATHS.CONTACT,
        type: "executable",
        route: "/contact",
        description: "Contact information",
    },
];

export function findEntry(target: string) {

    const normalized = target
        .replace(/^\.?\//, "")
        .replace(/\/$/, "")
        .toLowerCase();

    return rootWorkspace.find(
        (entry) =>
            entry.name.toLowerCase() === normalized
    );
}
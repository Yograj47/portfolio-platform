import {
    TERMINAL_PATHS,
    TerminalPath,
} from "@/components/public/terminal/workspace/terminal-workspace.type";

export interface FileSystemEntry {
    name: string;
    aliases: string[];
    path: TerminalPath;
    type: "directory" | "file" | "executable";
    route: string;
    description: string;
}

export const rootWorkspace: FileSystemEntry[] = [
    {
        name: "Projects",
        aliases: ["project", "projects"],
        path: TERMINAL_PATHS.PROJECTS,
        type: "directory",
        route: "/projects",
        description: "Browse portfolio projects",
    },
    {
        name: "Skills.db",
        aliases: ["skill", "skills"],
        path: TERMINAL_PATHS.SKILLS,
        type: "file",
        route: "/skills",
        description: "Technical skills database",
    },
    {
        name: "Timeline.log",
        aliases: ["timeline", "career", "experience"],
        path: TERMINAL_PATHS.TIMELINE,
        type: "file",
        route: "/timeline",
        description: "Career timeline",
    },
    {
        name: "Blogs",
        aliases: ["blog", "blogs", "article", "articles"],
        path: TERMINAL_PATHS.BLOG,
        type: "directory",
        route: "/blogs",
        description: "Technical articles",
    }
];

export function findEntry(target: string) {

    const normalized = target
        .trim()
        .replace(/^\.?\//, "")
        .replace(/\/$/, "")
        .toLowerCase();

    return rootWorkspace.find((entry) => {

        if (entry.name.toLowerCase() === normalized) {
            return true;
        }

        return entry.aliases.some(
            (alias) => alias.toLowerCase() === normalized
        );
    });
}

export function findEntryByPath(
    path: TerminalPath
) {
    return rootWorkspace.find(
        (entry) => entry.path === path
    );
}

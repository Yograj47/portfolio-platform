export const TERMINAL_PATHS = {
    ROOT: "/",
    PROJECTS: "/Projects",
    BLOG: "/Blog",

    README: "/README.md",
    SKILLS: "/Skills.db",
    TIMELINE: "/Timeline.log",
    CONTACT: "/Contact.sh",
} as const;

export type TerminalPath =
    (typeof TERMINAL_PATHS)[keyof typeof TERMINAL_PATHS];

export interface TerminalWorkspace {
    cwd: TerminalPath;

    setCwd: (path: TerminalPath) => void;
}
export const TERMINAL_PATHS = {
    ROOT: "/",

    PROJECTS: "/Projects",
    BLOG: "/Blog",

    SKILLS: "/Skills.db",
    TIMELINE: "/Timeline.log"
} as const;

export type TerminalPath =
    (typeof TERMINAL_PATHS)[keyof typeof TERMINAL_PATHS];

export interface TerminalWorkspace {
    cwd: TerminalPath;

    setCwd: (path: TerminalPath) => void;
}
import {
    LayoutDashboard,
    FolderKanban,
    Tags,
    Code2,
    GraduationCap,
    Mail,
    Settings,
} from "lucide-react";

export const sidebarItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Projects",
        href: "/dashboard/projects",
        icon: FolderKanban,
    },
    {
        title: "Categories",
        href: "/dashboard/categories",
        icon: Tags,
    },
    {
        title: "Skills",
        href: "/dashboard/skills",
        icon: Code2,
    },
    {
        title: "Timeline",
        href: "/dashboard/timeline",
        icon: GraduationCap,
    },
    {
        title: "Messages",
        href: "/dashboard/messages",
        icon: Mail,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];
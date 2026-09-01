import {
    LayoutDashboard,
    FolderKanban,
    Tags,
    Code2,
    GraduationCap,
    Mail,
    Settings,
    Images,
    type LucideIcon,
} from "lucide-react";

export interface SidebarItem {
    title: string;
    href: string;
    icon: LucideIcon;
    notActive?: boolean;
}

export const sidebarItems: SidebarItem[] = [
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
        title: "Media",
        href: "/dashboard/media",
        icon: Images,
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
        notActive: true,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        notActive: true,
    },
];
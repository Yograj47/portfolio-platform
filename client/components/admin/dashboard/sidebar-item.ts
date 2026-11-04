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
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Projects",
    href: "/admin/dashboard/projects",
    icon: FolderKanban,
  },
  {
    title: "Media",
    href: "/admin/dashboard/media",
    icon: Images,
  },
  {
    title: "Categories",
    href: "/admin/dashboard/categories",
    icon: Tags,
  },
  {
    title: "Skills",
    href: "/admin/dashboard/skills",
    icon: Code2,
  },
  {
    title: "Timeline",
    href: "/admin/dashboard/timeline",
    icon: GraduationCap,
  },
  {
    title: "Messages",
    href: "/admin/dashboard/messages",
    icon: Mail,
    notActive: true,
  },
  {
    title: "Settings",
    href: "/admin/dashboard/settings",
    icon: Settings,
    notActive: true,
  },
];

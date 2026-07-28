"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    BookOpen,
    Database,
    Folder,
    FileClock,
} from "lucide-react";

import { cn } from "@/lib/utils";

const explorer = [
    {
        title: "Projects",
        href: "/projects",
        icon: Folder,
    },
    {
        title: "Skills",
        href: "/skills",
        icon: Database,
    },
    {
        title: "Timeline",
        href: "/timeline",
        icon: FileClock,
    },
    {
        title: "Blogs",
        href: "/blogs",
        icon: BookOpen,
        disabled: true,
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="flex h-full w-64 flex-col border-r bg-background">

            <div className="border-b px-5 py-4">

                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
                    Workspace
                </p>

            </div>

            <nav className="flex-1 px-3 py-3">

                <div className="space-y-1">

                    {explorer.map((item) => {

                        const Icon = item.icon;

                        const active =
                            pathname === item.href;

                        if (item.disabled) {
                            return (
                                <div
                                    key={item.title}
                                    className="flex items-center justify-between rounded-md px-3 py-2 font-mono text-sm text-muted-foreground opacity-60"
                                >
                                    <div className="flex items-center gap-3">

                                        <Icon className="h-4 w-4" />

                                        <span>
                                            {item.title}
                                        </span>

                                    </div>

                                    <span className="text-[10px] uppercase tracking-wider">
                                        Soon
                                    </span>
                                </div>
                            );
                        }

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-md px-3 py-2 font-mono text-sm transition-colors",
                                    active
                                        ? "bg-muted text-foreground"
                                        : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                                )}
                            >
                                <Icon className="h-4 w-4 shrink-0" />

                                <span>
                                    {item.title}
                                </span>
                            </Link>
                        );
                    })}

                </div>

            </nav>

        </aside>
    );
}
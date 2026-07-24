"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BookOpen,
  Database,
  FileText,
  Folder,
} from "lucide-react";

import { cn } from "@/lib/utils";

const explorer = [
  {
    title: "README.md",
    href: "/readme",
    icon: FileText,
  },
  {
    title: "Projects/",
    href: "/projects",
    icon: Folder,
  },
  {
    title: "Skills.db",
    href: "/skills",
    icon: Database,
  },
  {
    title: "Timeline.log",
    href: "/timeline",
    icon: FileText,
  },
  {
    title: "Blog/",
    href: "/blog",
    icon: BookOpen,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-background">
      <div className="border-b px-5 py-4">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Explorer
        </p>
      </div>

      <nav className="flex-1 px-3 py-3">
        {explorer.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-sm px-3 py-2 font-mono text-sm transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
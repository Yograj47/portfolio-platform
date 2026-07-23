"use client";

import Link from "next/link";

import {
  ChevronDown,
  FolderOpen,
  FileText,
  Folder,
} from "lucide-react";

const explorer = [
  {
    title: "README.md",
    href: "/",
    icon: FileText,
  },
  {
    title: "Projects",
    href: "/projects",
    icon: FolderOpen,
  },
  {
    title: "Skills.json",
    href: "/skills",
    icon: FileText,
  },
  {
    title: "Timeline.log",
    href: "/timeline",
    icon: FileText,
  },
  {
    title: "Contact.sh",
    href: "/contact",
    icon: FileText,
  },
];

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r bg-muted/20 lg:flex lg:flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Explorer
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2">
          <div className="mb-2 flex items-center gap-2 px-2 text-xs font-medium uppercase text-muted-foreground">
            <ChevronDown className="size-4" />
            <Folder className="size-4" />
            Portfolio
          </div>

          <nav className="space-y-1">
            {explorer.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="size-4 text-blue-400" />

                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
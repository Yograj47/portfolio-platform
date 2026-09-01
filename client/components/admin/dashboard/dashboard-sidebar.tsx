"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Lock, KeySquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { sidebarItems } from "./sidebar-item";

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden h-screen w-64 shrink-0 border-r bg-sidebar sticky top-0 lg:flex lg:flex-col justify-between select-none">
      <div>
        {/* Header Branding */}
        <div className="flex items-center gap-3 border-b px-6 py-5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <KeySquare className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold leading-tight tracking-tight">
              Portfolio CMS
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Admin Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isDisabled = Boolean(item.notActive);

            const active =
              !isDisabled &&
              (item.href === "/dashboard"
                ? pathname === item.href
                : pathname === item.href ||
                pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                tabIndex={isDisabled ? -1 : 0}
                aria-disabled={isDisabled}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                  }
                }}
                className={cn(
                  "relative flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 group",
                  isDisabled
                    ? "cursor-not-allowed text-muted-foreground/40 hover:bg-transparent"
                    : active
                      ? "bg-primary/10 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  {/* Active Indicator Bar */}
                  {active && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary" />
                  )}

                  <Icon
                    className={cn(
                      "size-4 shrink-0 transition-transform duration-200",
                      isDisabled
                        ? "text-muted-foreground/30"
                        : active
                          ? "text-primary"
                          : "text-muted-foreground group-hover:scale-110"
                    )}
                  />

                  <span>{item.title}</span>
                </div>

                {/* Disabled Badge / Lock Indicator */}
                {isDisabled && (
                  <Lock className="size-3 text-muted-foreground/30" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className="border-t p-4">
        <div className="rounded-lg border bg-card/50 p-3 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">CMS Version 1.0</p>
          <p className="mt-0.5 text-[11px]">System active & connected</p>
        </div>
      </div>
    </aside>
  );
}
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, User, LogOut } from "lucide-react";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/use-auth";
import { sidebarItems } from "./sidebar-item";

export function DashboardHeader() {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Find matching route by length priority so sub-paths resolve correctly
    const matchedItem = [...sidebarItems]
        .sort((a, b) => b.href.length - a.href.length)
        .find((item) =>
            item.href === "/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href)
        );

    const currentPage = matchedItem?.title ?? "Dashboard";

    // Generate 2-letter initials (e.g. "John Doe" -> "JD")
    const initials =
        user?.name
            ?.trim()
            .split(" ")
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase() ?? "AD";

    return (
        <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md select-none">
            {/* Current Page Title */}
            <div>
                <h1 className="text-lg font-semibold tracking-tight text-foreground">
                    {currentPage}
                </h1>
            </div>

            {/* User Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger
                    render={(props) => (
                        <button
                            {...props}
                            type="button"
                            className="group flex items-center gap-3 rounded-xl p-1.5 pr-2.5 transition-colors hover:bg-accent focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                        >
                            <Avatar className="size-9 border shadow-xs transition-transform duration-200 group-hover:scale-105">
                                {user?.avatar && (
                                    <AvatarImage src={user.avatar} alt={user.name ?? "User avatar"} />
                                )}
                                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>

                            <div className="hidden text-left sm:block">
                                <p className="text-xs font-semibold leading-none text-foreground">
                                    {user?.name ?? "Admin"}
                                </p>
                                <p className="mt-1 text-[11px] font-normal leading-none text-muted-foreground">
                                    {user?.email}
                                </p>
                            </div>

                            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                        </button>
                    )}
                />

                <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-lg">
                    {/* Mobile Profile Header Info */}
                    <div className="flex items-center gap-2.5 px-2 py-2 sm:hidden">
                        <Avatar className="size-8">
                            {user?.avatar && <AvatarImage src={user.avatar} alt={user.name ?? "User"} />}
                            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col space-y-0.5 overflow-hidden">
                            <p className="truncate text-xs font-medium text-foreground">{user?.name ?? "Admin"}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{user?.email}</p>
                        </div>
                    </div>

                    <div className="sm:hidden">
                        <DropdownMenuSeparator className="my-1" />
                    </div>

                    {/* Full-Box Clickable Profile Link */}
                    <DropdownMenuItem
                        render={(props) => (
                            <Link
                                {...props}
                                href="/dashboard/profile"
                                className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-xs font-medium cursor-pointer"
                            >
                                <User className="size-4 text-muted-foreground" />
                                <span>Profile Settings</span>
                            </Link>
                        )}
                    />

                    <DropdownMenuSeparator className="my-1" />

                    {/* Logout Action */}
                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-xs font-medium cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                    >
                        <LogOut className="size-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
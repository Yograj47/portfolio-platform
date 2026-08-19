"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

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

    const {
        user,
        logout,
    } = useAuth();

    const currentPage =
        sidebarItems.find((item) =>
            pathname.startsWith(item.href)
        )?.title ?? "Dashboard";

    const initials =
        user?.name
            ?.trim()
            .charAt(0)
            .toUpperCase() ?? "A";

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Current page */}

            <div>
                <h2 className="text-xl font-semibold">
                    {currentPage}
                </h2>
            </div>

            {/* User menu */}

            <DropdownMenu>
                <DropdownMenuTrigger
                    className="flex items-center gap-3 rounded-md outline-none"
                >
                    <Avatar>
                        {user?.avatar && (
                            <AvatarImage
                                src={user.avatar}
                                alt={user.name}
                            />
                        )}

                        <AvatarFallback>
                            {initials}
                        </AvatarFallback>
                    </Avatar>

                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-medium">
                            {user?.name ?? "Admin"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                            {user?.email}
                        </p>
                    </div>

                    <ChevronDown className="size-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-48"
                >
                    <DropdownMenuItem>
                        <Link href="/dashboard/profile">
                            Profile
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem
                        onClick={() => logout()}
                        className="text-red-500 focus:text-red-500"
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
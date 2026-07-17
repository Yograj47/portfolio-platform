"use client";

import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useAuth } from "@/hooks/use-auth";
import { sidebarItems } from "./sidebar-item";

export function DashboardHeader() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const currentPage =
    sidebarItems.find((item) => pathname.startsWith(item.href))
      ?.title ?? "Dashboard";

  return (
    <header className="flex h-16 items-center justify-between border-b bg-background px-6">
      <div>
        <h2 className="text-xl font-semibold">
          {currentPage}
        </h2>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-3 rounded-md outline-none">
          <Avatar>
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? "A"}
            </AvatarFallback>
          </Avatar>

          <div className="text-left">
            <p className="text-sm font-medium">
              {user?.name ?? "Admin"}
            </p>

            <p className="text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>

          <ChevronDown className="h-4 w-4" />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            Profile
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => logout()}
            className="text-red-500"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
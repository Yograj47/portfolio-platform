"use client";

import {
    Moon,
    Search,
    ChevronRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "./workspace/workspace-context";

export function Navbar() {

    const { path } = useWorkspace();
    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
            {/* Logo */}
            <div className="flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                    HL
                </div>

                <div>
                    <p className="font-semibold leading-none">
                        Han Li
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Portfolio Workspace
                    </p>
                </div>
            </div>

            {/* Search */}
            <button className="hidden h-10 w-full max-w-md items-center gap-3 rounded-lg border bg-muted/30 px-4 text-sm text-muted-foreground transition hover:bg-muted md:flex">
                <Search className="size-4" />

                <span>Search portfolio...</span>

                <kbd className="ml-auto rounded border bg-background px-2 py-0.5 text-[10px]">
                    Ctrl K
                </kbd>
            </button>

            {/* Right */}
            <div className="flex items-center gap-4">
                <div className="hidden items-center gap-1 text-sm text-muted-foreground lg:flex">
                    
                    <ChevronRight className="size-3" />

                    <span className="text-foreground">
                        {path}
                    </span>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                >
                    <Moon className="size-4" />
                </Button>
            </div>
        </header>
    );
}
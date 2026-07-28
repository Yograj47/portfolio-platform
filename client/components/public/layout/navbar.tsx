"use client";

import { Moon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspace } from "../workspace/workspace-context";

export function Navbar() {
    const { name } = useWorkspace();

    console.log("path", name);


    return (
        <header className="flex h-14 items-center justify-between border-b bg-background px-6">
            <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-emerald-500">
                    han@portfolio
                </span>

                <span className="font-mono text-muted-foreground">
                    :
                </span>

                <span className="font-mono text-sm">
                    ~/{name}
                </span>
            </div>

            <div className="flex items-center gap-4">
                <span className="font-mono text-xs text-muted-foreground">
                    main
                </span>

                <span className="font-mono text-xs text-emerald-500">
                    ● Ready
                </span>

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
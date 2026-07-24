import { ReactNode } from "react";

interface TerminalWindowProps {
    children: ReactNode;
}

export function TerminalWindow({
    children,
}: TerminalWindowProps) {
    return (
        <div className="h-full w-full">
            <div className="flex h-full w-full flex-col overflow-hidden border bg-card">
                {children}
            </div>
        </div>
    );
}
"use client"

import { TerminalEntry } from "@/types/terminal.type";
import { TerminalHistory } from "./terminal-history";
import { TerminalInput } from "./terminal-input";
import { useEffect, useRef } from "react";

interface TerminalBodyProps {
    history: TerminalEntry[];

    command: string;

    onCommandChange: (value: string) => void;
    onSubmit: () => void;
}

export function TerminalBody({
    history,
    command,
    onCommandChange,
    onSubmit,
}: TerminalBodyProps) {
    const bottomRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "end",
        })
    }, [history]);

    return (
        <div className="h-full overflow-y-auto px-8 py-6">

            <TerminalHistory
                history={history}
            />

            {/* Active Prompt */}
            <TerminalInput
                value={command}
                onChange={onCommandChange}
                onSubmit={onSubmit}
            />

            <div ref={bottomRef} className="overflow-y-auto"/>
        </div>
    );
}
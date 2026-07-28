"use client";

import { KeyboardEvent, useEffect, useRef } from "react";
import { TerminalPrompt } from "./terminal-prompt";

interface TerminalInputProps {
    path: string;

    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function TerminalInput({
    path,
    value,
    onChange,
    onSubmit,
}: TerminalInputProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    });

    function handleKeyDown(
        e: KeyboardEvent<HTMLInputElement>
    ) {
        if (e.key === "Enter") {
            onSubmit();
        }
    }

    return (
        <div className="flex items-center gap-1 font-mono text-sm leading-none">

            <TerminalPrompt path={path} />

            <input
                ref={inputRef}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 bg-transparent outline-none border-0 p-0"
            />

        </div>
    );
}
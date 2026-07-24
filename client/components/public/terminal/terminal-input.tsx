"use client";

import { KeyboardEvent, useEffect, useRef } from "react";

interface TerminalInputProps {
    value: string;

    onChange: (value: string) => void;
    onSubmit: () => void;
}

export function TerminalInput({
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
        <div className="mt-2 flex items-center gap-3 font-mono text-sm">

            <span className="select-none font-semibold text-primary">
                ❯
            </span>

            <input
                ref={inputRef}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                className="flex-1 border-0 bg-transparent p-0 outline-none ring-0 placeholder:text-muted-foreground"
                placeholder="Type a command..."
            />

        </div>
    );
}
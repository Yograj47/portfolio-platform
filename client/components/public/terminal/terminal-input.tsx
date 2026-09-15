"use client";

import {
    KeyboardEvent,
    useEffect,
    useRef,
} from "react";

import { TerminalPrompt } from "./terminal-prompt";

interface TerminalInputProps {
    path: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    type?: "text" | "password" | "email";
    prompt?: string;
    disabled?: boolean;
}

export function TerminalInput({
    path,
    value,
    onChange,
    onSubmit,
    type = "text",
    prompt,
    disabled = false,
}: TerminalInputProps) {
    const inputRef =
        useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    function handleKeyDown(
        e: KeyboardEvent<HTMLInputElement>
    ) {
        if (e.key === "Enter") {
            e.preventDefault();
            onSubmit();
        }
    }

    return (
        <div className="flex items-center gap-1 font-mono text-sm leading-none">
            {prompt ? (
                <span className="whitespace-nowrap">
                    {prompt}
                </span>
            ) : (
                <TerminalPrompt path={path} />
            )}

            <input
                ref={inputRef}
                type={type}
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                onKeyDown={handleKeyDown}
                autoComplete="off"
                spellCheck={false}
                disabled={disabled}
                className="flex-1 border-0 bg-transparent p-0 outline-none"
            />
        </div>
    );
}

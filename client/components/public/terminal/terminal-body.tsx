"use client";

import { useEffect, useRef } from "react";

import { TerminalEntry } from "@/types/terminal.type";

import { TerminalHistory } from "./terminal-history";
import { TerminalInput } from "./terminal-input";

interface TerminalBodyProps {
  cwd: string;
  history: TerminalEntry[];
  command: string;
  onCommandChange: (value: string) => void;
  onSubmit: () => void;
  inputType?: "text" | "password" | "email";
  inputPrompt?: string;
  inputDisabled?: boolean;
}

export function TerminalBody({
  cwd,
  history,
  command,
  onCommandChange,
  onSubmit,
  inputType = "text",
  inputPrompt,
  inputDisabled = false,
}: TerminalBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  // 1. Scroll when new history items are added
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  // 2. Observer to auto-scroll when async outputs (React Query, API responses) resize the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(() => {
      scrollToBottom();
    });

    // Observe children updates
    Array.from(container.children).forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [history]);

  return (
    <div ref={containerRef} className="h-full overflow-y-auto px-8 py-6">
      <TerminalHistory history={history} />

      <TerminalInput
        path={cwd}
        value={command}
        onChange={onCommandChange}
        onSubmit={onSubmit}
        type={inputType}
        prompt={inputPrompt}
        disabled={inputDisabled}
      />

      <div ref={bottomRef} />
    </div>
  );
}
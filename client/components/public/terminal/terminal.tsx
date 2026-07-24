"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { commandRegistry } from "./commands";
import { TerminalEngine } from "./terminal-engine";

import { TerminalBoot } from "./terminal-boot";
import { TerminalHeader } from "./terminal-header";
import { TerminalBody } from "./terminal-body";
import { TerminalWindow } from "./terminal-window";

import { TerminalEntry } from "@/types/terminal.type";

export function Terminal() {
  const router = useRouter();

  const [booted, setBooted] = useState(false);

  const [history, setHistory] = useState<TerminalEntry[]>([]);

  const [currentCommand, setCurrentCommand] =
    useState("");

  const engine = useMemo(
    () => new TerminalEngine(commandRegistry),
    []
  );

  function executeCommand() {
    const input = currentCommand.trim();

    if (!input) return;

    const context = {
      router,

      clearHistory() {
        setHistory([]);
      },
    };

    const result = engine.execute(
      input,
      context
    );

    const entries: TerminalEntry[] = [
      {
        id: crypto.randomUUID(),
        type: "command",
        value: input,
      },
    ];

    if (result.output) {
      entries.push({
        id: crypto.randomUUID(),
        type: "output",
        value: result.output,
      });
    }

    setHistory((prev) => [
      ...prev,
      ...entries,
    ]);

    setCurrentCommand("");
  }

  if (!booted) {
    return (
      <TerminalBoot
        onComplete={() => {
          setBooted(true)

          setHistory([
            {
              id: crypto.randomUUID(),
              type: "output",
              value: (
                <div className="mb-6 space-y-2 font-mono text-sm">

                  <p className="font-semibold">
                    Quick Start
                  </p>

                  <div className="grid grid-cols-[150px_1fr] gap-y-1">

                    <span className="text-primary">
                      help
                    </span>

                    <span className="text-muted-foreground">
                      List available commands.
                    </span>

                    <span className="text-primary">
                      ls
                    </span>

                    <span className="text-muted-foreground">
                      Browse workspace.
                    </span>

                    <span className="text-primary">
                      open README.md
                    </span>

                    <span className="text-muted-foreground">
                      Start exploring.
                    </span>

                  </div>

                </div>
              ),
            },
          ])
        }
        }
      />
    );
  }





  return (
    <TerminalWindow>
      <TerminalHeader />

      <TerminalBody
        history={history}
        command={currentCommand}
        onCommandChange={
          setCurrentCommand
        }
        onSubmit={executeCommand}
      />
    </TerminalWindow>
  );
}
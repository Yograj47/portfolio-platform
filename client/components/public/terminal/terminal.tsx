"use client";

import {
  ReactNode,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/use-auth";

import { commandRegistry } from "./commands";
import { TerminalEngine } from "./terminal-engine";
import { TerminalBoot } from "./terminal-boot";
import { TerminalHeader } from "./terminal-header";
import { TerminalBody } from "./terminal-body";
import { TerminalWindow } from "./terminal-window";

import {
  TerminalContext,
  TerminalEntry,
} from "@/types/terminal.type";

import {
  TERMINAL_PATHS,
  TerminalPath,
} from "./workspace/terminal-workspace.type";
import { WelcomeMessage } from "./welcome-message";

type RootAuthStep =
  | "none"
  | "email"
  | "password";

const MAX_LOGIN_ATTEMPTS = 3;

export function Terminal() {
  const router = useRouter();

  const {
    loginAsync,
    loginLoading,
  } = useAuth();

  const [booted, setBooted] =
    useState(false);

  const [history, setHistory] =
    useState<TerminalEntry[]>([]);

  const [cwd, setCwd] =
    useState<TerminalPath>(
      TERMINAL_PATHS.ROOT
    );

  const [currentCommand, setCurrentCommand] =
    useState("");

  const [rootAuthStep, setRootAuthStep] =
    useState<RootAuthStep>("none");

  const [rootEmail, setRootEmail] =
    useState("");

  const [loginAttempts, setLoginAttempts] =
    useState(0);

  const engine = useMemo(
    () => new TerminalEngine(commandRegistry),
    []
  );

  function resetHistory() {
    setHistory([
      {
        id: crypto.randomUUID(),
        type: "output",
        value: <WelcomeMessage />,
      },
    ]);
  }

  function addOutput(value: ReactNode) {
    setHistory((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: "output",
        value,
      },
    ]);
  }

  function handleRootAuthAction() {
    setRootAuthStep("email");
    setRootEmail("");
    setLoginAttempts(0);
  }

  async function handleRootAuthentication() {
    const value =
      currentCommand.trim();

    if (!value) return;

    if (rootAuthStep === "email") {
      setRootEmail(value);
      setCurrentCommand("");
      setRootAuthStep("password");

      return;
    }

    if (rootAuthStep === "password") {
      const password = value;

      setCurrentCommand("");

      try {
        await loginAsync({
          email: rootEmail,
          password,
        });

        setRootAuthStep("none");
        setRootEmail("");
        setLoginAttempts(0);
      } catch {
        const nextAttempt =
          loginAttempts + 1;

        if (
          nextAttempt >=
          MAX_LOGIN_ATTEMPTS
        ) {
          addOutput(
            <div className="space-y-1">
              <p className="text-destructive">
                Authentication failed.
              </p>

              <p className="text-muted-foreground">
                Maximum login attempts
                reached. Enter the root
                command again.
              </p>
            </div>
          );

          setRootAuthStep("none");
          setRootEmail("");
          setLoginAttempts(0);

          return;
        }

        setLoginAttempts(nextAttempt);
        setRootAuthStep("email");
        setRootEmail("");

        addOutput(
          <div className="space-y-1">
            <p className="text-destructive">
              Invalid email or password.
            </p>

            <p className="text-muted-foreground">
              Attempt {nextAttempt} of{" "}
              {MAX_LOGIN_ATTEMPTS}.
            </p>
          </div>
        );
      }
    }
  }

  function executeCommand() {
    const input =
      currentCommand.trim();

    if (!input) return;

    if (rootAuthStep !== "none") {
      void handleRootAuthentication();
      return;
    }

    if (input.toLowerCase() === "clear" || input.toLowerCase() === "cls") {
      resetHistory();
      setCurrentCommand("");
      return; 
    }

    const context: TerminalContext = {
      router,
      cwd,
      setCwd,
      clearHistory: () => setHistory([]),
      resetHistory,
    };

    const commandCwd = cwd;

    const result = engine.execute(
      input,
      context
    );

    const entries: TerminalEntry[] = [
      {
        id: crypto.randomUUID(),
        type: "command",
        value: input,
        cwd: commandCwd,
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

    if (
      result.action?.type ===
      "ROOT_AUTH"
    ) {
      handleRootAuthAction();
    }
  }

  if (!booted) {
    return (
      <TerminalBoot
        onComplete={() => {
          setBooted(true);
          resetHistory();
        }}
      />
    );
  }

  return (
    <TerminalWindow>
      <TerminalHeader />

      <TerminalBody
        cwd={cwd}
        history={history}
        command={currentCommand}
        onCommandChange={
          setCurrentCommand
        }
        onSubmit={executeCommand}
        inputType={
          rootAuthStep === "email"
            ? "email"
            : rootAuthStep === "password"
              ? "password"
              : "text"
        }
        inputPrompt={
          rootAuthStep === "email"
            ? "Email:"
            : rootAuthStep === "password"
              ? "Password:"
              : undefined
        }
        inputDisabled={loginLoading}
      />
    </TerminalWindow>
  );
}
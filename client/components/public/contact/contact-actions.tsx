"use client";

import { useState } from "react";
import { TerminalActionButton } from "../terminal/terminal-action-button";
import type { ContactProfileData } from "./contact.type";

interface ContactActionsProps {
  profile: ContactProfileData;
}

type ActionType = "email" | "copy-email" | "github" | "linkedin" | "resume";

interface ActionConfig {
  label: string;
  type: ActionType;
}

const ACTIONS: ActionConfig[] = [
  { label: "email", type: "email" },
  { label: "cp email", type: "copy-email" },
  { label: "open github", type: "github" },
  { label: "open linkedin", type: "linkedin" },
  { label: "open resume.pdf", type: "resume" },
];

export function ContactActions({ profile }: ContactActionsProps) {
  const [copied, setCopied] = useState(false);

  const disabledMap: Record<ActionType, boolean> = {
    email: !profile.email,
    "copy-email": !profile.email,
    github: !profile.githubUrl,
    linkedin: !profile.linkedinUrl,
    resume: !profile.resumeUrl,
  };

  async function handleAction(type: ActionType) {
    switch (type) {
      case "email":
        window.location.assign(`mailto:${profile.email}`);
        break;

      case "copy-email":
        try {
          await navigator.clipboard.writeText(profile.email);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          console.error("Failed to copy email to clipboard");
        }
        break;

      case "github":
        if (profile.githubUrl) window.open(profile.githubUrl, "_blank", "noopener,noreferrer");
        break;

      case "linkedin":
        if (profile.linkedinUrl) window.open(profile.linkedinUrl, "_blank", "noopener,noreferrer");
        break;

      case "resume":
        if (profile.resumeUrl) window.open(profile.resumeUrl, "_blank", "noopener,noreferrer");
        break;
    }
  }

  return (
    <section className="space-y-2">
      <div className="border-b border-border/40 pb-1 font-semibold text-foreground">
        Quick Actions
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        {ACTIONS.map((action) => {
          const isDisabled = disabledMap[action.type];
          const displayLabel = action.type === "copy-email" && copied ? "✓ copied" : action.label;

          return (
            <TerminalActionButton
              key={action.type}
              onClick={() => handleAction(action.type)}
              disabled={isDisabled}
            >
              {displayLabel}
            </TerminalActionButton>
          );
        })}
      </div>
    </section>
  );
}
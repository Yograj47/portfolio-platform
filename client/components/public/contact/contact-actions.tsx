"use client";

import { useState } from "react";

import { TerminalActionButton } from "../terminal/terminal-action-button";

import type { ContactProfileData } from "./contact.type";

interface ContactActionsProps {
  profile: ContactProfileData;
}

type ActionType =
  | "email"
  | "copy-email"
  | "github"
  | "linkedin"
  | "resume";

const actions = [
  {
    label: "email",
    type: "email",
  },
  {
    label: "cp email",
    type: "copy-email",
  },
  {
    label: "open github",
    type: "github",
  },
  {
    label: "open linkedin",
    type: "linkedin",
  },
  {
    label: "open resume.pdf",
    type: "resume",
  },
] as const;

export function ContactActions({
  profile,
}: ContactActionsProps) {
  const [copied, setCopied] = useState(false);

  function handleAction(type: ActionType) {
    switch (type) {
      case "email":
        window.location.assign(`mailto:${profile.email}`);
        return;

      case "copy-email":
        navigator.clipboard.writeText(profile.email);

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);

        return;

      case "github":
        if (profile.githubUrl) {
          window.open(
            profile.githubUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }

        return;

      case "linkedin":
        if (profile.linkedinUrl) {
          window.open(
            profile.linkedinUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }

        return;

      case "resume":
        if (profile.resumeUrl) {
          window.open(
            profile.resumeUrl,
            "_blank",
            "noopener,noreferrer"
          );
        }

        return;
    }
  }

  return (
    <section className="space-y-2">
      <div className="border-b pb-1 font-semibold">
        Quick Actions
      </div>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) => {
          const disabled =
            (action.type === "github" &&
              !profile.githubUrl) ||
            (action.type === "linkedin" &&
              !profile.linkedinUrl) ||
            (action.type === "resume" &&
              !profile.resumeUrl);

          const label =
            action.type === "copy-email" && copied
              ? "✓ copied"
              : action.label;

          return (
            <TerminalActionButton
              key={action.type}
              onClick={() => handleAction(action.type)}
              disabled={disabled}
            >
              {label}
            </TerminalActionButton>
          );
        })}
      </div>
    </section>
  );
}
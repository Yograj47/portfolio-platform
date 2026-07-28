"use client";

import { useState } from "react";

import { contact } from "./contact.data";
import { TerminalActionButton } from "../terminal/terminal-action-button";

type ActionType =
    | "copy-email"
    | "github"
    | "linkedin"
    | "resume";

const actions = [
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
        label: "resume.pdf",
        type: "resume",
    },
] as const;

export function ContactActions() {
    const [copied, setCopied] =
        useState(false);

    function handleAction(
        type: ActionType
    ) {

        switch (type) {

            case "copy-email":
                navigator.clipboard.writeText(
                    contact.email
                );

                setCopied(true);

                setTimeout(() => {
                    setCopied(false);
                }, 2000);

                return;

            case "github":
                window.open(
                    contact.github,
                    "_blank",
                    "noopener,noreferrer"
                );
                return;

            case "linkedin":
                window.open(
                    contact.linkedin,
                    "_blank",
                    "noopener,noreferrer"
                );
                return;

            case "resume":
                window.open(
                    contact.resume,
                    "_blank",
                    "noopener,noreferrer"
                );
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

                    const label =
                        action.type ===
                            "copy-email" &&
                            copied
                            ? "✓ copied"
                            : action.label;

                    return (
                        <TerminalActionButton
                            key={action.type}
                            onClick={() =>
                                handleAction(
                                    action.type
                                )
                            }
                        >
                            {label}
                        </TerminalActionButton>
                    );
                })}

            </div>

        </section>
    );
}
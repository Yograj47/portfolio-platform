"use client";

import { useEffect, useState } from "react";

import { ContactActions } from "./contact-actions";
import { ContactAvailability } from "./contact-availability";
import { ContactLinks } from "./contact-links";
import { ContactProfile } from "./contact-profile";

export default function ContactContent() {
    const [showFooter, setShowFooter] =
        useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowFooter(true);
        }, 1000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="mt-3 space-y-4">

            <div className="text-muted-foreground">
                ────────────────────────────────────
            </div>

            <ContactProfile />

            <div className="text-muted-foreground">
                ────────────────────────────────────
            </div>

            <ContactLinks />

            <div className="text-muted-foreground">
                ────────────────────────────────────
            </div>

            <ContactAvailability />

            <div className="text-muted-foreground">
                ────────────────────────────────────
            </div>

            <ContactActions />

            {showFooter && (
                <div className="animate-in fade-in duration-500 space-y-1">

                    <div className="text-muted-foreground">
                        ────────────────────────────────────
                    </div>

                    <p>
                        Process completed successfully.
                    </p>

                    <p className="text-muted-foreground">
                        Exit code: 0
                    </p>

                </div>
            )}

        </div>
    );
}
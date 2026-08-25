"use client";

import { useEffect, useState } from "react";

import ContactContent from "./contact-content";
import { usePublicProfile } from "@/hooks/use-public-profile";

export function ContactOutput() {
    const [step, setStep] = useState(0);

    const {
        data: profile,
        isLoading,
        isError,
    } = usePublicProfile();

    useEffect(() => {
        const timers = [
            setTimeout(() => setStep(1), 800),
            setTimeout(() => setStep(2), 1800),
            setTimeout(() => setStep(3), 2800),
            setTimeout(() => setStep(4), 4000),
        ];

        return () => {
            timers.forEach(clearTimeout);
        };
    }, []);

    return (
        <div className="space-y-1 font-mono text-sm animate-in fade-in duration-300">
            <p>Executing Contact.sh...</p>

            {step >= 1 && (
                <p className="text-muted-foreground animate-in fade-in duration-300">
                    Loading profile...
                </p>
            )}

            {step >= 2 && (
                <p className="text-muted-foreground animate-in fade-in duration-300">
                    Loading communication channels...
                </p>
            )}

            {step >= 3 && (
                <p className="text-muted-foreground animate-in fade-in duration-300">
                    Checking availability...
                </p>
            )}

            {step >= 4 && isLoading && (
                <p className="text-muted-foreground">
                    Loading contact information...
                </p>
            )}

            {step >= 4 && isError && (
                <p className="text-destructive">
                    Failed to load contact information.
                </p>
            )}

            {step >= 4 && profile && (
                <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <ContactContent profile={profile} />
                </div>
            )}
        </div>
    );
}
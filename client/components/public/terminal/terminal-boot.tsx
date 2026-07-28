"use client";

import { useEffect, useState } from "react";

interface TerminalBootProps {
    onComplete: () => void;
}

const bootSteps = [
    "Initializing workspace...",
    "Loading portfolio modules...",
    "Connecting services...",
    "Mounting virtual filesystem...",
    "Starting interactive shell...",
];

export function TerminalBoot({
    onComplete,
}: TerminalBootProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const booted = sessionStorage.getItem("booted");

        if (booted) {
            onComplete();
            return;
        }

        let timer: NodeJS.Timeout;

        if (currentStep < bootSteps.length) {
            timer = setTimeout(() => {
                setCurrentStep((prev) => prev + 1);
            }, 450);
        } else {
            sessionStorage.setItem("booted", "true");

            timer = setTimeout(() => {
                onComplete();
            }, 500);
        }

        return () => clearTimeout(timer);
    }, [currentStep, onComplete]);

    return (
        <div className="flex h-full w-full items-center justify-center font-mono">
            <div className="w-full max-w-3xl space-y-6">

                <div>
                    <h1 className="text-xl font-semibold">
                        Portfolio Workspace Bootloader
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Version 1.0.0
                    </p>
                </div>

                <div className="space-y-2">

                    {bootSteps
                        .slice(0, currentStep)
                        .map((step) => (
                            <div
                                key={step}
                                className="flex items-center gap-3"
                            >
                                <span className="text-emerald-500">
                                    ✓
                                </span>

                                <span>{step}</span>
                            </div>
                        ))}

                    {currentStep < bootSteps.length && (
                        <div className="flex items-center gap-3">
                            <span className="animate-pulse">
                                ❯
                            </span>

                            <span>
                                {bootSteps[currentStep]}
                            </span>
                        </div>
                    )}

                </div>

            </div>
        </div>
    );
}
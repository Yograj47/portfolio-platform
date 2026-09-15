"use client";

import { useEffect, useRef, useState } from "react";
import ContactContent from "./contact-content";
import { usePublicProfile } from "@/hooks/use-public-profile";

const STEPS = [
  { text: "Loading profile...", delay: 600 },
  { text: "Loading communication channels...", delay: 1400 },
  { text: "Checking availability...", delay: 2200 },
];

export function ContactOutput() {
  const [step, setStep] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data: profile, isLoading, isError } = usePublicProfile();

  // Handle progressive terminal step updates
  useEffect(() => {
    const timers = STEPS.map((s, index) =>
      setTimeout(() => setStep(index + 1), s.delay)
    );

    // Trigger state to start checking server response
    const finalTimer = setTimeout(() => setStep(STEPS.length + 1), 3200);

    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(finalTimer);
    };
  }, []);

  const isComplete = Boolean(step > STEPS.length && profile && !isLoading && !isError);

  // FIXED: Dependency array strictly contains primitive values of fixed length (4 items)
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [step, isLoading, isError, isComplete]);

  return (
    <div className="space-y-1.5 font-mono text-sm animate-in fade-in duration-300">
      <p className="text-foreground">Executing Contact.sh...</p>

      {/* Hide initial steps once profile is loaded successfully */}
      {!isComplete && (
        <>
          {STEPS.map((s, index) => {
            const stepNum = index + 1;
            const isFinished = step > stepNum;
            const isCurrent = step === stepNum;

            if (step < stepNum) return null;

            return (
              <p
                key={index}
                className="text-muted-foreground animate-in fade-in duration-300 flex items-center gap-2"
              >
                {isFinished ? (
                  <span className="text-emerald-500 font-bold">✓</span>
                ) : isCurrent ? (
                  <span className="text-primary animate-pulse">[~]</span>
                ) : null}
                <span>{s.text}</span>
              </p>
            );
          })}

          {step > STEPS.length && (isLoading || !profile) && !isError && (
            <p className="text-muted-foreground animate-pulse pt-1">
              Connecting with server, thank you for your patience...
            </p>
          )}

          {step > STEPS.length && isError && (
            <p className="text-destructive font-semibold pt-1">
              Failed to establish connection. Please run contact cmd again.
            </p>
          )}
        </>
      )}

      {/* Main Content Render */}
      {isComplete && profile && (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ContactContent profile={profile} />
        </div>
      )}

      <div ref={containerRef} />
    </div>
  );
}
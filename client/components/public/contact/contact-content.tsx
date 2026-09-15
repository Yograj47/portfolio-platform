"use client";

import { useEffect, useState } from "react";
import { ContactActions } from "./contact-actions";
import { ContactAvailability } from "./contact-availability";
import { ContactProfile } from "./contact-profile";
import { ContactProfileData } from "./contact.type";

interface ContactContentProps {
  profile: ContactProfileData;
}

export default function ContactContent({ profile }: ContactContentProps) {
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFooter(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="mt-3 space-y-4">
      <hr className="border-border/40" />

      <ContactProfile profile={profile} />

      <hr className="border-border/40" />

      <ContactAvailability profile={profile} />

      <hr className="border-border/40" />

      <ContactActions profile={profile} />

      {showFooter && (
        <div className="space-y-1 pt-2 animate-in fade-in duration-500">
          <hr className="border-border/40" />

          <p className="text-foreground font-semibold">
            Process completed successfully.
          </p>

          <p className="text-muted-foreground text-xs">Exit code: 0</p>
        </div>
      )}
    </div>
  );
}
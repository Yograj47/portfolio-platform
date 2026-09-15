import type { ContactProfileData } from "./contact.type";

interface ContactAvailabilityProps {
  profile: ContactProfileData;
}

export function ContactAvailability({ profile }: ContactAvailabilityProps) {
  const items = [
    { id: "fulltime", enabled: profile.openToFullTime, label: "Open to full-time opportunities" },
    { id: "opensource", enabled: profile.openToOpenSource, label: "Open source collaboration" },
    { id: "freelance", enabled: profile.openToFreelance, label: "Freelance projects" },
  ].filter((item) => item.enabled);

  return (
    <section className="space-y-2">
      <div className="border-b border-border/40 pb-1 font-semibold text-foreground">
        Availability
      </div>

      <div className="space-y-1 font-mono text-sm">
        {items.length > 0 ? (
          items.map((item) => (
            <p key={item.id} className="text-foreground">
              <span className="text-primary font-bold">✓</span> {item.label}
            </p>
          ))
        ) : (
          <p className="text-muted-foreground italic">
            No active availability flags.
          </p>
        )}
      </div>
    </section>
  );
}
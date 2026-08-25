import type { ContactProfileData } from "./contact.type";

interface ContactAvailabilityProps {
  profile: ContactProfileData;
}

export function ContactAvailability({
  profile,
}: ContactAvailabilityProps) {
  const availability = [
    profile.openToFullTime &&
      "Open to full-time opportunities",

    profile.openToOpenSource &&
      "Open source collaboration",

    profile.openToFreelance &&
      "Freelance projects",
  ].filter(Boolean);

  return (
    <section className="space-y-2">
      <div className="border-b pb-1 font-semibold">
        Availability
      </div>

      <div className="space-y-1">
        {availability.length > 0 ? (
          availability.map((item) => (
            <p key={item as string}>
              ✓ {item}
            </p>
          ))
        ) : (
          <p className="text-muted-foreground">
            No current opportunities listed.
          </p>
        )}
      </div>
    </section>
  );
}
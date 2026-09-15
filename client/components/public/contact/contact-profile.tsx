import type { ContactProfileData } from "./contact.type";

interface ContactProfileProps {
  profile: ContactProfileData;
}

export function ContactProfile({ profile }: ContactProfileProps) {
  const rows = [
    { label: "Name", value: profile.name },
    { label: "Role", value: profile.role || "N/A" },
    { label: "Location", value: profile.location || "N/A" },
    {
      label: "Status",
      value: profile.isAvailable ? "🟢 Available" : "🔴 Unavailable",
    },
  ];

  return (
    <section className="space-y-2">
      <div className="border-b border-border/40 pb-1 font-semibold text-foreground">
        Contact Module v1.0
      </div>

      <div className="grid grid-cols-[120px_1fr] gap-y-1.5 font-mono text-sm">
        {rows.map(({ label, value }) => (
          <div key={label} className="contents">
            <span className="text-muted-foreground">{label}</span>
            <span className="text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
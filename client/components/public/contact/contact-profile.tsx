import type { ContactProfileData } from "./contact.type";

interface ContactProfileProps {
  profile: ContactProfileData;
}

export function ContactProfile({
  profile,
}: ContactProfileProps) {
  const rows = [
    ["Name", profile.name],
    ["Role", profile.role || "-"],
    ["Location", profile.location || "-"],
    [
      "Status",
      profile.isAvailable
        ? "🟢 Available"
        : "🔴 Unavailable",
    ],
  ];

  return (
    <section className="space-y-2">
      <div className="border-b pb-1 font-semibold">
        Contact Module v1.0
      </div>

      <div className="grid grid-cols-[120px_1fr] gap-y-2">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="contents"
          >
            <span className="text-muted-foreground">
              {label}
            </span>

            <span>{value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
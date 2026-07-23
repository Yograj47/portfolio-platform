// components/public/current-status.tsx

import {
  BookOpen,
  Briefcase,
  Coffee,
  MapPin,
} from "lucide-react";

const items = [
  {
    icon: Briefcase,
    label: "Status",
    value: "Open to opportunities",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nepal",
  },
  {
    icon: BookOpen,
    label: "Currently",
    value: "Building Portfolio Workspace",
  },
  {
    icon: Coffee,
    label: "Coffee",
    value: "Always brewing ☕",
  },
];

export function CurrentStatus() {
  return (
<section className="h-full rounded-md border p-8">
      <h2 className="font-mono text-lg font-semibold">
        Current
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="flex items-start gap-3 rounded-md border p-4"
            >
              <Icon className="mt-0.5 size-5 text-primary" />

              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  {item.label}
                </p>

                <p className="mt-1 font-medium">
                  {item.value}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
import {
  FolderGit2,
  Clock3,
  BookOpenText,
  Layers3,
} from "lucide-react";

const facts = [
  {
    icon: FolderGit2,
    label: "Projects",
    value: "15+",
  },
  {
    icon: Clock3,
    label: "Experience",
    value: "3+ Years",
  },
  {
    icon: Layers3,
    label: "Technologies",
    value: "20+",
  },
  {
    icon: BookOpenText,
    label: "Currently Learning",
    value: "System Design",
  },
];

export function QuickFacts() {
  return (
    <section className="space-y-6">
      <h2 className="font-mono text-lg font-semibold">
        Quick Facts
      </h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {facts.map((fact) => {
          const Icon = fact.icon;

          return (
            <div
              key={fact.label}
              className="rounded-md border p-5"
            >
              <Icon className="mb-4 size-5 text-primary" />

              <p className="text-2xl font-bold">
                {fact.value}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {fact.label}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
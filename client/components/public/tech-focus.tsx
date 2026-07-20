const techStacks = {
  Backend: [
    "NestJS",
    "Node.js",
    "Express",
    "Prisma",
    "PostgreSQL",
  ],
  Frontend: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
  ],
  DevOps: [
    "Docker",
    "GitHub Actions",
    "Nginx",
  ],
};

export function TechFocus() {
  return (
<section className="h-full rounded-md border p-8">
      <h2 className="font-mono text-lg font-semibold">
        Tech Stack
      </h2>

      <div className="space-y-5">
        {Object.entries(techStacks).map(
          ([category, skills]) => (
            <div
              key={category}
              className="space-y-2"
            >
              <h3 className="font-medium">
                {category}
              </h3>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-md border px-3 py-1 font-mono text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )
        )}
      </div>
    </section>
  );
}
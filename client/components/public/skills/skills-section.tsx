"use client";

import { SkillsWheel } from "./skills-wheel";
import { SkillsEmpty } from "./skills-empty";
import { SkillsSkeleton } from "./skills-skeleton";
import { useSkill } from "@/hooks/use-skill";

export function SkillsSection() {
  const { skills, loading } = useSkill();

  if (loading) {
    return <SkillsSkeleton />;
  }

  return (
    <section className="space-y-8 py-4">
      {skills.length ? (
        <SkillsWheel skills={skills} />
      ) : (
        <SkillsEmpty />
      )}
    </section>
  );
}
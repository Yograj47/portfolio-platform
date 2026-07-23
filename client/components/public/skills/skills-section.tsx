"use client";

import { SkillsGrid } from "./skills-grid";
import { SkillsEmpty } from "./skills-empty";
import { SkillsHeader } from "./skills-header";
import { SkillsSkeleton } from "./skills-skeleton";

import { useSkill } from "@/hooks/use-skill";

export function SkillsSection() {
  const {
    skills,
    loading,
  } = useSkill();

  if (loading) {
    return <SkillsSkeleton />;
  }

  return (
    <section className="space-y-8">
      <SkillsHeader />

      {skills.length ? (
        <SkillsGrid skills={skills} />
      ) : (
        <SkillsEmpty />
      )}
    </section>
  );
}
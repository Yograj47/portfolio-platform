"use client";

import { SkillsWheel } from "./skills-wheel";
import { SkillsEmpty } from "./skills-empty";
import { SkillsSkeleton } from "./skills-skeleton";
import { useSkillsQuery } from "@/hooks/use-portfolio-content";
import { ErrorState } from "@/components/feedback/error-state";

export function SkillsSection() {
  const {
    data: skills = [],
    isLoading: loading,
    isError,
    refetch,
  } = useSkillsQuery();

  if (loading) {
    return <SkillsSkeleton />;
  }

  if (isError) return <ErrorState onRetry={() => void refetch()} />;

  return (
    <section className="space-y-8 py-4">
      {skills.length ? <SkillsWheel skills={skills} /> : <SkillsEmpty />}
    </section>
  );
}

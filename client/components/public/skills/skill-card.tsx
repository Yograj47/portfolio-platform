import type { Skill } from "@/components/skill/skill-columns";

interface SkillCardProps {
  skill: Skill;
}

export function SkillCard({
  skill,
}: SkillCardProps) {
  return (
    <article className="rounded-md border p-5 transition-colors hover:bg-muted/30">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold">
          {skill.name}
        </h3>

        <span className="font-mono text-xs text-muted-foreground">
          Lv.{skill.level}
        </span>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{
            width: `${skill.level}%`,
          }}
        />
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Proficiency</span>

        <span>{skill.level}%</span>
      </div>
    </article>
  );
}
import type { Skill } from "@/components/skill/skill-columns";

import { SkillCard } from "./skill-card";

interface SkillsGridProps {
    skills: Skill[];
}

export function SkillsGrid({
    skills,
}: SkillsGridProps) {
    return (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => (
                <SkillCard
                    key={skill.id}
                    skill={skill}
                />
            ))}
        </div>
    );
}
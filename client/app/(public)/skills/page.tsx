import { FileView } from "@/components/public/layout/file-view";

import { SkillsSection } from "@/components/public/skills/skills-section";

export default function SkillsPage() {
    return (
        <FileView
            title="Skills.db"
            meta="Database"
        >
            <SkillsSection />
        </FileView>
    );
}
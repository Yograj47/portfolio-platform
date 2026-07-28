import { FileView } from "@/components/public/layout/file-view";
import { SkillsSection } from "@/components/public/skills/skills-section";

export default function SkillsPage() {
    return (
        <FileView
            title="Skills.db"
            meta="Database"
            description="
        Technologies, tools, and frameworks I use to build modern applications.
    "
        >
            <SkillsSection />
        </FileView>
    );
}
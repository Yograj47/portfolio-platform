import { ProjectStatus } from "@/lib/enums/project";

export const PROJECT_STATUS_OPTIONS = [
    {
        label: "Draft",
        value: ProjectStatus.DRAFT,
    },
    {
        label: "Published",
        value: ProjectStatus.PUBLISHED,
    },
    {
        label: "Archived",
        value: ProjectStatus.ARCHIVED,
    },
] as const;
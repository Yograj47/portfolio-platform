import { TimelineType } from "@/lib/enums/timeline";

export const TIMELINE_TYPE_OPTIONS = [
    {
        label: "Experience",
        value: TimelineType.EXPERIENCE,
    },
    {
        label: "Education",
        value: TimelineType.EDUCATION,
    },
] as const;
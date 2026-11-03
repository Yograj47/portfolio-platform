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
  { label: "Training", value: TimelineType.TRAINING },
  { label: "Certification", value: TimelineType.CERTIFICATION },
  { label: "Achievement", value: TimelineType.ACHIEVEMENT },
] as const;

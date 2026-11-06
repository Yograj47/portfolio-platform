import { z } from "zod";
import type { ProjectStatus } from "@/lib/enums/project";
import type { TimelineType } from "@/lib/enums/timeline";
const text = z.string().min(1);
const optionalText = z.string().nullable().optional();
const skill = z.object({
  id: text,
  name: text,
  level: z.number(),
  displayOrder: z.number(),
  group: optionalText,
  color: optionalText.transform((v) => v ?? undefined),
  icon: optionalText.transform((v) => v ?? undefined),
});
export const cvSchema = z.object({
  profile: z.object({
    name: text,
    email: z.email(),
    role: optionalText,
    summary: optionalText,
    location: optionalText,
    phone: optionalText,
    githubUrl: optionalText,
    linkedinUrl: optionalText,
    resumeUrl: optionalText,
    isAvailable: z.boolean(),
  }),
  projects: z.array(
    z.object({
      id: text,
      slug: text,
      title: text,
      excerpt: z.string(),
      description: z.string(),
      githubUrl: z.string().nullable(),
      liveUrl: z.string().nullable(),
      featured: z.boolean(),
      status: z
        .enum(["DRAFT", "PUBLISHED", "ARCHIVED"])
        .transform((v) => v as ProjectStatus),
      displayOrder: z.number(),
      categoryId: text,
      authorId: text,
      createdAt: text,
      updatedAt: text,
      category: z.object({ id: text, name: text, slug: text }),
      technologies: z.array(z.string()),
      skills: z.array(
        z.object({
          skillId: text,
          projectId: text,
          usageNote: z.string().nullable(),
          skill,
        }),
      ),
      media: z
        .array(
          z.object({
            id: text,
            projectId: text,
            mediaId: text,
            displayOrder: z.number(),
            isCover: z.boolean(),
            isActive: z.boolean(),
            media: z.object({
              id: text,
              publicId: text,
              url: text,
              fileName: text,
              mimeType: text,
              type: z.enum(["IMAGE", "DOCUMENT"]),
              width: z.number().nullable(),
              height: z.number().nullable(),
              alt: z.string().nullable(),
            }),
          }),
        )
        .optional(),
    }),
  ),
  skills: z.array(skill),
  timelines: z.array(
    z.object({
      id: text,
      title: text,
      organization: text,
      location: optionalText,
      description: optionalText,
      type: z
        .enum([
          "EDUCATION",
          "EXPERIENCE",
          "CERTIFICATION",
          "TRAINING",
          "ACHIEVEMENT",
        ])
        .transform((v) => v as TimelineType),
      startDate: z.iso.datetime().nullable(),
      endDate: z.iso.datetime().nullable().optional(),
      current: z.boolean(),
      displayOrder: z.number(),
      credentialUrl: optionalText,
      credentialId: optionalText,
      expiresAt: optionalText,
    }),
  ),
});
export type CvContent = z.infer<typeof cvSchema>;

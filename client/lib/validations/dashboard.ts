import { z } from "zod";
const count = z.number().int().nonnegative();
export const dashboardSchema = z.object({
  generatedAt: z.iso.datetime(),
  projects: z.object({
    total: count,
    published: count,
    draft: count,
    archived: count,
  }),
  messages: z.object({
    total: count,
    unread: count,
    read: count,
    replied: count,
  }),
  media: z.object({ files: count, bytes: count }),
  content: z.object({
    skills: count,
    categories: count,
    timelineEntries: count,
    credentials: count,
  }),
  recentProjects: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
      updatedAt: z.iso.datetime(),
      category: z.object({ name: z.string() }),
    }),
  ),
  recentMessages: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      // Message submission already validates the address; accept its full RFC character set.
      email: z.string(),
      subject: z.string(),
      status: z.enum(["UNREAD", "READ", "REPLIED"]),
      createdAt: z.iso.datetime(),
    }),
  ),
});
export type DashboardSummary = z.infer<typeof dashboardSchema>;

import { z } from "zod";
import { TimelineType } from "@/lib/enums/timeline";

const baseTimelineSchema = z.object({
  credentialId: z.string().max(200).optional(),
  credentialUrl: z
    .string()
    .url()
    .startsWith("https://", "Use an HTTPS credential link")
    .or(z.literal(""))
    .optional(),
  expiresAt: z.string().date().or(z.literal("")).optional(),
  title: z.string().min(1, "Title is required"),
  organization: z.string().min(1, "Organization is required"),
  location: z.string().optional(),
  description: z.string().optional(),
  type: z.enum(TimelineType),
  startDate: z
    .string()
    .date("Start date must be a valid date (YYYY-MM-DD)")
    .or(z.literal(""))
    .optional(),
  endDate: z
    .string()
    .date("End date must be a valid date (YYYY-MM-DD)")
    .or(z.literal(""))
    .optional(),
  current: z.boolean().default(false),
  displayOrder: z.number().int().min(0).optional(),
});

export const createTimelineSchema = baseTimelineSchema.superRefine(
  (data, ctx) => {
    if (!data.startDate && (data.current || !data.endDate)) {
      ctx.addIssue({
        code: "custom",
        message: data.current
          ? "Start date is required for ongoing entries"
          : "Enter a start or end date",
        path: ["startDate"],
      });
    }
    if (
      !data.current &&
      data.endDate &&
      data.startDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["endDate"],
      });
    }
  },
);

export const updateTimelineSchema = baseTimelineSchema
  .partial()
  .superRefine((data, ctx) => {
    if (
      !data.current &&
      data.endDate &&
      data.startDate &&
      data.endDate < data.startDate
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "End date must be on or after start date",
        path: ["endDate"],
      });
    }
  });

export type CreateTimelineSchema = z.infer<typeof createTimelineSchema>;
export type UpdateTimelineSchema = z.infer<typeof updateTimelineSchema>;

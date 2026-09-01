import { z } from "zod";
import { TimelineType } from "@/lib/enums/timeline";

const baseTimelineSchema = z.object({
    title: z.string().min(1, "Title is required"),
    organization: z.string().min(1, "Organization is required"),
    location: z.string().optional(),
    description: z.string().optional(),
    type: z.enum(TimelineType),
    startDate: z.string().date("Start date must be a valid date (YYYY-MM-DD)"),
    endDate: z
        .string()
        .date("End date must be a valid date (YYYY-MM-DD)")
        .or(z.literal(""))
        .optional(),
    current: z.boolean().default(false),
    displayOrder: z.number().min(0).default(0),
});

export const createTimelineSchema = baseTimelineSchema.superRefine((data, ctx) => {
    if (!data.current && (!data.endDate || data.endDate.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date is required when not currently working here",
            path: ["endDate"],
        });
    }
});

export const updateTimelineSchema = baseTimelineSchema.partial().superRefine((data, ctx) => {
    if (data.current === false && (!data.endDate || data.endDate.trim() === "")) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "End date is required when not currently working here",
            path: ["endDate"],
        });
    }
});

export type CreateTimelineSchema = z.infer<typeof createTimelineSchema>;
export type UpdateTimelineSchema = z.infer<typeof updateTimelineSchema>;
import { z } from "zod";

import { TimelineType } from "@/lib/enums/timeline";

export const createTimelineSchema = z.object({
    title: z.string().min(1, "Title is required"),

    organization: z.string().min(1, "Organization is required"),

    location: z.string().optional(),

    description: z.string().optional(),

    type: z.enum(TimelineType),

    startDate: z.string().date("Start date must be a valid date (YYYY-MM-DD)"),

    endDate: z.string().date("End date must be a valid date (YYYY-MM-DD)").optional(),

    current: z.boolean().default(false),

    displayOrder: z.number().min(0).default(0),
});

export const updateTimelineSchema =
    createTimelineSchema.partial();

export type CreateTimelineSchema = z.infer<typeof createTimelineSchema>;
export type UpdateTimelineSchema = z.infer<typeof updateTimelineSchema>;
import { z } from "zod";

export const createSkillSchema = z.object({
    name: z.string().min(1, "Name is required"),

    icon: z.string().optional(),

    color: z.string().optional(),

    level: z.number().min(0).max(100),

    displayOrder: z.number().min(0).default(0),
});

export const updateSkillSchema =
    createSkillSchema.partial();

export type CreateSkillSchema = z.infer<typeof createSkillSchema>;
export type UpdateSkillSchema = z.infer<typeof updateSkillSchema>;
import { z } from "zod";

export const createCategorySchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Category name must be at least 2 characters.")
        .max(50, "Category name cannot exceed 50 characters."),

    description: z
        .string()
        .trim()
        .max(255, "Description cannot exceed 255 characters.")
        .optional()
        .or(z.literal("")),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;

export type UpdateCategorySchema = z.infer<typeof updateCategorySchema>;
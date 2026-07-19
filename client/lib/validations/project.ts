import { z } from "zod";

import { ProjectStatus } from "@/lib/enums/project";

export const createProjectSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),

    excerpt: z.string().min(1, "Excerpt is required"),

    description: z.string().min(1, "Description is required"),

    githubUrl: z
        .string()
        .url("Invalid GitHub URL")
        .optional()
        .or(z.literal("")),

    liveUrl: z
        .string()
        .url("Invalid Live URL")
        .optional()
        .or(z.literal("")),

    featured: z.boolean().default(false),

    status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),

    displayOrder: z.number().min(0).default(0),

    categoryId: z.string().min(1, "Category is required"),
});

export const updateProjectSchema =
    createProjectSchema.partial();

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
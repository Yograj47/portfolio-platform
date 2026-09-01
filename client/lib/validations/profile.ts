import { z } from "zod";

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Name is required")
        .max(100, "Name must be less than 100 characters"),

    email: z
        .string()
        .trim()
        .email("Enter a valid email address"),

    avatar: z
        .string()
        .trim()
        .url("Enter a valid avatar URL")
        .nullable()
        .optional()
        .or(z.literal("")),

    role: z
        .string()
        .trim()
        .max(100, "Role must be less than 100 characters")
        .optional()
        .or(z.literal("")),

    location: z
        .string()
        .trim()
        .max(100, "Location must be less than 100 characters")
        .optional()
        .or(z.literal("")),

    isAvailable: z.boolean(),

    openToFullTime: z.boolean(),
    openToOpenSource: z.boolean(),
    openToFreelance: z.boolean(),

    githubUrl: z
        .string()
        .trim()
        .url("Enter a valid GitHub URL")
        .optional()
        .or(z.literal("")),

    linkedinUrl: z
        .string()
        .trim()
        .url("Enter a valid LinkedIn URL")
        .optional()
        .or(z.literal("")),

    resumeUrl: z
        .string()
        .trim()
        .url("Enter a valid resume URL")
        .optional()
        .or(z.literal("")),
});

export type ProfileSchema = z.infer<typeof profileSchema>;

export interface UpdateProfileData {
    name: string;
    email: string;
    avatar?: string | null;
    role?: string;
    location?: string;

    isAvailable: boolean;

    openToFullTime: boolean;
    openToOpenSource: boolean;
    openToFreelance: boolean;

    githubUrl?: string;
    linkedinUrl?: string;
    resumeUrl?: string;
}
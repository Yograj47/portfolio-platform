import type { ProjectStatus } from "@/lib/enums/project";
import type { TimelineType } from "@/lib/enums/timeline";

export interface Category {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
}

export interface Skill {
  group?: string | null;
  id: string;
  name: string;
  icon?: string;
  color?: string;
  level: number;
  displayOrder: number;
}

export interface Timeline {
  credentialId?: string | null;
  credentialUrl?: string | null;
  expiresAt?: string | null;
  id: string;
  title: string;
  organization: string;
  location?: string | null;
  description?: string | null;
  type: TimelineType;
  startDate: string | null;
  endDate?: string | null;
  current: boolean;
  displayOrder: number;
}

export type Project = PublicProject;

export type ProjectMediaItem = {
  id: string;
  projectId: string;
  mediaId: string;
  displayOrder: number;
  isCover: boolean;
  isActive: boolean;
  media: {
    id: string;
    publicId: string;
    url: string;
    fileName: string;
    mimeType: string;
    type: "IMAGE" | "DOCUMENT";
    width: number | null;
    height: number | null;
    alt: string | null;
  };
};

export type PublicProject = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  description: string;
  githubUrl: string | null;
  liveUrl: string | null;
  featured: boolean;
  status: ProjectStatus;
  displayOrder: number;
  categoryId: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  technologies: string[];
  skills: {
    skillId: string;
    projectId: string;
    usageNote: string | null;
    skill: Skill;
  }[];
  media?: ProjectMediaItem[];
};

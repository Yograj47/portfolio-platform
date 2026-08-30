import http from "@/lib/http";

export type CreateProjectMediaData = {
    projectId: string;
    mediaId: string;
    displayOrder?: number;
    isCover?: boolean;
};

export type UpdateProjectMediaData = {
    displayOrder?: number;
    isCover?: boolean;
};

export type ProjectMedia = {
    id: string;
    projectId: string;
    mediaId: string;
    displayOrder: number;
    isCover: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    media: {
        id: string;
        publicId: string;
        url: string;
        fileName: string;
        mimeType: string;
        type: "IMAGE" | "DOCUMENT";
        size: number;
        width: number | null;
        height: number | null;
        alt: string | null;
        description: string | null;
    };
};

export const projectMediaService = {
    create(data: CreateProjectMediaData) {
        return http.post<{ data: ProjectMedia }>("/project-media", data);
    },

    findAll(projectId: string) {
        return http.get<{ data: ProjectMedia[] }>(
            `/project-media/project/${projectId}`,
        );
    },

    findOne(id: string) {
        return http.get<{ data: ProjectMedia }>(`/project-media/${id}`);
    },

    update(id: string, data: UpdateProjectMediaData) {
        return http.patch<{ data: ProjectMedia }>(`/project-media/${id}`, data);
    },

    restore(id: string) {
        return http.patch<{ data: ProjectMedia }>(`/project-media/${id}/restore`);
    },

    remove(id: string) {
        return http.delete<{ data: ProjectMedia }>(`/project-media/${id}`);
    },
};
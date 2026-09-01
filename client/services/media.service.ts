import http from "@/lib/http";

export type CreateMediaData = {
    publicId: string;
    url: string;
    fileName: string;
    mimeType: string;
    type: "IMAGE" | "DOCUMENT";
    size: number;
    width?: number;
    height?: number;
    alt?: string;
    description?: string;
};

export type MediaProjectRelation = {
    id: string;
    projectId: string;
    mediaId: string;
    displayOrder: number;
    isCover: boolean;
    isActive: boolean;
    project: {
        id: string;
        title: string;
        slug: string;
    };
};

export type Media = {
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
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
    projects?: MediaProjectRelation[];
};

export type FindAllMediaResponse = {
    projectMedia: Media[];
    generalMedia: Media[];
    total: number;
};

export type ImageKitUploadAuth = {
    token: string;
    expire: number;
    signature: string;
};

export const mediaService = {
    getUploadAuth() {
        return http.get<{ data: ImageKitUploadAuth }>("/media/upload-auth");
    },

    create(data: CreateMediaData) {
        return http.post<{ data: Media }>("/media", data);
    },

    findAll() {
        return http.get<{ data: FindAllMediaResponse }>("/media");
    },

    findOne(id: string) {
        return http.get<{ data: Media }>(`/media/${id}`);
    },

    update(id: string, data: Partial<CreateMediaData>) {
        return http.patch<{ data: Media }>(`/media/${id}`, data);
    },

    remove(id: string) {
        return http.delete<{ data: Media }>(`/media/${id}`);
    },
};
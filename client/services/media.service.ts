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
};

export type ImageKitUploadAuth = {
    token: string;
    expire: number;
    signature: string;
};

export const mediaService = {
    getUploadAuth() {
        return http.get("/media/upload-auth");
    },

    create(data: CreateMediaData) {
        return http.post("/media", data);
    },

    findAll() {
        return http.get("/media");
    },

    findOne(id: string) {
        return http.get(`/media/${id}`);
    },

    update(id: string, data: Partial<CreateMediaData>) {
        return http.patch(`/media/${id}`, data);
    },

    remove(id: string) {
        return http.delete(`/media/${id}`);
    },
};
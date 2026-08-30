"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upload } from "@imagekit/javascript";

import {
    mediaService,
    type CreateMediaData,
    type Media,
} from "@/services/media.service";
import { showError, showSuccess } from "@/lib/toast";

export const MEDIA_QUERY_KEYS = {
    all: ["media"] as const,
    detail: (id: string) => ["media", id] as const,
};

interface UploadMediaInput {
    file: File;
    fileName?: string;
    folder?: string;
    alt?: string;
    description?: string;
}

interface UpdateMediaInput {
    id: string;
    data: Partial<CreateMediaData>;
}

export function useMedia() {
    const queryClient = useQueryClient();

    // Fetch all media
    const mediaListQuery = useQuery({
        queryKey: MEDIA_QUERY_KEYS.all,
        queryFn: async () => {
            const response = await mediaService.findAll();
            return response.data.data;
        },
    });

    // Upload Mutation
    const uploadMutation = useMutation<Media, Error, UploadMediaInput>({
        mutationFn: async ({
            file,
            fileName,
            folder = "/portfolio",
            alt,
            description,
        }) => {
            const response = await mediaService.getUploadAuth();
            const auth = response.data.data;

            const result = await upload({
                file,
                fileName: fileName ?? file.name,
                publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                token: auth.token,
                expire: auth.expire,
                signature: auth.signature,
                folder,
            });

            if (
                !result.fileId ||
                !result.url ||
                !result.name ||
                result.size === undefined
            ) {
                throw new Error(
                    "ImageKit upload returned incomplete file information.",
                );
            }

            const mediaData: CreateMediaData = {
                publicId: result.fileId,
                url: result.url,
                fileName: result.name,
                mimeType: file.type,
                type: "IMAGE",
                size: result.size,
                width: result.width,
                height: result.height,
                alt,
                description,
            };

            const mediaResponse = await mediaService.create(mediaData);
            return mediaResponse.data.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
            showSuccess("Media uploaded successfully.");
        },

        onError: (error) => {
            showError(error.message || "Failed to upload media.");
        },
    });

    // Update Mutation (PATCH /media/:id)
    const updateMutation = useMutation<Media, Error, UpdateMediaInput>({
        mutationFn: async ({ id, data }) => {
            const response = await mediaService.update(id, data);
            return response.data.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
            showSuccess("Media updated successfully.");
        },

        onError: () => {
            showError("Failed to update media.");
        },
    });

    // Delete Mutation
    const deleteMutation = useMutation<Media, Error, string>({
        mutationFn: async (id: string) => {
            const response = await mediaService.remove(id);
            return response.data.data;
        },

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
            showSuccess("Media deleted successfully.");
        },

        onError: () => {
            showError("Failed to delete media.");
        },
    });

    return {
        // List Query
        mediaData: mediaListQuery.data ?? null,
        loadingMedia: mediaListQuery.isLoading,
        mediaError: mediaListQuery.isError,
        refetchMedia: mediaListQuery.refetch,

        // Upload
        uploadMedia: uploadMutation.mutate,
        uploadMediaAsync: uploadMutation.mutateAsync,
        uploading: uploadMutation.isPending,
        uploadError: uploadMutation.isError,
        uploadResult: uploadMutation.data ?? null,

        // Update
        updateMedia: updateMutation.mutate,
        updateMediaAsync: updateMutation.mutateAsync,
        updating: updateMutation.isPending,
        updateError: updateMutation.isError,

        // Delete
        deleteMedia: deleteMutation.mutate,
        deleteMediaAsync: deleteMutation.mutateAsync,
        deleting: deleteMutation.isPending,
        deleteError: deleteMutation.isError,
    };
}
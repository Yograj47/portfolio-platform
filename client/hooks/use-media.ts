"use client";

import { useMutation } from "@tanstack/react-query";
import { upload } from "@imagekit/javascript";

import {
    mediaService,
    type CreateMediaData,
    type Media,
} from "@/services/media.service";

import { showError, showSuccess } from "@/lib/toast";

interface UploadMediaInput {
    file: File;
    fileName?: string;
    folder?: string;
    alt?: string;
    description?: string;
}

export function useMedia() {
    const uploadMutation = useMutation<
        Media,
        Error,
        UploadMediaInput
    >({
        mutationFn: async ({
            file,
            fileName,
            folder = "/portfolio",
            alt,
            description,
        }) => {
            // 1. Get temporary ImageKit authentication
            const response =
                await mediaService.getUploadAuth();

            const auth = response.data.data;

            // 2. Upload directly to ImageKit
            const result = await upload({
                file,
                fileName: fileName ?? file.name,
                publicKey:
                    process.env
                        .NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
                token: auth.token,
                expire: auth.expire,
                signature: auth.signature,
                folder,
            });

            // 3. Validate ImageKit response
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

            // 4. Create our Media record
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

            // 5. Save Media in our database
            const mediaResponse =
                await mediaService.create(mediaData);

            return mediaResponse.data.data;
        },

        onError: () => {
            showError("Failed to upload media.");
        },
    });

    const deleteMutation = useMutation<
        Media,
        Error,
        string
    >({
        mutationFn: async (id: string) => {
            const response = await mediaService.remove(id);

            return response.data.data;
        },

        onSuccess: () => {
            showSuccess("Media deleted successfully.");
        },

        onError: () => {
            showError("Failed to delete media.");
        },
    });

    return {
        // Upload
        uploadMedia: uploadMutation.mutate,
        uploadMediaAsync: uploadMutation.mutateAsync,
        uploading: uploadMutation.isPending,
        uploadError: uploadMutation.isError,
        uploadResult: uploadMutation.data ?? null,

        // Delete
        deleteMedia: deleteMutation.mutate,
        deleteMediaAsync: deleteMutation.mutateAsync,
        deleting: deleteMutation.isPending,
        deleteError: deleteMutation.isError,
    };
}

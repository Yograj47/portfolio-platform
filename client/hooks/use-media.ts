"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { upload } from "@imagekit/javascript";

import {
  mediaService,
  type CreateMediaData,
  type Media,
} from "@/services/media.service";
import { showError, showSuccess } from "@/lib/toast";
import { apiError } from "@/lib/api-error";
import { useState } from "react";

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
  const [pendingUpload, setPendingUpload] = useState<CreateMediaData | null>(
    null,
  );

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
      if (pendingUpload)
        throw new Error(
          "Save the previous upload to the library before uploading another file.",
        );
      const allowed = [
        "image/png",
        "image/jpeg",
        "image/webp",
        "image/gif",
        "image/avif",
        "application/pdf",
      ];
      if (!allowed.includes(file.type))
        throw new Error("Choose a PNG, JPEG, WebP, GIF, AVIF or PDF file.");
      if (file.size < 1 || file.size > 10485760)
        throw new Error("Choose a file between 1 byte and 10 MB.");
      if (!process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY)
        throw new Error("Media uploads are not configured.");
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
        type: file.type === "application/pdf" ? "DOCUMENT" : "IMAGE",
        size: result.size,
        width:
          file.type.startsWith("image/") && result.width
            ? result.width
            : undefined,
        height:
          file.type.startsWith("image/") && result.height
            ? result.height
            : undefined,
        alt,
        description,
      };

      setPendingUpload(mediaData);
      const mediaResponse = await mediaService.create(mediaData);
      setPendingUpload(null);
      return mediaResponse.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
      showSuccess("Media uploaded successfully.");
    },

    onError: (error) => {
      showError(apiError(error, "Failed to upload media."));
    },
  });

  const retryRegistration = useMutation({
    mutationFn: async () => {
      if (!pendingUpload)
        throw new Error("There is no upload waiting to be saved.");
      return (await mediaService.create(pendingUpload)).data.data;
    },
    onSuccess: () => {
      setPendingUpload(null);
      void queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
      showSuccess("Uploaded file saved to the library.");
    },
    onError: (error) =>
      showError(apiError(error, "Could not save uploaded file. Try again.")),
  });

  // Update Mutation (PATCH /media/:id)
  const updateMutation = useMutation<Media, Error, UpdateMediaInput>({
    mutationFn: async ({ id, data }) => {
      const response = await mediaService.update(id, data);
      return response.data.data;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEDIA_QUERY_KEYS.all });
      void queryClient.invalidateQueries({ queryKey: ["project-media"] });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      showSuccess("Media updated successfully.");
    },

    onError: (error) => {
      showError(apiError(error, "Failed to update media."));
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
      void queryClient.invalidateQueries({ queryKey: ["project-media"] });
      void queryClient.invalidateQueries({ queryKey: ["projects"] });
      showSuccess("Media deleted successfully.");
    },

    onError: (error) => {
      showError(apiError(error, "Failed to delete media."));
    },
  });

  return {
    pendingUpload,
    retryRegistration: retryRegistration.mutateAsync,
    registering: retryRegistration.isPending,
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

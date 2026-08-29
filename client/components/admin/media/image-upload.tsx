"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
    ImageIcon,
    Loader2,
    Upload,
    X,
} from "lucide-react";

import type { Media } from "@/services/media.service";
import { useMedia } from "@/hooks/use-media";

interface ImageUploadProps {
    value?: Media | null;
    onChange?: (media: Media | null) => void;
    folder?: string;
    alt?: string;
    description?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    folder = "/portfolio",
    alt,
    description,
    disabled = false,
}: ImageUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const [preview, setPreview] = useState<string | null>(
        value?.url ?? null,
    );

    const [removing, setRemoving] = useState(false);

    const {
        uploadMediaAsync,
        deleteMediaAsync,
        uploading,
        deleting,
    } = useMedia();

    const busy = uploading || deleting || removing;

    const handleFileChange = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const file = event.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            return;
        }

        const localPreview = URL.createObjectURL(file);

        setPreview(localPreview);

        try {
            /*
             * If this component already has a Media record,
             * delete it before creating the replacement.
             */
            if (value?.id) {
                await deleteMediaAsync(value.id);
            }

            /*
             * Upload the new image to ImageKit and
             * register it in our database.
             */
            const media = await uploadMediaAsync({
                file,
                folder,
                alt,
                description,
            });

            setPreview(media.url);

            onChange?.(media);
        } catch {
            /*
             * If replacement fails, restore the
             * previous image instead of leaving
             * the temporary local preview.
             */
            setPreview(value?.url ?? null);
        } finally {
            if (inputRef.current) {
                inputRef.current.value = "";
            }

            URL.revokeObjectURL(localPreview);
        }
    };

    const handleRemove = async () => {
        if (!value?.id) {
            setPreview(null);
            onChange?.(null);
            return;
        }

        try {
            setRemoving(true);

            await deleteMediaAsync(value.id);

            setPreview(null);
            onChange?.(null);
        } catch {
            // Keep the existing image if deletion failed.
        } finally {
            setRemoving(false);
        }
    };

    return (
        <div className="space-y-3">
            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={disabled || busy}
                className="hidden"
            />

            {!preview ? (
                <button
                    type="button"
                    disabled={disabled || busy}
                    onClick={() => inputRef.current?.click()}
                    className="flex min-h-48 w-full flex-col items-center justify-center rounded-lg border border-dashed transition-colors hover:bg-muted/30 disabled:pointer-events-none disabled:opacity-50"
                >
                    {busy ? (
                        <>
                            <Loader2 className="mb-3 size-8 animate-spin text-muted-foreground" />

                            <span className="text-sm font-medium">
                                {deleting || removing
                                    ? "Removing image..."
                                    : "Uploading image..."}
                            </span>

                            <span className="mt-1 text-xs text-muted-foreground">
                                Please wait
                            </span>
                        </>
                    ) : (
                        <>
                            <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-muted">
                                <Upload className="size-5" />
                            </div>

                            <span className="text-sm font-medium">
                                Upload image
                            </span>

                            <span className="mt-1 text-xs text-muted-foreground">
                                Click to select an image
                            </span>
                        </>
                    )}
                </button>
            ) : (
                <div className="relative overflow-hidden rounded-lg border">
                    <div className="relative aspect-video w-full">
                        <Image
                            src={preview}
                            alt={alt ?? "Uploaded image"}
                            fill
                            className="object-cover"
                        />

                        {busy && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                                <div className="flex items-center gap-2 rounded-md bg-background px-4 py-2 text-sm shadow">
                                    <Loader2 className="size-4 animate-spin" />

                                    {deleting || removing
                                        ? "Removing..."
                                        : "Uploading..."}
                                </div>
                            </div>
                        )}

                        {!busy && (
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-background/90 shadow transition-colors hover:bg-background"
                                aria-label="Remove image"
                            >
                                <X className="size-4" />
                            </button>
                        )}
                    </div>

                    {!busy && (
                        <div className="flex items-center justify-between border-t px-3 py-2">
                            <div className="flex min-w-0 items-center gap-2">
                                <ImageIcon className="size-4 shrink-0 text-muted-foreground" />

                                <span className="truncate text-xs text-muted-foreground">
                                    {value?.fileName ??
                                        "Image selected"}
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    inputRef.current?.click()
                                }
                                className="text-xs font-medium hover:underline"
                            >
                                Replace
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );

}

"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { Upload, Trash2, RefreshCw, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useMedia } from "@/hooks/use-media"; // Adjust path to where your useMedia hook is located
import type { Media } from "@/services/media.service";

interface ImageUploadProps {
    value?: Media | string | null;
    onChange: (value: Media | string | null) => void;
    folder?: string;
    alt?: string;
    description?: string;
    disabled?: boolean;
}

export function ImageUpload({
    value,
    onChange,
    folder = "/avatars",
    alt = "Uploaded image",
    description,
    disabled = false,
}: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { uploadMediaAsync, deleteMediaAsync } = useMedia();

    const [isUploading, setIsUploading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Safely extract preview URL regardless of whether value is a raw string or Media object
    const preview =
        typeof value === "string"
            ? value
            : value && typeof value === "object" && "url" in value
                ? value.url
                : null;

    // Check if image is registered in your backend DB (has a valid Media ID)
    const isRegisteredMedia =
        typeof value === "object" &&
        value !== null &&
        Boolean(value.id) &&
        value.id !== "avatar-preview";

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Uses your exact ImageKit + Backend registration mutation
            const registeredMedia = await uploadMediaAsync({
                file,
                folder,
                alt,
                description,
            });

            // Pass registered URL back to form state
            onChange(registeredMedia.url);
        } catch (error) {
            console.error("Upload error:", error);
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleRemove = async () => {
        if (!value) return;

        try {
            setIsDeleting(true);

            // Only attempt DB deletion if image has a registered Media ID
            if (isRegisteredMedia && typeof value === "object" && value.id) {
                await deleteMediaAsync(value.id);
            }
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setIsDeleting(false);
            // Reset local state regardless of whether it was registered or external
            onChange(null);
        }
    };

    return (
        <div className="space-y-4">
            {/* Hidden file input triggered by custom UI */}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled || isUploading || isDeleting}
            />

            {preview ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border bg-muted">
                    <Image
                        src={preview}
                        alt={alt}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                    />

                    <div className="absolute right-2 top-2 flex items-center gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={disabled || isUploading || isDeleting}
                            onClick={handleTriggerUpload}
                        >
                            {isUploading ? (
                                <Loader2 className="mr-2 size-4 animate-spin" />
                            ) : (
                                <RefreshCw className="mr-2 size-4" />
                            )}
                            Upload New
                        </Button>

                        <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            disabled={disabled || isUploading || isDeleting}
                            onClick={handleRemove}
                        >
                            {isDeleting ? (
                                <Loader2 className="size-4 animate-spin" />
                            ) : (
                                <Trash2 className="size-4" />
                            )}
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    onClick={handleTriggerUpload}
                    className="flex aspect-video w-full cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-input p-6 text-center transition-colors hover:bg-accent/50"
                >
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <p className="text-sm font-medium">Uploading & registering image...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full bg-muted p-3">
                                <Upload className="size-6 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Click to upload a new image</p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, WEBP up to 5MB
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
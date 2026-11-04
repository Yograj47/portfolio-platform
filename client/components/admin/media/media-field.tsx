"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FileText, Images, Loader2, Upload, X } from "lucide-react";
import { useMedia } from "@/hooks/use-media";
import type { Media } from "@/services/media.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { ErrorState } from "@/components/feedback/error-state";

export function MediaField({
  value,
  onChange,
  type = "IMAGE",
  disabled = false,
  folder = "/portfolio",
  alt,
  description,
}: {
  value?: string | Media | null;
  onChange: (media: Media | null) => void;
  type?: "IMAGE" | "DOCUMENT";
  disabled?: boolean;
  folder?: string;
  alt?: string;
  description?: string;
}) {
  const input = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const {
    mediaData,
    loadingMedia,
    mediaError,
    refetchMedia,
    uploadMediaAsync,
    uploading,
    pendingUpload,
    retryRegistration,
    registering,
  } = useMedia();
  const url = typeof value === "string" ? value : value?.url;
  const files = [
    ...(mediaData?.projectMedia ?? []),
    ...(mediaData?.generalMedia ?? []),
  ].filter(
    (file) =>
      file.type === type &&
      file.fileName.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-3">
      {pendingUpload && (
        <div
          role="alert"
          className="space-y-2 rounded-lg border border-amber-400/40 bg-amber-50/10 p-3 text-sm"
        >
          <p>
            Your file uploaded, but could not be saved to the library. Keep this
            editor open and retry without uploading again.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={registering}
            onClick={async () => {
              try {
                onChange(await retryRegistration());
              } catch {
                /* Mutation displays the error. */
              }
            }}
          >
            {registering ? "Saving…" : "Retry saving upload"}
          </Button>
        </div>
      )}
      {url && (
        <div className="relative flex h-40 items-center justify-center overflow-hidden rounded-xl border bg-muted/30">
          {type === "IMAGE" ? (
            <Image
              src={url}
              fill
              sizes="500px"
              alt={alt || "Selected image"}
              className="object-contain"
            />
          ) : (
            <a
              className="flex max-w-full items-center gap-2 break-all p-4 text-sm underline"
              href={url}
              target="_blank"
              rel="noreferrer"
            >
              <FileText />
              Open selected PDF
            </a>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => input.current?.click()}
        >
          {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
          {uploading
            ? "Uploading…"
            : type === "IMAGE"
              ? "Upload image"
              : "Upload PDF"}
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={disabled || uploading}
          onClick={() => setOpen(true)}
        >
          <Images />
          Choose existing
        </Button>
        {url && (
          <Button
            type="button"
            size="sm"
            variant="ghost"
            disabled={disabled || uploading}
            onClick={() => onChange(null)}
          >
            <X />
            Clear selection
          </Button>
        )}
      </div>
      <p className="text-xs text-muted-foreground">
        {type === "IMAGE" ? "PNG, JPEG, WebP, GIF or AVIF" : "PDF document"} ·
        Maximum 10 MB. Clearing only removes the selection; files stay in your
        library.
      </p>
      <input
        ref={input}
        type="file"
        className="hidden"
        aria-label={type === "IMAGE" ? "Upload image" : "Upload PDF"}
        accept={
          type === "IMAGE"
            ? "image/png,image/jpeg,image/webp,image/gif,image/avif"
            : "application/pdf"
        }
        disabled={disabled || uploading}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (!file) return;
          try {
            onChange(
              await uploadMediaAsync({ file, folder, alt, description }),
            );
          } catch {
            /* Mutation displays the error. */
          }
        }}
      />
      <FormDialog
        open={open}
        onOpenChange={setOpen}
        title={type === "IMAGE" ? "Choose an image" : "Choose a resume PDF"}
        description="Reuse an existing file without uploading it again."
      >
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search files…"
          aria-label="Search library"
          className="mb-4"
        />
        {mediaError ? (
          <ErrorState onRetry={() => void refetchMedia()} />
        ) : loadingMedia ? (
          <p role="status">Loading library…</p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {files.map((file) => (
              <button
                key={file.id}
                type="button"
                className="overflow-hidden rounded-lg border p-2 text-left hover:border-primary focus-visible:ring-2 focus-visible:ring-ring"
                onClick={() => {
                  onChange(file);
                  setOpen(false);
                }}
              >
                <div className="relative mb-2 flex aspect-video items-center justify-center bg-muted">
                  {type === "IMAGE" ? (
                    <Image
                      src={file.url}
                      fill
                      sizes="200px"
                      alt={file.alt || file.fileName}
                      className="object-contain"
                    />
                  ) : (
                    <FileText />
                  )}
                </div>
                <p className="truncate text-xs">{file.fileName}</p>
              </button>
            ))}
          </div>
        )}
        {!loadingMedia && !mediaError && files.length === 0 && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No matching files. Upload one to get started.
          </p>
        )}
      </FormDialog>
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import { Upload, RefreshCw, Images } from "lucide-react";
import { useMedia } from "@/hooks/use-media";
import { useProject } from "@/hooks/use-project";
import { useProjectMedia } from "@/hooks/use-project-media";
import type { Media } from "@/services/media.service";
import { PageHeader } from "@/components/admin/dashboard/page-header";
import { MediaCard } from "@/components/admin/media/media-card";
import { AttachProjectDialog } from "@/components/admin/media/attach-project-dialog";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/feedback/error-state";

export default function MediaPage() {
  const input = useRef<HTMLInputElement>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Media | null>(null);
  const [dialog, setDialog] = useState<"attach" | "delete" | "edit" | null>(
    null,
  );
  const [alt, setAlt] = useState("");
  const [description, setDescription] = useState("");
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
    deleteMedia,
    deleting,
    updateMedia,
    updating,
  } = useMedia();
  const {
    projects,
    loading: loadingProjects,
    error: projectsError,
  } = useProject();
  const { attachMedia, attaching, removeProjectMedia, removing } =
    useProjectMedia();
  const files = [
    ...(mediaData?.projectMedia ?? []),
    ...(mediaData?.generalMedia ?? []),
  ];
  const visible = files.filter((file) => {
    const used = Boolean(
      file.projects?.length ||
      file.avatarUsers?.length ||
      file.resumeUsers?.length,
    );
    return (
      `${file.fileName} ${file.alt ?? ""}`
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (filter === "all" ||
        (filter === "unused" && !used) ||
        (filter === "projects" && Boolean(file.projects?.length)) ||
        (filter === "profile" &&
          Boolean(file.avatarUsers?.length || file.resumeUsers?.length)) ||
        (filter === "documents" && file.type === "DOCUMENT"))
    );
  });
  function choose(file: Media, next: typeof dialog) {
    setSelected(file);
    setDialog(next);
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-5">
      <PageHeader
        description="Upload once, reuse across projects and your profile. Detach a file to remove its use; delete only when it is unused."
        action={
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void refetchMedia()}
            >
              <RefreshCw />
              Refresh
            </Button>
            <Button
              size="sm"
              disabled={uploading}
              onClick={() => input.current?.click()}
            >
              <Upload />
              {uploading ? "Uploading…" : "Upload file"}
            </Button>
          </>
        }
      />
      {pendingUpload && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-400/40 p-4 text-sm"
        >
          <p>
            File uploaded, but library registration failed. Keep this page open
            and retry saving.
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={registering}
            onClick={async () => {
              try {
                await retryRegistration();
              } catch {
                /* Hook displays error. */
              }
            }}
          >
            {registering ? "Saving…" : "Retry saving upload"}
          </Button>
        </div>
      )}
      <input
        ref={input}
        type="file"
        className="hidden"
        aria-label="Upload media file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif,application/pdf"
        disabled={uploading}
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            try {
              await uploadMediaAsync({ file });
            } catch {
              /* Hook displays error. */
            }
          }
        }}
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          ["Files", files.length],
          ["Project images", mediaData?.projectMedia.length ?? 0],
          ["PDFs", files.filter((file) => file.type === "DOCUMENT").length],
        ].map(([label, count]) => (
          <div key={label} className="rounded-xl border bg-card p-4">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 text-2xl font-semibold">
              {loadingMedia ? "—" : count}
            </p>
          </div>
        ))}
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1" aria-label="Filter media">
          {[
            ["all", "All files"],
            ["projects", "Projects"],
            ["profile", "Profile"],
            ["documents", "PDFs"],
            ["unused", "Unused"],
          ].map(([value, label]) => (
            <Button
              key={value}
              size="sm"
              variant={filter === value ? "secondary" : "ghost"}
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
        <Input
          className="w-full sm:max-w-xs"
          aria-label="Search media"
          placeholder="Search filename or alt text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {mediaError && (
        <ErrorState
          title="Media library could not be loaded"
          onRetry={() => void refetchMedia()}
        />
      )}
      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        {loadingMedia ? (
          <div
            role="status"
            aria-label="Loading media"
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
          >
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-60 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : visible.length ? (
          <div
            className={`grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 ${removing ? "pointer-events-none opacity-70" : ""}`}
          >
            {visible.map((file) => (
              <MediaCard
                key={file.id}
                media={file}
                onDelete={(item) => choose(item, "delete")}
                onAttach={() => choose(file, "attach")}
                onDetachRelation={(id) => removeProjectMedia(id)}
                onEdit={(item) => {
                  setAlt(item.alt ?? "");
                  setDescription(item.description ?? "");
                  choose(item, "edit");
                }}
              />
            ))}
          </div>
        ) : (
          !mediaError && (
            <div className="rounded-xl border border-dashed py-20 text-center">
              <Images className="mx-auto mb-3 text-muted-foreground" />
              <h2 className="font-medium">
                {files.length
                  ? "No matching files"
                  : "Your media library is ready"}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {files.length
                  ? "Try another filter or search."
                  : "Upload images or a resume PDF, up to 10 MB each."}
              </p>
            </div>
          )
        )}
      </div>
      <AttachProjectDialog
        key={selected?.id}
        open={dialog === "attach"}
        onOpenChange={(open) => !open && setDialog(null)}
        media={selected}
        projects={projects.filter(
          (project) =>
            !selected?.projects?.some(
              (relation) =>
                relation.projectId === project.id && relation.isActive,
            ),
        )}
        loading={attaching || loadingProjects}
        error={projectsError}
        onConfirm={(mediaId, projectId) =>
          attachMedia(
            { mediaId, projectId },
            { onSuccess: () => setDialog(null) },
          )
        }
      />
      <FormDialog
        open={dialog === "edit"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="File details"
        description={selected?.fileName}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (selected)
              updateMedia(
                { id: selected.id, data: { alt, description } },
                { onSuccess: () => setDialog(null) },
              );
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="media-alt">Alternative text</Label>
            <Input
              id="media-alt"
              maxLength={500}
              value={alt}
              onChange={(e) => setAlt(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Describe the image for people using screen readers.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="media-description">Description</Label>
            <Textarea
              id="media-description"
              maxLength={3000}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button disabled={updating}>
            {updating ? "Saving…" : "Save details"}
          </Button>
        </form>
      </FormDialog>
      <ConfirmationDialog
        open={dialog === "delete"}
        onOpenChange={(open) => !open && setDialog(null)}
        title="Permanently delete file?"
        message={`Delete “${selected?.fileName}” from storage and the library? This cannot be undone. Files in use cannot be deleted.`}
        loading={deleting}
        onConfirm={() =>
          selected &&
          deleteMedia(selected.id, { onSuccess: () => setDialog(null) })
        }
      />
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";

import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { AttachProjectDialog } from "@/components/admin/media/attach-project-dialog";
import { PageHeaderSkeleton } from "@/components/admin/skeletons/page-header.skeleton";
import { PageHeader } from "@/components/admin/dashboard/page-header";

import { useMedia } from "@/hooks/use-media";
import { useProjectMedia } from "@/hooks/use-project-media";
import type { Media } from "@/services/media.service";

import { MediaProjectSection } from "@/components/admin/media/media-project-section";
import { MediaGeneralSection } from "@/components/admin/media/media-general-section";

export default function MediaPage() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);

  const { mediaData, loadingMedia, deleteMedia, deleting } = useMedia();
  const {
    attachMedia,
    attaching,
    restoreProjectMedia,
    removeProjectMedia,
  } = useProjectMedia();

  // Extract available unique projects from loaded projectMedia items
  const availableProjects = useMemo(() => {
    if (!mediaData?.projectMedia) return [];

    const projectsMap = new Map<string, string>();
    for (const media of mediaData.projectMedia) {
      const activeRelation = media.projects?.find((p) => p.isActive);
      if (activeRelation?.project) {
        projectsMap.set(activeRelation.project.id, activeRelation.project.title);
      }
    }

    return Array.from(projectsMap.entries()).map(([id, title]) => ({
      id,
      title,
    }));
  }, [mediaData]);

  const projectGroups = useMemo(() => {
    if (!mediaData?.projectMedia) return [];

    const groups = new Map<
      string,
      {
        projectId: string;
        projectName: string;
        media: Media[];
      }
    >();

    for (const media of mediaData.projectMedia) {
      const relation = media.projects?.find((item) => item.isActive);
      if (!relation) continue;

      const projectId = relation.project.id;

      if (!groups.has(projectId)) {
        groups.set(projectId, {
          projectId,
          projectName: relation.project.title,
          media: [],
        });
      }

      groups.get(projectId)!.media.push(media);
    }

    return Array.from(groups.values());
  }, [mediaData]);

  function handleDelete(media: Media) {
    setSelectedMedia(media);
    setDeleteOpen(true);
  }

  function handleAttachClick(media: Media) {
    setSelectedMedia(media);
    setAttachOpen(true);
  }

  function handleConfirmAttach(mediaId: string, projectId: string) {
    attachMedia(
      { mediaId, projectId },
      {
        onSuccess: () => {
          setAttachOpen(false);
          setSelectedMedia(null);
        },
      }
    );
  }

  // Directly restores soft-deleted project media relation by its join-table ID
  function handleRestore(projectMediaId: string) {
    restoreProjectMedia(projectMediaId);
  }

  // Soft-deletes / detaches media from project (sets isActive = false)
  function handleDetach(projectMediaId: string) {
    removeProjectMedia(projectMediaId);
  }

  function handleConfirmDelete() {
    if (!selectedMedia) return;

    deleteMedia(selectedMedia.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedMedia(null);
      },
    });
  }

  if (loadingMedia) {
    return (
      <div className="flex flex-1 flex-col min-h-0 h-full gap-4">
        <PageHeaderSkeleton hasAction={false} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs"
              >
                <div className="aspect-video animate-pulse bg-muted" />
                <div className="space-y-2 p-3">
                  <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-0 h-full gap-4">
      <PageHeader description="Manage images and other media used across your portfolio." />

      <div className="flex-1 min-h-0 overflow-y-auto space-y-8 pr-1">
        {projectGroups.length > 0 && (
          <div className="space-y-6">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Project Media
              </h2>
            </div>

            {projectGroups.map((group) => (
              <MediaProjectSection
                key={group.projectId}
                projectName={group.projectName}
                media={group.media}
                onDelete={handleDelete}
                onDetach={handleDetach}
              />
            ))}
          </div>
        )}

        <MediaGeneralSection
          media={mediaData?.generalMedia ?? []}
          onDelete={handleDelete}
          onAttach={handleAttachClick}
          onRestore={handleRestore}
        />
      </div>

      <AttachProjectDialog
        open={attachOpen}
        onOpenChange={setAttachOpen}
        media={selectedMedia}
        projects={availableProjects}
        loading={attaching}
        onConfirm={handleConfirmAttach}
      />

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Media"
        message={`Delete "${selectedMedia?.fileName}"? This will permanently remove the media file.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
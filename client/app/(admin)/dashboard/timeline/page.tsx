"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { TimelineTable } from "@/components/admin/timeline/timeline-table";
import { TimelineForm } from "@/components/admin/timeline/timeline-form";

import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";

import { useTimeline } from "@/hooks/use-timeline";

import type {
  CreateTimelineSchema,
  UpdateTimelineSchema,
} from "@/lib/validations/timeline";

import type { Timeline } from "@/components/admin/timeline/timeline-columns";

export default function TimelinePage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedTimeline, setSelectedTimeline] =
    useState<Timeline | null>(null);

  const {
    timelines,
    loading,

    createTimeline,
    updateTimeline,
    deleteTimeline,

    creating,
    updating,
    deleting,
  } = useTimeline();

  function handleCreate(
    data: CreateTimelineSchema
  ) {
    createTimeline(data, {
      onSuccess: () => {
        setCreateOpen(false);
      },
    });
  }

  function handleEdit(timeline: Timeline) {
    setSelectedTimeline(timeline);
    setEditOpen(true);
  }

  function handleDelete(timeline: Timeline) {
    setSelectedTimeline(timeline);
    setDeleteOpen(true);
  }

  function handleUpdate(
    data: UpdateTimelineSchema
  ) {
    if (!selectedTimeline) return;

    updateTimeline(
      {
        id: selectedTimeline.id,
        data,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedTimeline(null);
        },
      }
    );
  }

  function handleConfirmDelete() {
    if (!selectedTimeline) return;

    deleteTimeline(selectedTimeline.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedTimeline(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Timeline
          </h1>

          <p className="text-muted-foreground">
            Manage your timeline entries.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
        >
          New Timeline
        </Button>
      </div>

      <TimelineTable
        data={timelines}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Timeline"
        description="Create a new timeline entry."
      >
        <TimelineForm
          loading={creating}
          onSubmit={handleCreate}
        />
      </FormDialog>

      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Timeline"
        description="Update timeline entry."
      >
        <TimelineForm
          defaultValues={
            selectedTimeline
              ? {
                  title: selectedTimeline.title,
                  organization:
                    selectedTimeline.organization,
                  location:
                    selectedTimeline.location ?? "",
                  description:
                    selectedTimeline.description ?? "",
                  type: selectedTimeline.type,
                  startDate:
                    selectedTimeline.startDate,
                  endDate:
                    selectedTimeline.endDate ??
                    "",
                  current:
                    selectedTimeline.current,
                  displayOrder:
                    selectedTimeline.displayOrder,
                }
              : undefined
          }
          loading={updating}
          onSubmit={handleUpdate}
        />
      </FormDialog>

      <ConfirmationDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Timeline"
        message={`Delete "${selectedTimeline?.title}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
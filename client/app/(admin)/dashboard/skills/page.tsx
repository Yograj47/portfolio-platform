"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SkillTable } from "@/components/admin/skill/skill-table";
import { SkillForm } from "@/components/admin/skill/skill-form";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";
import { useSkill } from "@/hooks/use-skill";

import type {
  CreateSkillSchema,
  UpdateSkillSchema,
} from "@/lib/validations/skill";

import type { Skill } from "@/components/admin/skill/skill-columns";

export default function SkillsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] =
    useState<Skill | null>(null);

  const {
    skills,
    loading,

    createSkill,
    updateSkill,
    deleteSkill,

    creating,
    updating,
    deleting,
  } = useSkill();

  function handleCreate(
    data: CreateSkillSchema
  ) {
    createSkill(data, {
      onSuccess: () => {
        setCreateOpen(false);
      },
    });
  }

  function handleEdit(skill: Skill) {
    setSelectedSkill(skill);
    setEditOpen(true);
  }

  function handleDelete(skill: Skill) {
    setSelectedSkill(skill);
    setDeleteOpen(true);
  }

  function handleUpdate(
    data: UpdateSkillSchema
  ) {
    if (!selectedSkill) return;

    updateSkill(
      {
        id: selectedSkill.id,
        data,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedSkill(null);
        },
      }
    );
  }

  function handleConfirmDelete() {
    if (!selectedSkill) return;

    deleteSkill(selectedSkill.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedSkill(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Skills
          </h1>

          <p className="text-muted-foreground">
            Manage your skills.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
        >
          New Skill
        </Button>
      </div>

      <SkillTable
        data={skills}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Skill"
        description="Create a new skill."
      >
        <SkillForm
          loading={creating}
          onSubmit={handleCreate}
        />
      </FormDialog>

      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Skill"
        description="Update skill."
      >
        <SkillForm
          defaultValues={
            selectedSkill
              ? {
                  name: selectedSkill.name,
                  icon: selectedSkill.icon ?? "",
                  color: selectedSkill.color ?? "",
                  level: selectedSkill.level,
                  displayOrder:
                    selectedSkill.displayOrder,
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
        title="Delete Skill"
        message={`Delete "${selectedSkill?.name}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
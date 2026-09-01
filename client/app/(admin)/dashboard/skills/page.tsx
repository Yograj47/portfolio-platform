"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

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
import { PageHeader } from "@/components/admin/dashboard/page-header";

export default function SkillsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

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

  function handleCreate(data: CreateSkillSchema) {
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

  function handleUpdate(data: UpdateSkillSchema) {
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
    <div className="flex flex-1 flex-col min-h-0 h-full gap-4">
      <PageHeader
        description="Manage your skills."
        action={
          <Button size="sm" onClick={() => setCreateOpen(true)} className="cursor-pointer">
            <Plus className="mr-2 size-4" />
            New Skill
          </Button>
        }
      />

      {/* Table Container bound to flex height */}
      <div className="flex flex-1 flex-col min-h-0">
        <SkillTable
          data={skills}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {/* Dialogs */}
      <FormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Skill"
        description="Create a new skill."
      >
        <SkillForm
          skills={skills}
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
          skills={skills}
          defaultValues={
            selectedSkill
              ? {
                  name: selectedSkill.name,
                  icon: selectedSkill.icon ?? "",
                  color: selectedSkill.color ?? "",
                  level: selectedSkill.level,
                  displayOrder: selectedSkill.displayOrder,
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
"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ProjectTable } from "@/components/project/project-table";
import { ProjectForm } from "@/components/project/project-form";

import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";

import { useProject } from "@/hooks/use-project";
import { useCategory } from "@/hooks/use-category";

import type {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/lib/validations/project";

import type { Project } from "@/components/project/project-columns";

export default function ProjectsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [selectedProject, setSelectedProject] =
    useState<Project | null>(null);

  const {
    projects,
    loading,

    createProject,
    updateProject,
    deleteProject,

    creating,
    updating,
    deleting,
  } = useProject();

  const { categories } = useCategory();

  function handleCreate(
    data: CreateProjectSchema
  ) {
    createProject(data, {
      onSuccess: () => {
        setCreateOpen(false);
      },
    });
  }

  function handleEdit(project: Project) {
    setSelectedProject(project);
    setEditOpen(true);
  }

  function handleDelete(project: Project) {
    setSelectedProject(project);
    setDeleteOpen(true);
  }

  function handleUpdate(
    data: UpdateProjectSchema
  ) {
    if (!selectedProject) return;

    updateProject(
      {
        id: selectedProject.id,
        data,
      },
      {
        onSuccess: () => {
          setEditOpen(false);
          setSelectedProject(null);
        },
      }
    );
  }

  function handleConfirmDelete() {
    if (!selectedProject) return;

    deleteProject(selectedProject.id, {
      onSuccess: () => {
        setDeleteOpen(false);
        setSelectedProject(null);
      },
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Projects
          </h1>

          <p className="text-muted-foreground">
            Manage your portfolio projects.
          </p>
        </div>

        <Button
          onClick={() => setCreateOpen(true)}
        >
          New Project
        </Button>
      </div>

      <ProjectTable
        data={projects}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <FormDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        title="Create Project"
        description="Create a new project."
      >
        <ProjectForm
          categories={categories}
          loading={creating}
          onSubmit={handleCreate}
        />
      </FormDialog>

      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title="Edit Project"
        description="Update project."
      >
        <ProjectForm
          categories={categories}
          defaultValues={
            selectedProject
              ? {
                  title:
                    selectedProject.title,
                  excerpt:
                    selectedProject.excerpt,
                  description:
                    selectedProject.description,
                  githubUrl:
                    selectedProject.githubUrl ??
                    "",
                  liveUrl:
                    selectedProject.liveUrl ??
                    "",
                  featured:
                    selectedProject.featured,
                  status:
                    selectedProject.status,
                  displayOrder:
                    selectedProject.displayOrder,
                  categoryId:
                    selectedProject.category.id,
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
        title="Delete Project"
        message={`Delete "${selectedProject?.title}"? This action cannot be undone.`}
        loading={deleting}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
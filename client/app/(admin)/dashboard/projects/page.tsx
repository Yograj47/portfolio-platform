"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/dashboard/page-header";

import { ProjectTable } from "@/components/admin/project/project-table";
import { ProjectForm } from "@/components/admin/project/project-form";

import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";

import { useProject } from "@/hooks/use-project";
import { useCategory } from "@/hooks/use-category";

import type {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/lib/validations/project";

import type { Project } from "@/components/admin/project/project-columns";
import { ProjectImageDialog } from "@/components/admin/project-media/project-image-dialog";

export default function ProjectsPage() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

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

  function handleCreate(data: CreateProjectSchema) {
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

  function handleImages(project: Project) {
    setSelectedProject(project);
    setImageOpen(true);
  }

  function handleUpdate(data: UpdateProjectSchema) {
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
    <div className="flex flex-1 flex-col min-h-0 h-full gap-4">
      {/* Page Header without redundant title */}
      <PageHeader
        description="Manage your portfolio projects."
        action={
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="cursor-pointer"
          >
            <Plus className="mr-2 size-4" />
            New Project
          </Button>
        }
      />

      {/* Bound Table Container to remaining height */}
      <div className="flex flex-1 flex-col min-h-0">
        <ProjectTable
          data={projects}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onImages={handleImages}
        />
      </div>

      {/* Dialogs */}
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
                title: selectedProject.title,
                excerpt: selectedProject.excerpt,
                description: selectedProject.description,
                githubUrl: selectedProject.githubUrl ?? "",
                liveUrl: selectedProject.liveUrl ?? "",
                featured: selectedProject.featured,
                status: selectedProject.status,
                displayOrder: selectedProject.displayOrder,
                categoryId: selectedProject.category.id,
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

      {selectedProject && (
        <ProjectImageDialog
          open={imageOpen}
          onOpenChange={setImageOpen}
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
        />
      )}
    </div>
  );
}
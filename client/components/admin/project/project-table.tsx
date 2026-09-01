"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import {
  Project,
  getProjectColumns,
} from "./project-columns";

interface ProjectTableProps {
  data: Project[];
  loading: boolean;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onImages: (project: Project) => void;
}

export function ProjectTable({
  data,
  loading,
  onEdit,
  onDelete,
  onImages,
}: ProjectTableProps) {
  const columns = useMemo(
    () =>
      getProjectColumns({
        onEdit,
        onDelete,
        onImages,
      }),
    [onEdit, onDelete, onImages]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyTitle="No projects"
      emptyDescription="Create your first project."
    />
  );
}
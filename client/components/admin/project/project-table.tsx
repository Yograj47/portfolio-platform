"use client";

import { useMemo } from "react";
import { OrderedDataTable } from "@/components/data-table/ordered-data-table";
import type { Project } from "@/types/portfolio";
import { getProjectColumns } from "./project-columns";

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
    [onEdit, onDelete, onImages],
  );

  return (
    <OrderedDataTable
      collection="projects"
      columns={columns}
      data={data}
      loading={loading}
      emptyTitle="No projects"
      emptyDescription="Create your first project."
    />
  );
}

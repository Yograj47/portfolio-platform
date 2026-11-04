"use client";

import { useMemo } from "react";
import { OrderedDataTable } from "@/components/data-table/ordered-data-table";
import type { Skill } from "@/types/portfolio";
import { getSkillColumns } from "./skill-columns";

interface SkillTableProps {
  data: Skill[];
  loading: boolean;

  onEdit: (skill: Skill) => void;
  onDelete: (skill: Skill) => void;
}

export function SkillTable({
  data,
  loading,
  onEdit,
  onDelete,
}: SkillTableProps) {
  const columns = useMemo(
    () =>
      getSkillColumns({
        onEdit,
        onDelete,
      }),
    [onEdit, onDelete],
  );

  return (
    <OrderedDataTable
      collection="skills"
      columns={columns}
      data={data}
      loading={loading}
      emptyTitle="No skills"
      emptyDescription="Create your first skill."
    />
  );
}

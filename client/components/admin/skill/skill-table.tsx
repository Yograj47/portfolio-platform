"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/data-table/data-table";
import {
  Skill,
  getSkillColumns,
} from "./skill-columns";

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
    [onEdit, onDelete]
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      emptyTitle="No skills"
      emptyDescription="Create your first skill."
    />
  );
}
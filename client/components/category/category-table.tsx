"use client";

import { useMemo } from "react";

import { DataTable } from "@/components/data-table/data-table";

import {
  Category,
  getCategoryColumns,
} from "./category-columns";

interface Props {
  data: Category[];
  loading: boolean;

  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryTable({
  data,
  loading,
  onEdit,
  onDelete,
}: Props) {
  const columns = useMemo(
    () =>
      getCategoryColumns({
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
    />
  );
}
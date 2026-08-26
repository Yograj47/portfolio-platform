"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  emptyTitle = "No data found",
  emptyDescription = "There is nothing to display.",
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (loading) {
    return <TableSkeleton />;
  }

  if (!table.getRowModel().rows.length) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
      />
    );
  }

  return (
    <div className="w-full min-w-0 overflow-hidden rounded-xl border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <Table className="w-full min-w-150">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-muted/40 hover:bg-muted/40">
                {headerGroup.headers.map((header) => {
                  const isActions = header.column.id === "actions";

                  return (
                    <TableHead
                      key={header.id}
                      className={
                        isActions
                          ? "w-14 text-right pr-4"
                          : "text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      }
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className="transition-colors hover:bg-muted/20"
              >
                {row.getVisibleCells().map((cell) => {
                  const isActions = cell.column.id === "actions";

                  return (
                    <TableCell
                      key={cell.id}
                      className={isActions ? "w-14 text-right pr-4" : "py-3 text-sm"}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
"use client";

import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  type Row,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { TableSkeleton } from "@/components/skeletons/table-skeleton";
import { EmptyState } from "@/components/feedback/empty-state";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  showSearch?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  renderExpandedRow?: (row: Row<TData>) => React.ReactNode;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  loading = false,
  emptyTitle = "No data found",
  emptyDescription = "There is nothing to display.",
  showSearch = true,
  searchValue = "",
  onSearchChange,
  searchPlaceholder = "Search records...",
  renderExpandedRow,
}: DataTableProps<TData, TValue>) {
  const [expanded, setExpanded] = useState({});

  const table = useReactTable({
    data,
    columns,
    state: { expanded },
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => !!renderExpandedRow,
  });

  if (loading) {
    return <TableSkeleton />;
  }

  return (
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-xs">
      {/* Top Search Toolbar */}
      {showSearch && (
        <div className="shrink-0 flex items-center justify-between border-b border-border/60 px-4 py-3 bg-card">
          <div className="relative w-full max-w-xs sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="h-9 w-full bg-muted/30 pl-9 text-xs transition-colors focus-visible:bg-background"
            />
          </div>
        </div>
      )}

      {/* Internal Scrollable Container */}
      <div className="flex-1 min-h-0 overflow-auto custom-scrollbar">
        {!table.getRowModel().rows.length ? (
          <div className="flex h-full items-center justify-center p-6">
            <EmptyState title={emptyTitle} description={emptyDescription} />
          </div>
        ) : (
          <Table className="w-full min-w-150 border-separate border-spacing-0">
            <TableHeader className="sticky top-0 z-20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="hover:bg-transparent border-none"
                >
                  {headerGroup.headers.map((header) => {
                    const isActions = header.column.id === "actions";

                    return (
                      <TableHead
                        key={header.id}
                        className={`sticky top-0 z-20 bg-muted/90 backdrop-blur-md border-b border-border/60 ${isActions
                            ? "w-14 text-right pr-4 font-semibold text-xs uppercase tracking-wider"
                            : "py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                          }`}
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
                <React.Fragment key={row.id}>
                  <TableRow
                    className="transition-colors hover:bg-muted/30 cursor-default"
                    onClick={() => renderExpandedRow && row.toggleExpanded()}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const isActions = cell.column.id === "actions";

                      return (
                        <TableCell
                          key={cell.id}
                          className={`border-b border-border/40 ${isActions ? "w-14 text-right pr-4" : "py-3 text-sm"
                            }`}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>

                  {/* Render Expanded Sub-Row if active */}
                  {row.getIsExpanded() && renderExpandedRow && (
                    <TableRow className="bg-muted/20">
                      <TableCell
                        colSpan={columns.length}
                        className="p-0 border-b border-border/60"
                      >
                        {renderExpandedRow(row)}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
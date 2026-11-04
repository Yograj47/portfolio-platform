"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { DataTable, type DataTableProps } from "./data-table";
import { TableRow } from "@/components/ui/table";
import http from "@/lib/http";
import { apiError } from "@/lib/api-error";
import { showError } from "@/lib/toast";

const DragHandleContext = createContext<
  | (Pick<
      ReturnType<typeof useSortable>,
      "attributes" | "listeners" | "setActivatorNodeRef"
    > & { disabled: boolean })
  | null
>(null);
function DragHandle() {
  const drag = useContext(DragHandleContext);
  return (
    <button
      type="button"
      ref={drag?.setActivatorNodeRef}
      {...drag?.attributes}
      {...drag?.listeners}
      aria-label="Drag to reorder"
      disabled={drag?.disabled}
      className="grid size-9 touch-none place-items-center rounded-md text-muted-foreground hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-30"
    >
      <GripVertical className="size-4" />
    </button>
  );
}
function SortableRow({
  id,
  disabled,
  children,
}: {
  id: string;
  disabled: boolean;
  children: ReactNode;
}) {
  const {
    attributes,
    listeners,
    setActivatorNodeRef,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });
  return (
    <DragHandleContext.Provider
      value={{ attributes, listeners, setActivatorNodeRef, disabled }}
    >
      <TableRow
        ref={setNodeRef}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
          opacity: isDragging ? 0.5 : 1,
        }}
        className="hover:bg-muted/30"
      >
        {children}
      </TableRow>
    </DragHandleContext.Provider>
  );
}

export function OrderedDataTable<TData extends { id: string }, TValue>({
  collection,
  data,
  columns,
  ...props
}: DataTableProps<TData, TValue> & {
  collection: "projects" | "skills" | "timeline";
}) {
  const id = useId();
  const cache = useQueryClient();
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState<TData[] | null>(null);
  const items = pending ?? data;
  const disabled = Boolean(search.trim() || pending);
  const filtered = items.filter((item) =>
    JSON.stringify(item).toLowerCase().includes(search.trim().toLowerCase()),
  );
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  async function reorder(event: DragEndEvent) {
    if (disabled || !event.over || event.active.id === event.over.id) return;
    const from = items.findIndex((item) => item.id === event.active.id);
    const to = items.findIndex((item) => item.id === event.over?.id);
    if (from < 0 || to < 0) return;
    const reordered = arrayMove(items, from, to);
    setPending(reordered);
    try {
      await http.patch(`/ordering/${collection}`, {
        ids: reordered.map((item) => item.id),
      });
    } catch (error) {
      showError(apiError(error, "Order could not be saved. Please try again."));
    } finally {
      await cache.invalidateQueries({
        queryKey: [collection === "timeline" ? "timelines" : collection],
      });
      void cache.invalidateQueries({ queryKey: ["portfolio-home-v2"] });
      void cache.invalidateQueries({ queryKey: ["dashboard-summary"] });
      setPending(null);
    }
  }
  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2">
      <p className="text-xs text-muted-foreground" role="status">
        {pending
          ? "Saving order…"
          : search.trim()
            ? "Clear search to reorder."
            : "Drag the handles to reorder. Changes save automatically."}
      </p>
      <DndContext
        id={id}
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => void reorder(event)}
      >
        <SortableContext
          items={filtered.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          <DataTable
            {...props}
            data={filtered}
            columns={[
              {
                id: "drag",
                header: () => <span className="sr-only">Reorder</span>,
                cell: () => <DragHandle />,
              },
              ...columns,
            ]}
            getRowId={(item) => item.id}
            searchValue={search}
            onSearchChange={setSearch}
            renderRow={(row, cells) => (
              <SortableRow id={row.id} disabled={disabled}>
                {cells}
              </SortableRow>
            )}
          />
        </SortableContext>
      </DndContext>
    </div>
  );
}

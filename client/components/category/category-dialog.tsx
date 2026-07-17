"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  CreateCategorySchema,
} from "@/lib/validations/category";

import { CategoryForm } from "./category-form";

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description: string;

  loading?: boolean;

  defaultValues?: Partial<CreateCategorySchema>;

  onSubmit: (data: CreateCategorySchema) => void;
}

export function CategoryDialog({
  open,
  onOpenChange,

  title,
  description,

  loading = false,

  defaultValues,

  onSubmit,
}: CategoryDialogProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>

          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>

        <CategoryForm
          defaultValues={defaultValues}
          loading={loading}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  );
}
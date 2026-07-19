"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";

import { CategoryTable } from "@/components/category/category-table";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";

import { useCategory } from "@/hooks/use-category";

import type {
    CreateCategorySchema,
    UpdateCategorySchema,
} from "@/lib/validations/category";

import type { Category } from "@/components/category/category-columns";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { CategoryForm } from "@/components/category/category-form";

export default function CategoriesPage() {
    const [createOpen, setCreateOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [selectedCategory, setSelectedCategory] =
        useState<Category | null>(null);

    const {
        categories,
        loading,

        createCategory,
        updateCategory,
        deleteCategory,

        creating,
        updating,
        deleting,
    } = useCategory();

    function handleCreate(data: CreateCategorySchema) {
        createCategory(data, {
            onSuccess: () => {
                setCreateOpen(false);
            },
        });
    }

    function handleEdit(category: Category) {
        setSelectedCategory(category);
        setEditOpen(true);
    }

    function handleDelete(category: Category) {
        setSelectedCategory(category);
        setDeleteOpen(true);
    }

    function handleUpdate(data: UpdateCategorySchema) {
        if (!selectedCategory) return;

        updateCategory(
            {
                id: selectedCategory.id,
                data,
            },
            {
                onSuccess: () => {
                    setEditOpen(false);
                    setSelectedCategory(null);
                },
            }
        );
    }

    function handleConfirmDelete() {
        if (!selectedCategory) return;

        deleteCategory(selectedCategory.id, {
            onSuccess: () => {
                setDeleteOpen(false);
                setSelectedCategory(null);
            },
        });
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">
                        Categories
                    </h1>

                    <p className="text-muted-foreground">
                        Manage your portfolio categories.
                    </p>
                </div>

                <Button onClick={() => setCreateOpen(true)}>
                    New Category
                </Button>
            </div>

            <CategoryTable
                data={categories}
                loading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <FormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                title="Create Category"
                description="Create a new category."
            >
                <CategoryForm
                    loading={creating}
                    onSubmit={handleCreate}
                />
            </FormDialog>

            <FormDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Category"
                description="Update category."
            >
                <CategoryForm
                    defaultValues={{
                        name: selectedCategory?.name ?? "",
                        description:
                            selectedCategory?.description ?? "",
                    }}
                    loading={updating}
                    onSubmit={(data) => {
                        if (!selectedCategory) return;

                        updateCategory(
                            {
                                id: selectedCategory.id,
                                data,
                            },
                            {
                                onSuccess: () => {
                                    setEditOpen(false);
                                    setSelectedCategory(null);
                                },
                            }
                        );
                    }}
                />
            </FormDialog>

            <ConfirmationDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title="Delete Category"
                message={`Delete "${selectedCategory?.name}"? This action cannot be undone.`}
                loading={deleting}
                onConfirm={handleConfirmDelete}
            />
        </div>
    );
}
"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/admin/dashboard/page-header";

import { CategoryTable } from "@/components/admin/category/category-table";
import { CategoryForm } from "@/components/admin/category/category-form";

import { FormDialog } from "@/components/dialogs/form-dialog";
import { ConfirmationDialog } from "@/components/dialogs/confirmation-dialog";

import { useCategory } from "@/hooks/use-category";

import type { CreateCategorySchema } from "@/lib/validations/category";
import type { Category } from "@/components/admin/category/category-columns";

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
        <div className="flex flex-1 flex-col min-h-0 h-full gap-4">
            {/* Page Header */}
            <PageHeader
                description="Manage your portfolio categories."
                action={
                    <Button
                        size="sm"
                        onClick={() => setCreateOpen(true)}
                        className="cursor-pointer"
                    >
                        <Plus className="mr-2 size-4" />
                        New Category
                    </Button>
                }
            />

            {/* Table Container bound to remaining viewport height */}
            <div className="flex flex-1 flex-col min-h-0">
                <CategoryTable
                    data={categories}
                    loading={loading}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* Dialogs */}
            <FormDialog
                open={createOpen}
                onOpenChange={setCreateOpen}
                title="Create Category"
                description="Create a new category."
            >
                <CategoryForm loading={creating} onSubmit={handleCreate} />
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
                        description: selectedCategory?.description ?? "",
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
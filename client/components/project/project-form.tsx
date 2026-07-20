"use client";

import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    createProjectSchema,
    CreateProjectSchema,
} from "@/lib/validations/project";

import { ProjectStatus } from "@/lib/enums/project";

import { FormFieldError } from "@/components/forms/form-field-error";
import { FormSubmitButton } from "@/components/forms/form-submit-button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PROJECT_STATUS_OPTIONS } from "@/lib/constants/project-status-options";

export interface CategoryOption {
    id: string;
    name: string;
}

interface ProjectFormProps {
    defaultValues?: Partial<CreateProjectSchema>;
    categories: CategoryOption[];
    loading?: boolean;

    onSubmit: (data: CreateProjectSchema) => void;
}

export function ProjectForm({
    defaultValues,
    categories,
    loading = false,
    onSubmit,
}: ProjectFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<CreateProjectSchema>({
        resolver: zodResolver(createProjectSchema) as Resolver<CreateProjectSchema>,
        defaultValues: {
            title: "",
            excerpt: "",
            description: "",
            githubUrl: "",
            liveUrl: "",
            featured: false,
            status: ProjectStatus.DRAFT,
            displayOrder: 0,
            categoryId: "",

            ...defaultValues,
        },
    });

    useEffect(() => {
        if (!defaultValues) return;

        reset({
            title: defaultValues.title ?? "",
            excerpt: defaultValues.excerpt ?? "",
            description: defaultValues.description ?? "",
            githubUrl: defaultValues.githubUrl ?? "",
            liveUrl: defaultValues.liveUrl ?? "",
            featured: defaultValues.featured ?? false,
            status:
                defaultValues.status ?? ProjectStatus.DRAFT,
            displayOrder:
                defaultValues.displayOrder ?? 0,
            categoryId:
                defaultValues.categoryId ?? "",
        });
    }, [defaultValues, reset]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="space-y-2">
                <Label>Title</Label>

                <Input
                    placeholder="Portfolio Website"
                    {...register("title")}
                />

                <FormFieldError
                    message={errors.title?.message}
                />
            </div>

            <div className="space-y-2">
                <Label>Excerpt</Label>

                <Textarea
                    rows={2}
                    placeholder="Short summary..."
                    {...register("excerpt")}
                />

                <FormFieldError
                    message={errors.excerpt?.message}
                />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>

                <Textarea
                    rows={6}
                    placeholder="Project description..."
                    {...register("description")}
                />

                <FormFieldError
                    message={errors.description?.message}
                />
            </div>

            <div className="space-y-2">
                <Label>Category</Label>

                <Select
                    value={watch("categoryId")}
                    onValueChange={(value) =>
                        setValue("categoryId", value ?? "category", {
                            shouldValidate: true,
                        })
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>

                    <SelectContent>
                        {categories.map((category) => (
                            <SelectItem
                                key={category.id}
                                value={category.id}
                            >
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <FormFieldError
                    message={errors.categoryId?.message}
                />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>GitHub URL</Label>

                    <Input
                        placeholder="https://github.com/..."
                        {...register("githubUrl")}
                    />

                    <FormFieldError
                        message={errors.githubUrl?.message}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Live URL</Label>

                    <Input
                        placeholder="https://..."
                        {...register("liveUrl")}
                    />

                    <FormFieldError
                        message={errors.liveUrl?.message}
                    />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>Status</Label>

                    <Select
                        value={watch("status")}
                        onValueChange={(value) =>
                            setValue(
                                "status",
                                value as ProjectStatus,
                                {
                                    shouldValidate: true,
                                }
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {PROJECT_STATUS_OPTIONS.map((status) => (
                                <SelectItem
                                    key={status.value}
                                    value={status.value}
                                >
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <FormFieldError
                        message={errors.status?.message}
                    />
                </div>

                <div className="space-y-2">
                    <Label>Display Order</Label>

                    <Input
                        type="number"
                        {...register("displayOrder", {
                            valueAsNumber: true,
                        })}
                    />

                    <FormFieldError
                        message={
                            errors.displayOrder?.message
                        }
                    />
                </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label>Featured</Label>

                    <p className="text-sm text-muted-foreground">
                        Show on homepage.
                    </p>
                </div>

                <Switch
                    checked={watch("featured")}
                    onCheckedChange={(checked) =>
                        setValue("featured", checked)
                    }
                />
            </div>

            <FormSubmitButton
                loading={loading}
                label="Save Project"
            />
        </form>
    );
}
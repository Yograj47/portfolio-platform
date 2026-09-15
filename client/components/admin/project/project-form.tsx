"use client";

import { useEffect, useMemo } from "react";
import { Controller, Resolver, useForm, useWatch } from "react-hook-form";
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
import { OrderPicker } from "@/components/forms/order-picker";
import { Project } from "./project-columns";

export interface CategoryOption {
    id: string;
    name: string;
}

interface ProjectFormProps {
    projects?: Project[];
    defaultValues?: Partial<CreateProjectSchema>;
    categories: CategoryOption[];
    loading?: boolean;
    onSubmit: (data: CreateProjectSchema) => void;
}

export function ProjectForm({
    projects = [],
    defaultValues,
    categories,
    loading = false,
    onSubmit,
}: ProjectFormProps) {
    const currentEditOrder =
        defaultValues?.displayOrder !== undefined
            ? Number(defaultValues.displayOrder)
            : null;

    const disabledOrders = useMemo(() => {
        return projects
            .map((item) => Number(item.displayOrder))
            .filter((order) => order !== currentEditOrder);
    }, [projects, currentEditOrder]);

    const defaultOrder = useMemo(() => {
        if (currentEditOrder !== null) return currentEditOrder;
        for (let i = 1; i <= 25; i++) {
            if (!disabledOrders.includes(i)) return i;
        }
        return 1;
    }, [currentEditOrder, disabledOrders]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        control,
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
            displayOrder: defaultOrder,
            categoryId: "",

            ...defaultValues,
        },
    });

    const categoryId = useWatch({ control, name: "categoryId" });
    const status = useWatch({ control, name: "status" });
    const featured = useWatch({ control, name: "featured" });

    useEffect(() => {
        if (!defaultValues) return;

        reset({
            title: defaultValues.title ?? "",
            excerpt: defaultValues.excerpt ?? "",
            description: defaultValues.description ?? "",
            githubUrl: defaultValues.githubUrl ?? "",
            liveUrl: defaultValues.liveUrl ?? "",
            featured: defaultValues.featured ?? false,
            status: defaultValues.status ?? ProjectStatus.DRAFT,
            displayOrder: Number(defaultValues.displayOrder ?? defaultOrder),
            categoryId: defaultValues.categoryId ?? "",
        });
    }, [defaultValues, defaultOrder, reset]);

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
                <FormFieldError message={errors.title?.message} />
            </div>

            <div className="space-y-2">
                <Label>Excerpt</Label>
                <Textarea
                    rows={2}
                    placeholder="Short summary..."
                    {...register("excerpt")}
                />
                <FormFieldError message={errors.excerpt?.message} />
            </div>

            <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                    rows={6}
                    placeholder="Project description..."
                    {...register("description")}
                />
                <FormFieldError message={errors.description?.message} />
            </div>

            <div className="space-y-2">
                <Label>Category</Label>
                <Select
                    value={categoryId}
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
                <FormFieldError message={errors.categoryId?.message} />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label>GitHub URL</Label>
                    <Input
                        placeholder="https://github.com/..."
                        {...register("githubUrl")}
                    />
                    <FormFieldError message={errors.githubUrl?.message} />
                </div>

                <div className="space-y-2">
                    <Label>Live URL</Label>
                    <Input
                        placeholder="https://..."
                        {...register("liveUrl")}
                    />
                    <FormFieldError message={errors.liveUrl?.message} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>Status</Label>
                <Select
                    value={status}
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
                        {PROJECT_STATUS_OPTIONS.map((statusOption) => (
                            <SelectItem
                                key={statusOption.value}
                                value={statusOption.value}
                            >
                                {statusOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormFieldError message={errors.status?.message} />
            </div>

            {/* Timeline Display Order taking full width */}
            <div className="space-y-2">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Timeline Display Order (1–25)
                </Label>
                <Controller
                    name="displayOrder"
                    control={control}
                    render={({ field }) => (
                        <OrderPicker
                            value={field.value}
                            onChange={field.onChange}
                            disabledOrders={disabledOrders}
                        />
                    )}
                />
                <FormFieldError message={errors.displayOrder?.message} />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                    <Label>Featured</Label>
                    <p className="text-sm text-muted-foreground">
                        Show on homepage.
                    </p>
                </div>

                <Switch
                    checked={featured}
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
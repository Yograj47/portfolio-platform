"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createCategorySchema,
  CreateCategorySchema,
} from "@/lib/validations/category";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";

import { Textarea } from "@/components/ui/textarea";

interface CategoryFormProps {
  defaultValues?: Partial<CreateCategorySchema>;
  loading?: boolean;

  onSubmit: (data: CreateCategorySchema) => void;
}

export function CategoryForm({
  defaultValues,
  loading = false,
  onSubmit,
}: CategoryFormProps) {
  const {
    register,
    handleSubmit,
    reset,

    formState: {
      errors,
    },
  } = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),

    defaultValues: {
      name: "",
      description: "",

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        name: defaultValues.name ?? "",
        description: defaultValues.description ?? "",
      });
    }
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="name">
          Name
        </Label>

        <Input
          id="name"
          placeholder="Frontend"
          {...register("name")}
        />

        {errors.name && (
          <p className="text-sm text-destructive">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">
          Description
        </Label>

        <Textarea
          id="description"
          rows={4}
          placeholder="Category description..."
          {...register("description")}
        />

        {errors.description && (
          <p className="text-sm text-destructive">
            {errors.description.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}
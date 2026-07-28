"use client";

import { useEffect } from "react";
import { Resolver, useForm, Controller } from "react-hook-form"; // 1. Import Controller
import { zodResolver } from "@hookform/resolvers/zod";
import { createSkillSchema, CreateSkillSchema } from "@/lib/validations/skill";
import { FormFieldError } from "@/components/forms/form-field-error";
import { FormSubmitButton } from "@/components/forms/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "../icon-picker/icon-picker";

interface SkillFormProps {
  defaultValues?: Partial<CreateSkillSchema>;
  loading?: boolean;
  onSubmit: (data: CreateSkillSchema) => void;
}

export function SkillForm({
  defaultValues,
  loading = false,
  onSubmit,
}: SkillFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control, // 3. Extract control from useForm
    formState: { errors },
  } = useForm<CreateSkillSchema>({
    resolver: zodResolver(createSkillSchema) as Resolver<CreateSkillSchema>,
    defaultValues: {
      name: "",
      icon: "",
      color: "",
      level: 0,
      displayOrder: 0,
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;
    reset({
      name: defaultValues.name ?? "",
      icon: defaultValues.icon ?? "",
      color: defaultValues.color ?? "",
      level: defaultValues.level ?? 0,
      displayOrder: defaultValues.displayOrder ?? 0,
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name Field */}
      <div className="space-y-2">
        <Label>Name</Label>
        <Input placeholder="React" {...register("name")} />
        <FormFieldError message={errors.name?.message} />
      </div>

      <div className="space-y-2">
        <Label>Icon</Label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconPicker
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <FormFieldError message={errors.icon?.message} />
      </div>

      {/* Color Field */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Color</Label>
          <Input type="color" {...register("color")} />
          <FormFieldError message={errors.color?.message} />
        </div>

        {/* Level Field */}
        <div className="space-y-2">
          <Label>Level</Label>
          <Input type="number" {...register("level", { valueAsNumber: true })} />
          <FormFieldError message={errors.level?.message} />
        </div>

        {/* Display Order Field */}
        <div className="space-y-2">
          <Label>Display Order</Label>
          <Input type="number" {...register("displayOrder", { valueAsNumber: true })} />
          <FormFieldError message={errors.displayOrder?.message} />
        </div>
      </div>

      <FormSubmitButton loading={loading} label="Save Skill" />
    </form>
  );
}   
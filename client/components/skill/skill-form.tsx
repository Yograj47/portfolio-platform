"use client";

import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createSkillSchema,
  CreateSkillSchema,
} from "@/lib/validations/skill";

import { FormFieldError } from "@/components/forms/form-field-error";
import { FormSubmitButton } from "@/components/forms/form-submit-button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
      displayOrder:
        defaultValues.displayOrder ?? 0,
    });
  }, [defaultValues, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
    >
      <div className="space-y-2">
        <Label>Name</Label>

        <Input
          placeholder="React"
          {...register("name")}
        />

        <FormFieldError
          message={errors.name?.message}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Icon</Label>

          <Input
            placeholder="SiReact"
            {...register("icon")}
          />

          <FormFieldError
            message={errors.icon?.message}
          />
        </div>

        <div className="space-y-2">
          <Label>Color</Label>

          <Input
            placeholder="#61DAFB"
            {...register("color")}
          />

          <FormFieldError
            message={errors.color?.message}
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Level</Label>

          <Input
            type="number"
            {...register("level", {
              valueAsNumber: true,
            })}
          />

          <FormFieldError
            message={errors.level?.message}
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
            message={errors.displayOrder?.message}
          />
        </div>
      </div>

      <FormSubmitButton
        loading={loading}
        label="Save Skill"
      />
    </form>
  );
}
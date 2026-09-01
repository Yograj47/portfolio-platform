"use client";

import { useEffect, useMemo } from "react";
import { Resolver, useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createSkillSchema, CreateSkillSchema } from "@/lib/validations/skill";
import { FormFieldError } from "@/components/forms/form-field-error";
import { FormSubmitButton } from "@/components/forms/form-submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IconPicker } from "../icon-picker/icon-picker";
import { OrderPicker } from "@/components/forms/order-picker";
import type { Skill } from "@/components/admin/skill/skill-columns";
import { Pipette } from "lucide-react";

interface SkillFormProps {
  skills?: Skill[];
  defaultValues?: Partial<CreateSkillSchema>;
  loading?: boolean;
  onSubmit: (data: CreateSkillSchema) => void;
}

const PRESET_COLORS = [
  "#61DAFB", "#68A063", "#3178C6", "#F0DB4F",
  "#E34F26", "#1572B6", "#000000", "#47A248",
  "#339933", "#007ACC", "#FF4081", "#764ABC"
];

export function SkillForm({
  skills = [],
  defaultValues,
  loading = false,
  onSubmit,
}: SkillFormProps) {
  const currentDisplayOrder = defaultValues?.displayOrder;

  const disabledOrders = useMemo(() => {
    return skills
      .map((skill) => skill.displayOrder)
      .filter((order) => order !== currentDisplayOrder);
  }, [skills, currentDisplayOrder]);

  const defaultOrder = useMemo(() => {
    if (currentDisplayOrder) return currentDisplayOrder;
    for (let i = 1; i <= 25; i++) {
      if (!disabledOrders.includes(i)) return i;
    }
    return 1;
  }, [currentDisplayOrder, disabledOrders]);
  
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<CreateSkillSchema>({
    resolver: zodResolver(createSkillSchema) as Resolver<CreateSkillSchema>,
    defaultValues: {
      name: "",
      icon: "",
      color: "#3b82f6",
      level: 60,
      displayOrder: defaultOrder,
      ...defaultValues,
    },
  });

  const levelValue = useWatch({ control, name: "level" }) ?? 0;
  const colorValue = useWatch({ control, name: "color" }) ?? "#3b82f6";

  useEffect(() => {
    if (!defaultValues) return;
    reset({
      name: defaultValues.name ?? "",
      icon: defaultValues.icon ?? "",
      color: defaultValues.color ?? "#3b82f6",
      level: defaultValues.level ?? 60,
      displayOrder: defaultValues.displayOrder ?? defaultOrder,
    });
  }, [defaultValues, defaultOrder, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Skill Name */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Skill Name
        </Label>
        <Input placeholder="e.g. React, Node.js" {...register("name")} />
        <FormFieldError message={errors.name?.message} />
      </div>

      {/* Icon Picker */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Icon
        </Label>
        <Controller
          name="icon"
          control={control}
          render={({ field }) => (
            <IconPicker value={field.value} onChange={field.onChange} />
          )}
        />
        <FormFieldError message={errors.icon?.message} />
      </div>

      {/* Hex Text Input & Color Selector */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Theme Color
        </Label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex flex-1 items-center">
            <div
              className="mr-3 size-5 shrink-0 border shadow-xs"
              style={{ backgroundColor: colorValue || "#3b82f6" }}
            />
            <Input
              type="text"
              placeholder="#3B82F6"
              className="pl-10 font-mono text-xs uppercase"
              {...register("color")}
            />
            <label className="absolute right-3 cursor-pointer text-muted-foreground hover:text-foreground">
              <Pipette className="size-4" />
              <input
                type="color"
                className="sr-only"
                value={colorValue || "#3b82f6"}
                onChange={(e) => setValue("color", e.target.value)}
              />
            </label>
          </div>

          {/* Color Presets */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg border bg-muted/20 p-1.5">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset}
                type="button"
                className="size-5 rounded-full border border-black/10 transition-transform hover:scale-110"
                style={{ backgroundColor: preset }}
                onClick={() => setValue("color", preset)}
              />
            ))}
          </div>
        </div>
        <FormFieldError message={errors.color?.message} />
      </div>

      {/* Volume Equalizer Slider */}
      <div className="space-y-3 rounded-xl border bg-card p-4 shadow-xs">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Proficiency Rating
          </Label>
          <span className="font-mono text-sm font-bold" style={{ color: colorValue }}>
            {levelValue}%
          </span>
        </div>

        <div className="flex gap-1.5 py-1">
          {Array.from({ length: 10 }).map((_, i) => {
            const stepPercent = (i + 1) * 10;
            const isActive = levelValue >= stepPercent;

            return (
              <button
                key={i}
                type="button"
                onClick={() => setValue("level", stepPercent)}
                className="h-7 flex-1 rounded-sm transition-all hover:opacity-80"
                style={{
                  backgroundColor: isActive
                    ? colorValue || "var(--primary)"
                    : "var(--muted)",
                }}
              />
            );
          })}
        </div>

        <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
          <span>10% Beginner</span>
          <span>50% Intermediate</span>
          <span>100% Master</span>
        </div>
        <FormFieldError message={errors.level?.message} />
      </div>

      {/* Wheel Order Position Calendar Picker */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Wheel Position Order (1–25)
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

      <div className="flex justify-end pt-2">
        <FormSubmitButton loading={loading} label="Save Skill" />
      </div>
    </form>
  );
}
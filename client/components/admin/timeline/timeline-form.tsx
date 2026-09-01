"use client";

import { useEffect, useMemo } from "react";
import { Resolver, useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTimelineSchema,
  CreateTimelineSchema,
} from "@/lib/validations/timeline";

import { TIMELINE_TYPE_OPTIONS } from "@/lib/constants/timeline-type-options";
import { FormFieldError } from "@/components/forms/form-field-error";
import { FormSubmitButton } from "@/components/forms/form-submit-button";
import { OrderPicker } from "@/components/forms/order-picker";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TimelineType } from "@/lib/enums/timeline";

export interface TimelineItem {
  id: string;
  title: string;
  organization: string;
  displayOrder: number;
}

interface TimelineFormProps {
  timelines?: TimelineItem[];
  defaultValues?: Partial<CreateTimelineSchema> & { id?: string };
  loading?: boolean;
  onSubmit: (data: CreateTimelineSchema) => void;
}

const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export function TimelineForm({
  timelines = [],
  defaultValues,
  loading = false,
  onSubmit,
}: TimelineFormProps) {
  // Extract active order for edit mode
  const currentEditOrder =
    defaultValues?.displayOrder !== undefined
      ? Number(defaultValues.displayOrder)
      : null;

  // Keep current item's order enabled during edit mode
  const disabledOrders = useMemo(() => {
    return timelines
      .map((item) => Number(item.displayOrder))
      .filter((order) => order !== currentEditOrder);
  }, [timelines, currentEditOrder]);

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
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateTimelineSchema>({
    resolver: zodResolver(createTimelineSchema) as Resolver<CreateTimelineSchema>,
    defaultValues: {
      title: defaultValues?.title ?? "",
      organization: defaultValues?.organization ?? "",
      location: defaultValues?.location ?? "",
      description: defaultValues?.description ?? "",
      type: defaultValues?.type ?? TimelineType.EXPERIENCE,
      startDate: formatDateForInput(defaultValues?.startDate),
      endDate: formatDateForInput(defaultValues?.endDate),
      current: defaultValues?.current ?? false,
      displayOrder: defaultOrder,
    },
  });

  const isCurrent = useWatch({
    control,
    name: "current",
  });

  // Force re-sync of form controls whenever edit target changes
  useEffect(() => {
    if (!defaultValues) return;

    reset({
      title: defaultValues.title ?? "",
      organization: defaultValues.organization ?? "",
      location: defaultValues.location ?? "",
      description: defaultValues.description ?? "",
      type: defaultValues.type ?? TimelineType.EXPERIENCE,
      startDate: formatDateForInput(defaultValues.startDate),
      endDate: formatDateForInput(defaultValues.endDate),
      current: defaultValues.current ?? false,
      displayOrder: Number(defaultValues.displayOrder ?? defaultOrder),
    });
  }, [defaultValues, defaultOrder, reset]);

  // Handle current toggle
  useEffect(() => {
    if (isCurrent) {
      setValue("endDate", "", { shouldValidate: false });
      clearErrors("endDate");
    }
  }, [isCurrent, setValue, clearErrors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Title
        </Label>
        <Input placeholder="e.g. Frontend Developer" {...register("title")} />
        <FormFieldError message={errors.title?.message} />
      </div>

      {/* Organization & Location */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Organization
          </Label>
          <Input placeholder="e.g. OpenAI" {...register("organization")} />
          <FormFieldError message={errors.organization?.message} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Location
          </Label>
          <Input placeholder="e.g. Kathmandu, Nepal" {...register("location")} />
          <FormFieldError message={errors.location?.message} />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Description
        </Label>
        <Textarea
          rows={4}
          placeholder="Describe key responsibilities and achievements..."
          className="resize-none"
          {...register("description")}
        />
        <FormFieldError message={errors.description?.message} />
      </div>

      {/* Category Type */}
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category Type
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TIMELINE_TYPE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        <FormFieldError message={errors.type?.message} />
      </div>

      {/* Dates Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Start Date
          </Label>
          <Input type="date" {...register("startDate")} />
          <FormFieldError message={errors.startDate?.message} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            End Date
          </Label>
          <Input
            type="date"
            disabled={isCurrent}
            {...register("endDate")}
          />
          <FormFieldError message={errors.endDate?.message} />
        </div>
      </div>

      {/* Current Checkbox Switch Card */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Currently Working Here</Label>
          <p className="text-xs text-muted-foreground">
            Ongoing position or active experience
          </p>
        </div>
        <Controller
          name="current"
          control={control}
          render={({ field }) => (
            <Switch
              checked={field.value}
              onCheckedChange={(checked) => {
                field.onChange(checked);
                if (checked) {
                  setValue("endDate", "");
                  clearErrors("endDate");
                }
              }}
            />
          )}
        />
      </div>

      {/* Order Picker */}
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

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <FormSubmitButton loading={loading} label="Save Timeline" />
      </div>
    </form>
  );
}
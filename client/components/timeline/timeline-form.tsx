"use client";

import { useEffect } from "react";
import { Resolver, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  createTimelineSchema,
  CreateTimelineSchema,
} from "@/lib/validations/timeline";

import { TIMELINE_TYPE_OPTIONS } from "@/lib/constants/timeline-type-options";

import { FormFieldError } from "@/components/forms/form-field-error";
import { FormSubmitButton } from "@/components/forms/form-submit-button";

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

interface TimelineFormProps {
  defaultValues?: Partial<CreateTimelineSchema>;
  loading?: boolean;

  onSubmit: (data: CreateTimelineSchema) => void;
}

export function TimelineForm({
  defaultValues,
  loading = false,
  onSubmit,
}: TimelineFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,

    formState: {
      errors,
    },
  } = useForm<CreateTimelineSchema>({
    resolver: zodResolver(createTimelineSchema) as Resolver<CreateTimelineSchema>,

    defaultValues: {
      title: "",
      organization: "",
      location: "",
      description: "",
      type: TimelineType.EXPERIENCE,
      startDate: "",
      endDate: "",
      current: false,
      displayOrder: 0,

      ...defaultValues,
    },
  });

  useEffect(() => {
    if (!defaultValues) return;

    reset({
      title: defaultValues.title ?? "",
      organization:
        defaultValues.organization ?? "",
      location: defaultValues.location ?? "",
      description:
        defaultValues.description ?? "",
      type:
        defaultValues.type ??
        TimelineType.EXPERIENCE,
      startDate:
        defaultValues.startDate ?? "",
      endDate: defaultValues.endDate ?? "",
      current: defaultValues.current ?? false,
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
        <Label>Title</Label>

        <Input
          placeholder="Frontend Developer"
          {...register("title")}
        />

        <FormFieldError
          message={errors.title?.message}
        />
      </div>

      <div className="space-y-2">
        <Label>Organization</Label>

        <Input
          placeholder="OpenAI"
          {...register("organization")}
        />

        <FormFieldError
          message={errors.organization?.message}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>

        <Input
          placeholder="Kathmandu, Nepal"
          {...register("location")}
        />

        <FormFieldError
          message={errors.location?.message}
        />
      </div>

      <div className="space-y-2">
        <Label>Description</Label>

        <Textarea
          rows={5}
          placeholder="Describe this experience..."
          {...register("description")}
        />

        <FormFieldError
          message={errors.description?.message}
        />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>

        <Select
          value={watch("type")}
          onValueChange={(value) =>
            setValue(
              "type",
              value as TimelineType,
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
            {TIMELINE_TYPE_OPTIONS.map(
              (option) => (
                <SelectItem
                  key={option.value}
                  value={option.value}
                >
                  {option.label}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>

        <FormFieldError
          message={errors.type?.message}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Start Date</Label>

          <Input
            type="date"
            {...register("startDate")}
          />

          <FormFieldError
            message={errors.startDate?.message}
          />
        </div>

        <div className="space-y-2">
          <Label>End Date</Label>

          <Input
            type="date"
            disabled={watch("current")}
            {...register("endDate")}
          />

          <FormFieldError
            message={errors.endDate?.message}
          />
        </div>
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label>Current</Label>

          <p className="text-sm text-muted-foreground">
            Still ongoing
          </p>
        </div>

        <Switch
          checked={watch("current")}
          onCheckedChange={(checked) =>
            setValue("current", checked)
          }
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

      <FormSubmitButton
        loading={loading}
        label="Save Timeline"
      />
    </form>
  );
}
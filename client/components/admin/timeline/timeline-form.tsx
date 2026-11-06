"use client";

import { useEffect } from "react";
import { Resolver, useForm, Controller, useWatch } from "react-hook-form";
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
  defaultValues?: Partial<CreateTimelineSchema> & { id?: string };
  loading?: boolean;
  onSubmit: (data: CreateTimelineSchema) => void;
}

const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return "";
  return dateString.split("T")[0];
};

export function TimelineForm({
  defaultValues,
  loading = false,
  onSubmit,
}: TimelineFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CreateTimelineSchema>({
    resolver: zodResolver(
      createTimelineSchema,
    ) as Resolver<CreateTimelineSchema>,
    defaultValues: {
      title: defaultValues?.title ?? "",
      credentialId: defaultValues?.credentialId ?? "",
      credentialUrl: defaultValues?.credentialUrl ?? "",
      expiresAt: formatDateForInput(defaultValues?.expiresAt),
      organization: defaultValues?.organization ?? "",
      location: defaultValues?.location ?? "",
      description: defaultValues?.description ?? "",
      type: defaultValues?.type ?? TimelineType.EXPERIENCE,
      startDate: formatDateForInput(defaultValues?.startDate),
      endDate: formatDateForInput(defaultValues?.endDate),
      current: defaultValues?.current ?? false,
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
      credentialId: defaultValues.credentialId ?? "",
      credentialUrl: defaultValues.credentialUrl ?? "",
      expiresAt: formatDateForInput(defaultValues.expiresAt),
      organization: defaultValues.organization ?? "",
      location: defaultValues.location ?? "",
      description: defaultValues.description ?? "",
      type: defaultValues.type ?? TimelineType.EXPERIENCE,
      startDate: formatDateForInput(defaultValues.startDate),
      endDate: formatDateForInput(defaultValues.endDate),
      current: defaultValues.current ?? false,
    });
  }, [defaultValues, reset]);

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
          <Input
            placeholder="e.g. Kathmandu, Nepal"
            {...register("location")}
          />
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
            Start Date {isCurrent ? "(required)" : "(optional with end date)"}
          </Label>
          <Input type="date" {...register("startDate")} />
          <FormFieldError message={errors.startDate?.message} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            End Date
          </Label>
          <Input type="date" disabled={isCurrent} {...register("endDate")} />
          <FormFieldError message={errors.endDate?.message} />
        </div>
      </div>

      {/* Current Checkbox Switch Card */}
      <div className="flex items-center justify-between rounded-xl border bg-card p-4 shadow-xs">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Ongoing entry</Label>
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

      <section className="space-y-4 rounded-xl border p-4">
        <h3 className="font-medium">Credential details</h3>
        <p className="text-xs text-muted-foreground">
          Optional verification details for training and certificates.
        </p>
        <div className="space-y-2">
          <Label htmlFor="credential-id">Credential ID</Label>
          <Input id="credential-id" {...register("credentialId")} />
          <FormFieldError message={errors.credentialId?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credential-url">Verification URL</Label>
          <Input
            id="credential-url"
            placeholder="https://www.credly.com/badges/…"
            {...register("credentialUrl")}
          />
          <FormFieldError message={errors.credentialUrl?.message} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="credential-expiry">Expires on</Label>
          <Input
            id="credential-expiry"
            type="date"
            {...register("expiresAt")}
          />
          <FormFieldError message={errors.expiresAt?.message} />
        </div>
      </section>

      {/* Action Footer */}
      <div className="flex justify-end pt-2">
        <FormSubmitButton loading={loading} label="Save Timeline" />
      </div>
    </form>
  );
}

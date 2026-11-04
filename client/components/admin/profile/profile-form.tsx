"use client";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, type ProfileSchema } from "@/lib/validations/profile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FormSubmitButton } from "@/components/forms/form-submit-button";
import { FormFieldError } from "@/components/forms/form-field-error";
import { MediaField } from "../media/media-field";

export function ProfileForm({
  defaultValues,
  loading = false,
  onSubmit,
}: {
  defaultValues?: Partial<ProfileSchema>;
  loading?: boolean;
  onSubmit: (data: ProfileSchema) => void;
}) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
      avatar: null,
      avatarMediaId: null,
      resumeMediaId: null,
      role: "",
      summary: "",
      phone: "",
      location: "",
      isAvailable: true,
      openToFullTime: false,
      openToOpenSource: false,
      openToFreelance: false,
      githubUrl: "",
      linkedinUrl: "",
      resumeUrl: "",
      ...defaultValues,
    },
  });
  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      <fieldset disabled={loading} className="space-y-6">
        <section className="space-y-4">
          <div>
            <h3 className="font-semibold">Public profile</h3>
            <p className="text-sm text-muted-foreground">
              The introduction and contact details shown on your portfolio.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              ["name", "Name", "Yograj Rijal"],
              ["email", "Email", "hello@example.com"],
              ["role", "Professional title", "Full-Stack Developer"],
              ["location", "Location", "Kathmandu, Nepal"],
              ["phone", "Phone", "+977…"],
            ].map(([key, label, placeholder]) => {
              const name = key as
                | "name"
                | "email"
                | "role"
                | "location"
                | "phone";
              return (
                <div key={key} className="space-y-2">
                  <Label htmlFor={`profile-${key}`}>{label}</Label>
                  <Input
                    id={`profile-${key}`}
                    type={
                      key === "email"
                        ? "email"
                        : key === "phone"
                          ? "tel"
                          : "text"
                    }
                    placeholder={placeholder}
                    {...register(name)}
                  />
                  <FormFieldError message={errors[name]?.message} />
                </div>
              );
            })}
          </div>
          <div className="space-y-2">
            <Label htmlFor="profile-summary">Professional summary</Label>
            <Textarea
              id="profile-summary"
              rows={5}
              maxLength={3000}
              {...register("summary")}
            />
            <FormFieldError message={errors.summary?.message} />
          </div>
        </section>
        <section className="space-y-4 border-t pt-6">
          <h3 className="font-semibold">Profile image</h3>
          <Controller
            name="avatar"
            control={control}
            render={({ field }) => (
              <MediaField
                value={field.value}
                disabled={loading}
                folder="/portfolio/avatars"
                alt="Profile image"
                onChange={(media) => {
                  field.onChange(media?.url ?? null);
                  setValue("avatarMediaId", media?.id ?? null, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />
          <FormFieldError message={errors.avatar?.message} />
        </section>
        <section className="space-y-4 border-t pt-6">
          <h3 className="font-semibold">Resume</h3>
          <Controller
            name="resumeUrl"
            control={control}
            render={({ field }) => (
              <MediaField
                type="DOCUMENT"
                value={field.value}
                disabled={loading}
                folder="/portfolio/resumes"
                onChange={(media) => {
                  field.onChange(media?.url ?? "");
                  setValue("resumeMediaId", media?.id ?? null, {
                    shouldDirty: true,
                  });
                }}
              />
            )}
          />
          <Controller
            name="resumeUrl"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="profile-resume">
                  Or use an external resume URL
                </Label>
                <Input
                  id="profile-resume"
                  value={field.value ?? ""}
                  placeholder="https://…"
                  onChange={(event) => {
                    field.onChange(event.target.value);
                    setValue("resumeMediaId", null, { shouldDirty: true });
                  }}
                />
              </div>
            )}
          />
          <FormFieldError message={errors.resumeUrl?.message} />
        </section>
        <section className="space-y-4 border-t pt-6">
          <h3 className="font-semibold">Links</h3>
          {[
            ["githubUrl", "GitHub"],
            ["linkedinUrl", "LinkedIn"],
          ].map(([key, label]) => {
            const name = key as "githubUrl" | "linkedinUrl";
            return (
              <div key={key} className="space-y-2">
                <Label htmlFor={`profile-${key}`}>{label}</Label>
                <Input
                  id={`profile-${key}`}
                  placeholder="https://…"
                  {...register(name)}
                />
                <FormFieldError message={errors[name]?.message} />
              </div>
            );
          })}
        </section>
        <section className="space-y-3 border-t pt-6">
          <h3 className="font-semibold">Availability</h3>
          {[
            ["isAvailable", "Available for opportunities"],
            ["openToFullTime", "Full-time roles"],
            ["openToOpenSource", "Open-source collaboration"],
            ["openToFreelance", "Freelance projects"],
          ].map(([key, label]) => (
            <Controller
              key={key}
              name={
                key as
                  | "isAvailable"
                  | "openToFullTime"
                  | "openToOpenSource"
                  | "openToFreelance"
              }
              control={control}
              render={({ field }) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border p-4">
                  <Label htmlFor={`profile-${key}`}>{label}</Label>
                  <Switch
                    id={`profile-${key}`}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
              )}
            />
          ))}
        </section>
      </fieldset>
      <FormSubmitButton loading={loading} label="Save profile" />
    </form>
  );
}

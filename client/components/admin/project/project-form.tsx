"use client";

import { useEffect, useState } from "react";
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
import { useSkill } from "@/hooks/use-skill";

function TechnologiesInput({
  values,
  onChange,
}: {
  values?: string[];
  onChange: (values: string[]) => void;
}) {
  const [text, setText] = useState(values?.join(", ") ?? "");
  return (
    <Input
      id="project-technologies"
      placeholder="React, TypeScript, PostgreSQL"
      value={text}
      onChange={(event) => {
        setText(event.target.value);
        onChange([
          ...new Set(
            event.target.value
              .split(",")
              .map((value) => value.trim())
              .filter(Boolean),
          ),
        ]);
      }}
    />
  );
}

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
  const { skills: availableSkills, error: skillError } = useSkill();
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
      categoryId: "",
      technologies: [],
      skills: [],

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
      categoryId: defaultValues.categoryId ?? "",
      technologies: defaultValues.technologies ?? [],
      skills: defaultValues.skills ?? [],
    });
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label>Title</Label>
        <Input placeholder="Portfolio Website" {...register("title")} />
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
              <SelectItem key={category.id} value={category.id}>
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
          <Input placeholder="https://..." {...register("liveUrl")} />
          <FormFieldError message={errors.liveUrl?.message} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Status</Label>
        <Select
          value={status}
          onValueChange={(value) =>
            setValue("status", value as ProjectStatus, {
              shouldValidate: true,
            })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {PROJECT_STATUS_OPTIONS.map((statusOption) => (
              <SelectItem key={statusOption.value} value={statusOption.value}>
                {statusOption.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <FormFieldError message={errors.status?.message} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="project-technologies">Technologies</Label>
        <Controller
          name="technologies"
          control={control}
          render={({ field }) => (
            <TechnologiesInput
              key={defaultValues?.title ?? "new-project"}
              values={field.value}
              onChange={field.onChange}
            />
          )}
        />
        <p className="text-xs text-muted-foreground">
          Separate technology names with commas.
        </p>
        <FormFieldError message={errors.technologies?.message} />
      </div>
      <div className="space-y-3">
        <Label>Related skills</Label>
        <p className="text-xs text-muted-foreground">
          Connect this project to your skills and describe how each was used.
        </p>
        {skillError && (
          <p role="alert" className="text-sm text-destructive">
            Skills could not be loaded. Existing associations will be preserved.
          </p>
        )}
        <Controller
          name="skills"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              {availableSkills.map((skill) => {
                const selected = field.value?.find(
                  (item) => item.skillId === skill.id,
                );
                return (
                  <div key={skill.id} className="rounded-lg border p-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={Boolean(selected)}
                        disabled={loading}
                        onChange={(e) =>
                          field.onChange(
                            e.target.checked
                              ? [
                                  ...(field.value ?? []),
                                  { skillId: skill.id, usageNote: "" },
                                ]
                              : field.value?.filter(
                                  (item) => item.skillId !== skill.id,
                                ),
                          )
                        }
                      />
                      {skill.name}
                    </label>
                    {selected && (
                      <Input
                        className="mt-2"
                        aria-label={`How ${skill.name} was used`}
                        placeholder="How was this skill used?"
                        maxLength={500}
                        value={selected.usageNote ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            field.value?.map((item) =>
                              item.skillId === skill.id
                                ? { ...item, usageNote: e.target.value }
                                : item,
                            ),
                          )
                        }
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>

      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label>Featured</Label>
          <p className="text-sm text-muted-foreground">Show on homepage.</p>
        </div>

        <Switch
          checked={featured}
          onCheckedChange={(checked) => setValue("featured", checked)}
        />
      </div>

      <FormSubmitButton loading={loading} label="Save Project" />
    </form>
  );
}

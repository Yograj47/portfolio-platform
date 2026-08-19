"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    profileSchema,
    ProfileSchema,
} from "@/lib/validations/profile";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { FormSubmitButton } from "@/components/forms/form-submit-button";
import { FormFieldError } from "@/components/forms/form-field-error";

interface ProfileFormProps {
    defaultValues?: Partial<ProfileSchema>;
    loading?: boolean;

    onSubmit: (data: ProfileSchema) => void;
}

export function ProfileForm({
    defaultValues,
    loading = false,
    onSubmit,
}: ProfileFormProps) {
    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),

        defaultValues: {
            name: "",
            email: "",
            avatar: "",
            role: "",
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
        if (defaultValues) {
            reset({
                name: defaultValues.name ?? "",
                email: defaultValues.email ?? "",
                avatar: defaultValues.avatar ?? "",
                role: defaultValues.role ?? "",
                location: defaultValues.location ?? "",

                isAvailable:
                    defaultValues.isAvailable ?? true,

                openToFullTime:
                    defaultValues.openToFullTime ?? false,

                openToOpenSource:
                    defaultValues.openToOpenSource ?? false,

                openToFreelance:
                    defaultValues.openToFreelance ?? false,

                githubUrl:
                    defaultValues.githubUrl ?? "",

                linkedinUrl:
                    defaultValues.linkedinUrl ?? "",

                resumeUrl:
                    defaultValues.resumeUrl ?? "",
            });
        }
    }, [defaultValues, reset]);

    const isAvailable = watch("isAvailable");
    const openToFullTime = watch("openToFullTime");
    const openToOpenSource = watch("openToOpenSource");
    const openToFreelance = watch("openToFreelance");

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
        >
            {/* Basic Information */}

            <section className="space-y-4">
                <div>
                    <h3 className="font-medium">
                        Basic Information
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Public profile information displayed across
                        the portfolio.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name
                        </Label>

                        <Input
                            id="name"
                            placeholder="Yograj Rijal"
                            {...register("name")}
                        />

                        {errors.name && (
                            <FormFieldError
                                message={errors.name.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">
                            Email
                        </Label>

                        <Input
                            id="email"
                            type="email"
                            placeholder="hello@example.com"
                            {...register("email")}
                        />

                        {errors.email && (
                            <FormFieldError
                                message={errors.email.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">
                            Role
                        </Label>

                        <Input
                            id="role"
                            placeholder="Full-Stack Developer"
                            {...register("role")}
                        />

                        {errors.role && (
                            <FormFieldError
                                message={errors.role.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">
                            Location
                        </Label>

                        <Input
                            id="location"
                            placeholder="Nepal"
                            {...register("location")}
                        />

                        {errors.location && (
                            <FormFieldError
                                message={errors.location.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="avatar">
                            Avatar URL
                        </Label>

                        <Input
                            id="avatar"
                            placeholder="https://..."
                            {...register("avatar")}
                        />

                        {errors.avatar && (
                            <FormFieldError
                                message={errors.avatar.message}
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Availability */}

            <section className="space-y-4">
                <div>
                    <h3 className="font-medium">
                        Availability
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Control how your availability appears in
                        Contact.sh.
                    </p>
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>
                                Available
                            </Label>

                            <p className="text-sm text-muted-foreground">
                                Show your profile as currently available.
                            </p>
                        </div>

                        <Switch
                            checked={isAvailable}
                            onCheckedChange={(value) =>
                                setValue(
                                    "isAvailable",
                                    value,
                                    {
                                        shouldDirty: true,
                                    }
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>
                                Full-time opportunities
                            </Label>

                            <p className="text-sm text-muted-foreground">
                                Open to full-time roles.
                            </p>
                        </div>

                        <Switch
                            checked={openToFullTime}
                            onCheckedChange={(value) =>
                                setValue(
                                    "openToFullTime",
                                    value,
                                    {
                                        shouldDirty: true,
                                    }
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>
                                Open-source collaboration
                            </Label>

                            <p className="text-sm text-muted-foreground">
                                Open to open-source collaboration.
                            </p>
                        </div>

                        <Switch
                            checked={openToOpenSource}
                            onCheckedChange={(value) =>
                                setValue(
                                    "openToOpenSource",
                                    value,
                                    {
                                        shouldDirty: true,
                                    }
                                )
                            }
                        />
                    </div>

                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                            <Label>
                                Freelance projects
                            </Label>

                            <p className="text-sm text-muted-foreground">
                                Open to freelance opportunities.
                            </p>
                        </div>

                        <Switch
                            checked={openToFreelance}
                            onCheckedChange={(value) =>
                                setValue(
                                    "openToFreelance",
                                    value,
                                    {
                                        shouldDirty: true,
                                    }
                                )
                            }
                        />
                    </div>
                </div>
            </section>

            {/* Communication */}

            <section className="space-y-4">
                <div>
                    <h3 className="font-medium">
                        Communication
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Links displayed by the public contact module.
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="githubUrl">
                            GitHub
                        </Label>

                        <Input
                            id="githubUrl"
                            placeholder="https://github.com/username"
                            {...register("githubUrl")}
                        />

                        {errors.githubUrl && (
                            <FormFieldError
                                message={errors.githubUrl.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="linkedinUrl">
                            LinkedIn
                        </Label>

                        <Input
                            id="linkedinUrl"
                            placeholder="https://linkedin.com/in/username"
                            {...register("linkedinUrl")}
                        />

                        {errors.linkedinUrl && (
                            <FormFieldError
                                message={errors.linkedinUrl.message}
                            />
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="resumeUrl">
                            Resume
                        </Label>

                        <Input
                            id="resumeUrl"
                            placeholder="https://..."
                            {...register("resumeUrl")}
                        />

                        {errors.resumeUrl && (
                            <FormFieldError
                                message={errors.resumeUrl.message}
                            />
                        )}
                    </div>
                </div>
            </section>

            <FormSubmitButton
                loading={loading}
                label="Save Profile"
            />
        </form>
    );
}
"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormDialog } from "@/components/dialogs/form-dialog";
import { ProfileForm } from "@/components/admin/profile/profile-form";
import { ProfileSummary } from "@/components/admin/profile/profile-summary";

import { useAuth } from "@/hooks/use-auth";

import type { ProfileSchema } from "@/lib/validations/profile";

export default function ProfilePage() {
    const [editOpen, setEditOpen] = useState(false);

    const { user, updateProfile, updateProfileLoading } = useAuth();

    if (!user) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <p className="text-sm text-muted-foreground">Loading profile...</p>
            </div>
        );
    }

    // Normalize avatar to string URL if returned as object
    const avatarUrl =
        typeof user.avatar === "string"
            ? user.avatar
            : user.avatar && typeof user.avatar === "object" && "url" in user.avatar
                ? (user.avatar as { url: string }).url
                : null;

    const profile: ProfileSchema = {
        name: user.name ?? "",
        email: user.email ?? "",
        avatar: avatarUrl,

        role: user.role ?? "",
        location: user.location ?? "",

        isAvailable: user.isAvailable ?? true,
        openToFullTime: user.openToFullTime ?? false,
        openToOpenSource: user.openToOpenSource ?? false,
        openToFreelance: user.openToFreelance ?? false,

        githubUrl: user.githubUrl ?? "",
        linkedinUrl: user.linkedinUrl ?? "",
        resumeUrl: user.resumeUrl ?? "",
    };

    function handleUpdate(data: ProfileSchema) {
        updateProfile(data, {
            onSuccess: () => {
                setEditOpen(false);
            },
        });
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Profile</h1>
                    <p className="text-muted-foreground">
                        Manage the information displayed on your public portfolio.
                    </p>
                </div>

                <Button onClick={() => setEditOpen(true)}>
                    <Pencil className="mr-2 size-4" />
                    Edit Profile
                </Button>
            </div>

            {/* Profile Summary */}
            <div className="rounded-lg border bg-background p-6">
                <ProfileSummary profile={profile} />
            </div>

            {/* Edit Dialog */}
            <FormDialog
                open={editOpen}
                onOpenChange={setEditOpen}
                title="Edit Profile"
                description="Update the information displayed on your public portfolio."
            >
                <ProfileForm
                    defaultValues={profile}
                    loading={updateProfileLoading}
                    onSubmit={handleUpdate}
                />
            </FormDialog>
        </div>
    );
}
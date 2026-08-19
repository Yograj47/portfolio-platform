"use client";

import {
    CheckCircle2,
    MapPin,
    Mail,
    FileText,
    Briefcase,
    Code2,
} from "lucide-react";
import {
    FaGithub,
    FaLinkedin,
} from "react-icons/fa";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import type { ProfileSchema } from "@/lib/validations/profile";

interface ProfileSummaryProps {
    profile: ProfileSchema;
}

export function ProfileSummary({
    profile,
}: ProfileSummaryProps) {
    return (
        <div className="space-y-8">
            {/* Profile Header */}

            <section className="flex flex-col gap-5 sm:flex-row sm:items-center">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border bg-muted">
                    {profile.avatar ? (
                        <img
                            src={profile.avatar}
                            alt={profile.name}
                            className="size-full object-cover"
                        />
                    ) : (
                        <span className="font-mono text-2xl font-semibold text-muted-foreground">
                            {profile.name
                                .charAt(0)
                                .toUpperCase()}
                        </span>
                    )}
                </div>

                <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-2xl font-semibold">
                            {profile.name}
                        </h2>

                        <Badge
                            variant={
                                profile.isAvailable
                                    ? "default"
                                    : "secondary"
                            }
                        >
                            <span
                                className={
                                    profile.isAvailable
                                        ? "mr-1.5 size-1.5 rounded-full bg-emerald-500"
                                        : "mr-1.5 size-1.5 rounded-full bg-muted-foreground"
                                }
                            />

                            {profile.isAvailable
                                ? "Available"
                                : "Unavailable"}
                        </Badge>
                    </div>

                    {profile.role && (
                        <p className="text-muted-foreground">
                            {profile.role}
                        </p>
                    )}

                    {profile.location && (
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <MapPin className="size-4" />
                            <span>{profile.location}</span>
                        </div>
                    )}
                </div>
            </section>

            <Separator />

            {/* Contact */}

            <section className="space-y-4">
                <div>
                    <h3 className="font-medium">
                        Communication
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Contact information used by the public portfolio.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                    <ProfileLink
                        icon={Mail}
                        label="Email"
                        value={profile.email}
                    />

                    {profile.githubUrl && (
                        <ProfileLink
                            icon={FaGithub}
                            label="GitHub"
                            value={profile.githubUrl}
                            href={profile.githubUrl}
                        />
                    )}

                    {profile.linkedinUrl && (
                        <ProfileLink
                            icon={FaLinkedin}
                            label="LinkedIn"
                            value={profile.linkedinUrl}
                            href={profile.linkedinUrl}
                        />
                    )}

                    {profile.resumeUrl && (
                        <ProfileLink
                            icon={FileText}
                            label="Resume"
                            value={profile.resumeUrl}
                            href={profile.resumeUrl}
                        />
                    )}
                </div>
            </section>

            {/* Availability */}

            <section className="space-y-4">
                <div>
                    <h3 className="font-medium">
                        Availability
                    </h3>

                    <p className="text-sm text-muted-foreground">
                        Current opportunity preferences.
                    </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                    <AvailabilityItem
                        icon={Briefcase}
                        label="Full-time"
                        active={profile.openToFullTime}
                    />

                    <AvailabilityItem
                        icon={Code2}
                        label="Open source"
                        active={profile.openToOpenSource}
                    />

                    <AvailabilityItem
                        icon={Briefcase}
                        label="Freelance"
                        active={profile.openToFreelance}
                    />
                </div>
            </section>
        </div>
    );
}

interface ProfileLinkProps {
    icon: React.ComponentType<{
        className?: string;
    }>;

    label: string;
    value: string;
    href?: string;
}

function ProfileLink({
    icon: Icon,
    label,
    value,
    href,
}: ProfileLinkProps) {
    const content = (
        <>
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-medium">
                    {label}
                </p>

                <p className="truncate text-sm text-muted-foreground">
                    {value}
                </p>
            </div>
        </>
    );

    if (href) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-w-0 items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
                {content}
            </a>
        );
    }

    return (
        <div className="flex min-w-0 items-center gap-3 rounded-lg border p-3">
            {content}
        </div>
    );
}

interface AvailabilityItemProps {
    icon: React.ComponentType<{
        className?: string;
    }>;

    label: string;
    active: boolean;
}

function AvailabilityItem({
    icon: Icon,
    label,
    active,
}: AvailabilityItemProps) {
    return (
        <div className="flex items-center gap-3 rounded-lg border p-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <Icon className="size-4" />
            </div>

            <div className="min-w-0">
                <p className="text-sm font-medium">
                    {label}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CheckCircle2
                        className={
                            active
                                ? "size-3.5 text-emerald-500"
                                : "size-3.5 text-muted-foreground"
                        }
                    />

                    <span>
                        {active ? "Open" : "Closed"}
                    </span>
                </div>
            </div>
        </div>
    );
}
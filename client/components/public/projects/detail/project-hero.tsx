"use client";

import Link from "next/link";
import { ArrowLeft, Globe, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface CategoryObject {
    id?: string;
    name: string;
}

interface ProjectHeroProps {
    title: string;
    excerpt?: string;
    category?: CategoryObject | string;
    isFeatured?: boolean;
    liveUrl?: string;
    githubUrl?: string;
    technologies?: string[];
}

export function ProjectHero({
    title,
    excerpt,
    category,
    isFeatured,
    liveUrl,
    githubUrl,
    technologies = [],
}: ProjectHeroProps) {
    const categoryName =
        typeof category === "object" ? category?.name : category;

    return (
        <div className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
                {/* Top Bar: Back Link & Badges */}
                <div className="flex items-center justify-between gap-2">
                    <Link href="/projects">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="-ml-2 text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft className="mr-2 size-4" />
                            All Projects
                        </Button>
                    </Link>
                    <div className="flex items-center gap-2">
                        {categoryName && (
                            <Badge variant="secondary">{categoryName}</Badge>
                        )}
                        {isFeatured && <Badge variant="default">Featured</Badge>}
                    </div>
                </div>

                {/* Title & Lead Summary */}
                <div className="space-y-3">
                    <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                        {title}
                    </h1>
                    {excerpt && (
                        <p className="text-base text-muted-foreground leading-relaxed">
                            {excerpt}
                        </p>
                    )}
                </div>
            </div>

            {/* Primary Actions & Tech Stack */}
            <div className="space-y-6 pt-4 border-t border-border/50">
                <div className="flex flex-col sm:flex-row gap-3">
                    {liveUrl && (
                        <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button className="w-full justify-between rounded-xl">
                                <span className="inline-flex items-center gap-2">
                                    <Globe className="size-4" />
                                    Live Preview
                                </span>
                                <ExternalLink className="size-4 opacity-70" />
                            </Button>
                        </a>
                    )}

                    {githubUrl && (
                        <a
                            href={githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1"
                        >
                            <Button
                                variant="outline"
                                className="w-full justify-between rounded-xl"
                            >
                                <span className="inline-flex items-center gap-2">
                                    <FaGithub className="size-4" />
                                    Source Code
                                </span>
                                <ExternalLink className="size-4 opacity-70" />
                            </Button>
                        </a>
                    )}
                </div>

                {technologies.length > 0 && (
                    <div className="space-y-2">
                        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                            Technologies Used
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                            {technologies.map((tech) => (
                                <Badge
                                    key={tech}
                                    variant="outline"
                                    className="text-xs font-normal"
                                >
                                    {tech}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
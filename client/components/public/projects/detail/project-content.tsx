"use client";

interface ProjectContentProps {
    description?: string;
    overview?: string;
}

export function ProjectContent({ description, overview }: ProjectContentProps) {
    return (
        <article className="prose dark:prose-invert max-w-none space-y-8">
            {overview && (
                <section className="space-y-3">
                    <h2 className="text-xl font-bold tracking-tight">Overview</h2>
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {overview}
                    </p>
                </section>
            )}

            {description && (
                <section className="space-y-3 pt-4 border-t border-border/40">
                    <h2 className="text-xl font-bold tracking-tight">Details & Architecture</h2>
                    <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {description}
                    </div>
                </section>
            )}
        </article>
    );
}
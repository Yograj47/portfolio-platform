"use client";

import ReactMarkdown from "react-markdown";

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
                <section className="space-y-5 border-t border-border/40 pt-6">
                    <h2 className="text-xl font-bold tracking-tight">
                        Details & Architecture
                    </h2>

                    <article className="space-y-4 text-muted-foreground leading-7">
                        <ReactMarkdown
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="mt-8 mb-4 text-3xl font-bold tracking-tight text-foreground first:mt-0">
                                        {children}
                                    </h1>
                                ),

                                h2: ({ children }) => (
                                    <h2 className="mt-8 mb-3 text-2xl font-semibold tracking-tight text-foreground">
                                        {children}
                                    </h2>
                                ),

                                h3: ({ children }) => (
                                    <h3 className="mt-6 mb-2 text-xl font-semibold text-foreground">
                                        {children}
                                    </h3>
                                ),

                                p: ({ children }) => (
                                    <p className="leading-7">
                                        {children}
                                    </p>
                                ),

                                ul: ({ children }) => (
                                    <ul className="my-4 list-disc space-y-2 pl-6">
                                        {children}
                                    </ul>
                                ),

                                ol: ({ children }) => (
                                    <ol className="my-4 list-decimal space-y-2 pl-6">
                                        {children}
                                    </ol>
                                ),

                                li: ({ children }) => (
                                    <li className="pl-1 leading-7">
                                        {children}
                                    </li>
                                ),

                                strong: ({ children }) => (
                                    <strong className="font-semibold text-foreground">
                                        {children}
                                    </strong>
                                ),

                                blockquote: ({ children }) => (
                                    <blockquote className="my-5 border-l-4 border-border pl-4 italic">
                                        {children}
                                    </blockquote>
                                ),

                                pre: ({ children }) => (
                                    <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-muted p-4 text-sm leading-6">
                                        {children}
                                    </pre>
                                ),

                                code: ({ children, className }) => {
                                    const isCodeBlock = className?.includes("language-");

                                    if (isCodeBlock) {
                                        return <code className={className}>{children}</code>;
                                    }

                                    return (
                                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-foreground">
                                            {children}
                                        </code>
                                    );
                                },

                                a: ({ children, href }) => (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="font-medium text-primary underline underline-offset-4 hover:opacity-80"
                                    >
                                        {children}
                                    </a>
                                ),
                            }}
                        >
                            {description}
                        </ReactMarkdown>
                    </article>
                </section>
            )}
        </article>
    );
}
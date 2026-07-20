// components/public/connect.tsx

import {
    ArrowUpRight,
    BookOpen,
} from "lucide-react";

import {
    FaGithub,
    FaLinkedin,
    FaXTwitter,
} from "react-icons/fa6";

const socials = [
    {
        name: "GitHub",
        icon: FaGithub,
        href: "#",
    },
    {
        name: "LinkedIn",
        icon: FaLinkedin,
        href: "#",
    },
    {
        name: "X",
        icon: FaXTwitter,
        href: "#",
    },
];

export function Connect() {
    return (
        <section className="h-full rounded-md border p-8">
            <h2 className="font-mono text-lg font-semibold">
                Connect
            </h2>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-md border p-6">
                    <div className="mb-5 flex items-center gap-2">
                        <BookOpen className="size-5 text-primary" />

                        <h3 className="font-semibold">
                            Articles
                        </h3>
                    </div>

                    <p className="mb-6 text-sm text-muted-foreground">
                        Thoughts on software engineering,
                        backend development and things I'm
                        currently learning.
                    </p>

                    <button className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary">
                        Coming Soon

                        <ArrowUpRight className="size-4" />
                    </button>
                </div>

                <div className="rounded-md border p-6">
                    <h3 className="mb-5 font-semibold">
                        Social
                    </h3>

                    <div className="space-y-3">
                        {socials.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:bg-muted"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon className="size-5" />

                                        <span>{social.name}</span>
                                    </div>

                                    <ArrowUpRight className="size-4 text-muted-foreground" />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
}
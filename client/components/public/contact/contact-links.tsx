import { contact } from "./contact.data";

const links = [
    {
        label: "Email",
        value: contact.email,
    },
    {
        label: "GitHub",
        value: contact.github
            .replace("https://", "")
            .replace("http://", ""),
    },
    {
        label: "LinkedIn",
        value: contact.linkedin
            .replace("https://", "")
            .replace("http://", ""),
    },
];

export function ContactLinks() {
    return (
        <section className="space-y-2">

            <div className="border-b pb-1 font-semibold">
                Communication
            </div>

            <div className="grid grid-cols-[120px_1fr] gap-y-2">

                {links.map((link) => (
                    <div
                        key={link.label}
                        className="contents"
                    >
                        <span className="text-muted-foreground">
                            {link.label}
                        </span>

                        <span>{link.value}</span>
                    </div>
                ))}

            </div>

        </section>
    );
}
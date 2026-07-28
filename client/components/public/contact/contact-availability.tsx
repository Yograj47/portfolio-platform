const availability = [
    "Open to full-time opportunities",
    "Open source collaboration",
    "Freelance projects",
];

export function ContactAvailability() {
    return (
        <section className="space-y-2">

            <div className="border-b pb-1 font-semibold">
                Availability
            </div>

            <div className="space-y-1">

                {availability.map((item) => (
                    <p key={item}>
                        ✓ {item}
                    </p>
                ))}

            </div>

        </section>
    );
}
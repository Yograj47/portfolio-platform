import type { ReactNode } from "react";

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({
    children,
}: PublicLayoutProps) {
    return (
        <div className="h-screen w-screen overflow-hidden bg-background">
            {children}
        </div>
    );
}
import type { ReactNode } from "react";

import { Navbar } from "@/components/public/layout/navbar";
import { Sidebar } from "@/components/public/layout/sidebar";
import { WorkspaceProvider } from "@/components/public/workspace/workspace-context";
import { Footer } from "@/components/public/layout/footer";

interface PublicLayoutProps {
    children: ReactNode;
}

export default function PublicLayout({
    children,
}: PublicLayoutProps) {
    return (
        <div className="flex h-screen flex-col overflow-hidden bg-background">
            <WorkspaceProvider>

                <Navbar />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>

                <Footer />
            </WorkspaceProvider>
        </div>
    );
}
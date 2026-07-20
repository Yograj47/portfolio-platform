import type { ReactNode } from "react";

import { Navbar } from "@/components/public/navbar";
import { Sidebar } from "@/components/public/sidebar";
import { Statusbar } from "@/components/public/statusbar";
import { WorkspaceProvider } from "@/components/public/workspace/workspace-context";

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

                <Statusbar />
            </WorkspaceProvider>
        </div>
    );
}
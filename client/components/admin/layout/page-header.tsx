import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description?: string;
    breadcrumb?: ReactNode;
    action?: ReactNode;
}
export function PageHeader({
    title,
    description,
    breadcrumb,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                {breadcrumb && (
                    <div className="mb-2">
                        {breadcrumb}
                    </div>
                )}
                
                <h1 className="text-3xl font-bold tracking-tight">
                    {title}
                </h1>

                {description && (
                    <p className="text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>

            {action && (
                <div className="flex shrink-0 items-center gap-2">
                    {action}
                </div>
            )}
        </div>
    );
}
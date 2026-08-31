import { ReactNode } from "react";

interface PageHeaderProps {
    description?: string;
    breadcrumb?: ReactNode;
    action?: ReactNode;
}

export function PageHeader({
    description,
    breadcrumb,
    action,
}: PageHeaderProps) {
    if (!description && !breadcrumb && !action) return null;

    return (
        <div className="shrink-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pb-1">
            <div className="space-y-1 min-w-0">
                {breadcrumb && (
                    <div className="text-xs font-medium text-muted-foreground">
                        {breadcrumb}
                    </div>
                )}

                {description && (
                    <p className="text-xs sm:text-sm text-muted-foreground">
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
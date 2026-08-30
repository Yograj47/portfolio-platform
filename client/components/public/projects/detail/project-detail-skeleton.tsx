import { Skeleton } from "@/components/ui/skeleton";

export function ProjectDetailSkeleton() {
    return (
        <div className="mx-auto max-w-5xl space-y-12 py-4">
            {/* Side-by-Side Hero Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Gallery Skeleton */}
                <div className="lg:col-span-7 space-y-4">
                    <Skeleton className="aspect-video w-full rounded-2xl" />
                    <div className="flex items-center gap-3">
                        <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
                        <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
                        <Skeleton className="aspect-video w-20 shrink-0 rounded-lg" />
                    </div>
                </div>

                {/* Hero Details Skeleton */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-8 w-24 rounded-lg" />
                            <Skeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <Skeleton className="h-9 w-3/4 rounded-lg" />
                        <Skeleton className="h-4 w-full rounded-md" />
                        <Skeleton className="h-4 w-5/6 rounded-md" />
                    </div>

                    <div className="space-y-4 pt-4 border-t border-border/50">
                        <div className="flex gap-3">
                            <Skeleton className="h-10 flex-1 rounded-xl" />
                            <Skeleton className="h-10 flex-1 rounded-xl" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-28 rounded-md" />
                            <div className="flex gap-2">
                                <Skeleton className="h-6 w-16 rounded-md" />
                                <Skeleton className="h-6 w-14 rounded-md" />
                                <Skeleton className="h-6 w-20 rounded-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Body Content Skeleton */}
            <div className="pt-8 border-t border-border/60 space-y-4">
                <Skeleton className="h-6 w-36 rounded-md" />
                <Skeleton className="h-4 w-full rounded-md" />
                <Skeleton className="h-4 w-11/12 rounded-md" />
                <Skeleton className="h-4 w-4/5 rounded-md" />
            </div>
        </div>
    );
}
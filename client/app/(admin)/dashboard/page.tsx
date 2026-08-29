"use client";

import { useState } from "react";

import { ImageUpload } from "@/components/admin/media/image-upload";
import type { Media } from "@/services/media.service";

export default function DashboardPage() {
    const [media, setMedia] = useState<Media | null>(null);

    return (
        <div className="max-w-xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold">
                    Media Upload
                </h1>

                <p className="text-sm text-muted-foreground">
                    Test ImageKit media uploads.
                </p>
            </div>

            <ImageUpload
                value={media}
                onChange={setMedia}
                folder="/portfolio/test"
            />

            {media && (
                <pre className="overflow-auto rounded-md border bg-muted/30 p-4 text-xs">
                    {JSON.stringify(media, null, 2)}
                </pre>
            )}
        </div>
    );

}

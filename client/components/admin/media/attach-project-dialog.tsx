"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Media } from "@/services/media.service";

interface ProjectOption {
  id: string;
  title: string;
}

interface AttachProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: Media | null;
  projects: ProjectOption[];
  loading?: boolean;
  onConfirm: (mediaId: string, projectId: string) => void;
}

export function AttachProjectDialog({
  open,
  onOpenChange,
  media,
  projects,
  loading = false,
  onConfirm,
}: AttachProjectDialogProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  function handleConfirm() {
    if (!media || !selectedProjectId) return;
    onConfirm(media.id, selectedProjectId);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Attach Media to Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <p className="text-sm text-muted-foreground">
            Select a project to attach{" "}
            <span className="font-semibold text-foreground">
              {media?.fileName}
            </span>{" "}
            to:
          </p>

          <Select
            value={selectedProjectId}
            onValueChange={(value) => setSelectedProjectId(value ?? "")}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a project..." />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedProjectId || loading}
          >
            {loading ? "Attaching..." : "Attach"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
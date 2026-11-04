"use client";
import { MediaField } from "./media-field";
import type { Media } from "@/services/media.service";

export function ImageUpload(props: {
  value?: Media | string | null;
  onChange: (value: Media | string | null) => void;
  folder?: string;
  alt?: string;
  description?: string;
  disabled?: boolean;
}) {
  return <MediaField {...props} type="IMAGE" />;
}

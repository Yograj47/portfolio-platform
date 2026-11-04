import { isAxiosError } from "axios";

export function apiError(error: unknown, fallback: string) {
  if (isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (typeof message === "string") return message;
    if (Array.isArray(message)) return message.join(", ");
  }
  return error instanceof Error ? error.message : fallback;
}

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import http from "@/lib/http";
import { apiError } from "@/lib/api-error";
import { showError, showSuccess } from "@/lib/toast";

export const messageStatus = z.enum(["UNREAD", "READ", "REPLIED"]);
export type MessageStatus = z.infer<typeof messageStatus>;
const messageSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  subject: z.string(),
  message: z.string(),
  status: messageStatus,
  createdAt: z.string(),
});
const inboxSchema = z.object({
  items: z.array(messageSchema),
  total: z.number().int().nonnegative(),
  page: z.number(),
  limit: z.number(),
});
export type InboxMessage = z.infer<typeof messageSchema>;

export function useMessages(page: number, status: string, search: string) {
  const cache = useQueryClient();
  const query = useQuery({
    queryKey: ["messages", { page, status, search }],
    queryFn: async ({ signal }) => {
      const response = await http.get("/messages", {
        signal,
        params: {
          page,
          limit: 12,
          status: status || undefined,
          search: search || undefined,
        },
      });
      return inboxSchema.parse(response.data.data);
    },
    refetchInterval: 60000,
  });
  const invalidate = () => {
    void cache.invalidateQueries({ queryKey: ["messages"] });
    void cache.invalidateQueries({ queryKey: ["dashboard-summary"] });
  };
  const update = useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: MessageStatus;
    }) => {
      const response = await http.patch(`/messages/${id}`, { status });
      return messageSchema.parse(response.data.data);
    },
    onSuccess: invalidate,
    onError: (error) => showError(apiError(error, "Could not update message.")),
  });
  const remove = useMutation({
    mutationFn: (id: string) => http.delete(`/messages/${id}`),
    onSuccess: () => {
      invalidate();
      showSuccess("Message deleted.");
    },
    onError: (error) => showError(apiError(error, "Could not delete message.")),
  });
  return { query, update, remove };
}

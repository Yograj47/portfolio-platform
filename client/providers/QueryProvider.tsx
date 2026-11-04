"use client";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

function createClient() {
  const client = new QueryClient({
    mutationCache: new MutationCache({
      onSuccess: () => {
        for (const key of [
          "dashboard-summary",
          "portfolio-home-v2",
          "public-project",
        ]) {
          void client.invalidateQueries({ queryKey: [key] });
        }
      },
    }),
    defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
  });
  return client;
}
export default function QueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(createClient);
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}

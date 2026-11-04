"use client";
import { useQuery } from "@tanstack/react-query";
import http from "@/lib/http";
import { dashboardSchema } from "@/lib/validations/dashboard";
export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async ({ signal }) => {
      const response = await http.get("/dashboard/summary", { signal });
      if (response.data?.success !== true)
        throw new Error("Dashboard response is incomplete");
      return dashboardSchema.parse(response.data.data);
    },
    retry: false,
    networkMode: "always",
    staleTime: 30000,
    refetchOnMount: "always",
    refetchInterval: 60000,
  });
}

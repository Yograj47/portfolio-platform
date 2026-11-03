"use client";
import { useQuery } from "@tanstack/react-query";
import { skillService } from "@/services/skill.service";
import { timelineService } from "@/services/timeline.service";
export function useSkillsQuery() {
  return useQuery({
    queryKey: ["skills"],
    retry: false,
    queryFn: async ({ signal }) =>
      (await skillService.findAll(signal)).data.data,
  });
}
export function useTimelinesQuery() {
  return useQuery({
    queryKey: ["timelines"],
    retry: false,
    queryFn: async ({ signal }) =>
      (await timelineService.findAll(signal)).data.data,
  });
}

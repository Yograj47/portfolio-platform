import type { Skill } from "@/types/portfolio";
import type { ApiResponse } from "@/types/api";
import http from "@/lib/http";
import { publicHttp } from "@/lib/public-http";

import type {
  CreateSkillSchema,
  UpdateSkillSchema,
} from "@/lib/validations/skill";

export const skillService = {
  findAll(signal?: AbortSignal) {
    return publicHttp.get<ApiResponse<Skill[]>>("/skills", { signal });
  },

  create(data: CreateSkillSchema) {
    return http.post("/skills", data);
  },

  update(id: string, data: UpdateSkillSchema) {
    return http.patch(`/skills/${id}`, data);
  },

  remove(id: string) {
    return http.delete(`/skills/${id}`);
  },
};

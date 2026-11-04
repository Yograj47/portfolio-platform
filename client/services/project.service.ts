import { normalizeOptionalFields } from "@/lib/api-payload";
import type { PublicProject } from "@/types/portfolio";
import type { ApiResponse } from "@/types/api";
import http from "@/lib/http";
import { publicHttp } from "@/lib/public-http";

import type {
  CreateProjectSchema,
  UpdateProjectSchema,
} from "@/lib/validations/project";

export const projectService = {
  findAllAdmin() {
    return http.get<ApiResponse<PublicProject[]>>("/projects/admin");
  },

  findAll(signal?: AbortSignal) {
    return publicHttp.get<ApiResponse<PublicProject[]>>("/projects", {
      signal,
    });
  },

  findBySlug(slug: string, signal?: AbortSignal) {
    return publicHttp.get<ApiResponse<PublicProject>>(
      `/projects/slug/${encodeURIComponent(slug)}`,
      { signal },
    );
  },

  create(data: CreateProjectSchema) {
    return http.post(
      "/projects",
      normalizeOptionalFields(data, ["githubUrl", "liveUrl"]),
    );
  },

  update(id: string, data: UpdateProjectSchema) {
    return http.patch(
      `/projects/${id}`,
      normalizeOptionalFields(data, ["githubUrl", "liveUrl"]),
    );
  },

  remove(id: string) {
    return http.delete(`/projects/${id}`);
  },
};

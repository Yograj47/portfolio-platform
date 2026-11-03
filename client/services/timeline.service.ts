import { normalizeOptionalFields } from "@/lib/api-payload";
import type { Timeline } from "@/types/portfolio";
import type { ApiResponse } from "@/types/api";
import http from "@/lib/http";
import { publicHttp } from "@/lib/public-http";

import type {
  CreateTimelineSchema,
  UpdateTimelineSchema,
} from "@/lib/validations/timeline";

export const timelineService = {
  findAll(signal?: AbortSignal) {
    return publicHttp.get<ApiResponse<Timeline[]>>("/timelines", { signal });
  },

  create(data: CreateTimelineSchema) {
    return http.post("/timelines", normalizeOptionalFields(data, ["endDate"]));
  },

  update(id: string, data: UpdateTimelineSchema) {
    return http.patch(
      `/timelines/${id}`,
      normalizeOptionalFields(data, ["endDate"]),
    );
  },

  remove(id: string) {
    return http.delete(`/timelines/${id}`);
  },
};

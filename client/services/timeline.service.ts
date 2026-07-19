import http from "@/lib/http";

import type {
    CreateTimelineSchema,
    UpdateTimelineSchema,
} from "@/lib/validations/timeline";

export const timelineService = {
    findAll() {
        return http.get("/timeline");
    },

    findOne(id: string) {
        return http.get(`/timeline/${id}`);
    },

    create(data: CreateTimelineSchema) {
        return http.post("/timeline", data);
    },

    update(id: string, data: UpdateTimelineSchema) {
        return http.patch(`/timeline/${id}`, data);
    },

    remove(id: string) {
        return http.delete(`/timeline/${id}`);
    },
};
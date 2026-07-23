import http from "@/lib/http";

import type {
    CreateTimelineSchema,
    UpdateTimelineSchema,
} from "@/lib/validations/timeline";

export const timelineService = {
    findAll() {
        return http.get("/timelines");
    },

    findOne(id: string) {
        return http.get(`/timelines/${id}`);
    },

    create(data: CreateTimelineSchema) {
        return http.post("/timelines", data);
    },

    update(id: string, data: UpdateTimelineSchema) {
        return http.patch(`/timelines/${id}`, data);
    },

    remove(id: string) {
        return http.delete(`/timelines/${id}`);
    },
};
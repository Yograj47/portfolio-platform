import http from "@/lib/http";

import type {
    CreateSkillSchema,
    UpdateSkillSchema,
} from "@/lib/validations/skill";

export const skillService = {
    findAll() {
        return http.get("/skills");
    },

    findOne(id: string) {
        return http.get(`/skills/${id}`);
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
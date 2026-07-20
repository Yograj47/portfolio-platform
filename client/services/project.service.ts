import http from "@/lib/http";

import type {
    CreateProjectSchema,
    UpdateProjectSchema,
} from "@/lib/validations/project";

export const projectService = {
    findAll() {
        return http.get("/projects");
    },

    findOne(id: string) {
        return http.get(`/projects/${id}`);
    },

    create(data: CreateProjectSchema) {
        return http.post("/projects", data);
    },

    update(id: string, data: UpdateProjectSchema) {
        return http.patch(`/projects/${id}`, data);
    },

    remove(id: string) {
        return http.delete(`/projects/${id}`);
    },
};
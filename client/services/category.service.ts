import http from "@/lib/http";
import type {
    CreateCategorySchema,
    UpdateCategorySchema,
} from "@/lib/validations/category";

export const categoryService = {
    findAll: () =>
        http.get("/categories"),

    findOne: (id: string) =>
        http.get(`/categories/${id}`),

    create: (data: CreateCategorySchema) =>
        http.post("/categories", data),

    update: (id: string, data: UpdateCategorySchema) =>
        http.patch(`/categories/${id}`, data),

    remove: (id: string) =>
        http.delete(`/categories/${id}`),
};
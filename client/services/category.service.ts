import http from "@/lib/http";
import { publicHttp } from "@/lib/public-http";
import type {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/lib/validations/category";

export const categoryService = {
  findAll: (signal?: AbortSignal) => publicHttp.get("/categories", { signal }),

  create: (data: CreateCategorySchema) => http.post("/categories", data),

  update: (id: string, data: UpdateCategorySchema) =>
    http.patch(`/categories/${id}`, data),

  remove: (id: string) => http.delete(`/categories/${id}`),
};

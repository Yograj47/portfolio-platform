import http from "@/lib/http";

export const authService = {
    login: (data: { email: string; password: string }) =>
        http.post("/auth/login", data),

    logout: () =>
        http.post("/auth/logout"),

    refresh: () =>
        http.post("/auth/refresh"),

    me: () =>
        http.get("/users/me"),

    updateProfile: (data: {
        name: string;
        avatar?: string
    }) =>
        http.patch("/users/me", data)
}
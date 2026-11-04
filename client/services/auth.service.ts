import { normalizeOptionalFields } from "@/lib/api-payload";
import http from "@/lib/http";

import { UpdateProfileData } from "@/lib/validations/profile";

export const authService = {
  login: (data: { email: string; password: string }) =>
    http.post("/auth/login", data),

  logout: () => http.post("/auth/logout"),

  refresh: () => http.post("/auth/refresh"),

  me: (signal?: AbortSignal) => http.get("/users/me", { signal }),

  profile: () => http.get("/users/profile"),

  updateProfile: (data: UpdateProfileData) =>
    http.patch(
      "/users/me",
      normalizeOptionalFields(data, [
        "avatar",
        "githubUrl",
        "linkedinUrl",
        "resumeUrl",
      ]),
    ),
};

import { useAuthStore } from "@/store/auth.store";
import axios, { type InternalAxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/types/api";
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});
type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };
let refreshRequest: Promise<string> | null = null;
async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = http
      .post<ApiResponse<{ accessToken: string }>>("/auth/refresh")
      .then((response) => {
        const token = response.data.data.accessToken;
        useAuthStore.getState().setAccessToken(token);
        return token;
      })
      .catch((error: unknown) => {
        useAuthStore.getState().logout();
        throw error;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }
  return refreshRequest;
}
http.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) config.headers.set("Authorization", "Bearer " + token);
  return config;
});
http.interceptors.response.use(
  (response) => response,
  async (error: unknown) => {
    if (!axios.isAxiosError(error)) return Promise.reject(error);
    const request = error.config as RetryConfig | undefined;
    if (
      error.response?.status !== 401 ||
      !request ||
      request._retry ||
      request.url?.startsWith("/auth/")
    )
      return Promise.reject(error);
    request._retry = true;
    try {
      const currentToken = useAuthStore.getState().accessToken;
      const previousToken = request.headers.get("Authorization");
      // A late 401 may belong to the token that a concurrent request already replaced.
      const token =
        currentToken && previousToken !== "Bearer " + currentToken
          ? currentToken
          : await refreshAccessToken();
      request.headers.set("Authorization", "Bearer " + token);
      return http(request);
    } catch (refreshError) {
      return Promise.reject(refreshError);
    }
  },
);
export default http;

import axios from "axios";

const http = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    }
})

type RetryConfig = {
    _retry?: boolean;
}

http.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config as RetryConfig & typeof error.config;
        const url = originalRequest.url;

        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            url !== "/auth/login" &&
            url !== "/auth/refresh"
        ) {
            originalRequest._retry = true;

            try {
                await http.post("/auth/refresh");
                return http(originalRequest)
            } catch (refreshError) {
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error);
    }

)

export default http;  
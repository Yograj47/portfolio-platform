import axios from "axios";

// Allow a Render cold start, but never leave visitors waiting indefinitely.
// Public reads must not depend on login cookies or token refresh.
export const publicHttp = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 75000,
  withCredentials: false,
  headers: { Accept: "application/json" },
});

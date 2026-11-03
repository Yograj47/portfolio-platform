import { cvSchema, type CvContent } from "./validations/cv";
class HttpError extends Error {
  constructor(readonly status: number) {
    super("Portfolio request failed");
  }
}
class InvalidPortfolioError extends Error {}
export class PortfolioTimeoutError extends Error {
  constructor() {
    super("The portfolio is taking too long to load. Please try again.");
  }
}
function abortError() {
  return new DOMException("Request cancelled", "AbortError");
}
function wait(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(abortError());
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(abortError());
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
}
interface LoaderOptions {
  signal?: AbortSignal;
  baseUrl?: string;
  timeoutMs?: number;
  requestTimeoutMs?: number;
  retryDelayMs?: number;
  fetcher?: typeof fetch;
  now?: () => number;
  sleep?: (ms: number, signal?: AbortSignal) => Promise<void>;
}
/** Health probes and the complete content request share one bounded startup budget. */
export async function loadPortfolio(
  options: LoaderOptions = {},
): Promise<CvContent> {
  const {
    signal,
    baseUrl = process.env.NEXT_PUBLIC_API_URL,
    timeoutMs = 150000,
    requestTimeoutMs = 10000,
    retryDelayMs = 2500,
    fetcher = fetch,
    now = Date.now,
    sleep = wait,
  } = options;
  if (!baseUrl || !/^https?:\/\//.test(baseUrl))
    throw new Error("Portfolio API is not configured");
  const base = baseUrl.replace(/\/+$/, "");
  const deadline = now() + timeoutMs;
  async function request(endpoint: string): Promise<unknown> {
    if (signal?.aborted) throw abortError();
    const remaining = deadline - now();
    if (remaining <= 0) throw new PortfolioTimeoutError();
    const controller = new AbortController();
    const onAbort = () => controller.abort();
    signal?.addEventListener("abort", onAbort, { once: true });
    const timer = setTimeout(
      () => controller.abort(),
      Math.min(requestTimeoutMs, remaining),
    );
    try {
      const response = await fetcher(base + endpoint, {
        signal: controller.signal,
        cache: "no-store",
        credentials: "omit",
        headers: { Accept: "application/json" },
      });
      if (!response.ok) throw new HttpError(response.status);
      return (await response.json()) as unknown;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
    }
  }
  while (now() < deadline) {
    if (signal?.aborted) throw abortError();
    try {
      const health = (await request("/health")) as {
        success?: boolean;
        data?: { status?: string };
      } | null;
      if (health?.success !== true || health.data?.status !== "ok")
        throw new Error("Backend is not ready");
      const response = (await request("/portfolio")) as {
        success?: boolean;
        data?: unknown;
      } | null;
      const parsed = cvSchema.safeParse(response?.data);
      if (response?.success !== true || !parsed.success)
        throw new InvalidPortfolioError("The portfolio response is incomplete");
      return parsed.data;
    } catch (error) {
      if (signal?.aborted) throw abortError();
      if (error instanceof InvalidPortfolioError) throw error;
      if (
        error instanceof HttpError &&
        error.status < 500 &&
        ![408, 429].includes(error.status)
      )
        throw error;
      const remaining = deadline - now();
      if (remaining <= 0) break;
      await sleep(Math.min(retryDelayMs, remaining), signal);
    }
  }
  throw new PortfolioTimeoutError();
}
